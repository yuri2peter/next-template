// Simple file based db, should be used in low-frequency update scenario only

import { FileDbBase } from './FileDbBase';

export class FileDbPersistent<T> extends FileDbBase<T> {
  public async select<P>(selector: (data: T) => P) {
    try {
      await this.lock();
      const data = await this.load();
      return selector(data);
    } finally {
      await this.unlock();
    }
  }

  public async update(updater: (data: T) => T) {
    try {
      await this.lock();
      const data = await this.load();
      const updatedData = updater(data);
      await this.save(updatedData);
    } finally {
      await this.unlock();
    }
  }
}
