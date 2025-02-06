import fs from 'fs-extra';
import { formatTime } from '../time';
import { lock, unlock } from 'proper-lockfile';
import { OperationOptions } from 'retry';
import { guard } from 'radashi';

type SaveContent<T> = {
  data: T;
  timestamp: number;
  timeString: string;
};

const retries: OperationOptions = {
  minTimeout: 4,
  maxTimeout: 10,
  forever: true,
};

export abstract class FileDbBase<T> {
  protected filePath: string;
  protected onSave: (saveContent: SaveContent<T>) => void;
  protected onLoad: (data: unknown) => Promise<T>;

  constructor({
    filePath,
    onLoad = () => Promise.resolve({} as T),
    onSave = () => {},
  }: {
    filePath: string;
    onLoad?: (data: unknown) => Promise<T>;
    onSave?: (saveContent: SaveContent<T>) => void;
  }) {
    this.filePath = filePath;
    this.onLoad = onLoad;
    this.onSave = onSave;
  }

  abstract select<P>(selector: (data: T) => P): Promise<P>;
  abstract update(updater: (data: T) => T): Promise<void>;

  protected async load() {
    const dataLoaded = await guard(async () => {
      const saveContent: SaveContent<T> = await fs.readJson(
        this.filePath,
        'utf8'
      );
      return saveContent.data;
    });

    const dataFixed = await this.onLoad(dataLoaded || {});
    return dataFixed;
  }

  protected async save(data: T) {
    const saveContent: SaveContent<T> = {
      data,
      timestamp: Date.now(),
      timeString: formatTime(),
    };
    this.onSave(saveContent);
    await fs.ensureFile(this.filePath);
    await fs.writeJSON(this.filePath, saveContent);
  }

  protected async lock() {
    await fs.ensureFile(this.filePath);
    await lock(this.filePath, {
      retries,
    });
  }

  protected async unlock() {
    await fs.ensureFile(this.filePath);
    await unlock(this.filePath);
  }
}
