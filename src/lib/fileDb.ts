// Simple file based db, should be used in standalone mode only

import fs from 'fs-extra';
import { cloneDeep } from './utils';
import { formatTime } from './time';
import { throttle } from 'radash';

type SaveContent<T> = {
  data: T;
  timestamp: number;
  timeString: string;
};

type FuncSave = () => void;

export class FileDb<T> {
  public data: T;
  private filePath: string;
  private saveImmediately: FuncSave = () => {};
  private saveThrottle: FuncSave = () => {};

  constructor({ filePath, defaultData }: { filePath: string; defaultData: T }) {
    this.filePath = filePath;
    this.data = cloneDeep(defaultData);
    this.load();
    this.buildSave();
    this.save();
  }
  private buildSave() {
    const save: FuncSave = () => {
      try {
        const saveContent: SaveContent<T> = {
          data: this.data,
          timestamp: Date.now(),
          timeString: formatTime(Date.now()),
        };
        fs.ensureFileSync(this.filePath);
        fs.writeFileSync(this.filePath, JSON.stringify(saveContent, null, 2));
      } catch (error) {
        console.error(`Failed to save data to ${this.filePath}`, error);
      }
    };
    this.saveImmediately = save;
    this.saveThrottle = throttle({ interval: 500 }, save);
  }

  private load() {
    if (!fs.existsSync(this.filePath)) {
      return;
    }
    try {
      const fileContent = fs.readFileSync(this.filePath, 'utf8');
      const saveContent = JSON.parse(fileContent) as SaveContent<T>;
      this.data = saveContent.data;
    } catch (error) {
      console.error(`Failed to load data from ${this.filePath}`, error);
    }
  }

  public save(immediately = false) {
    if (immediately) {
      this.saveImmediately();
    } else {
      this.saveThrottle();
    }
  }
}
