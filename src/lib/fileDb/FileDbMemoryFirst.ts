// Simple file based db, should be used in low-frequency update scenario only
// Warning: this db is not thread-safe, so it should be used in single-threaded environment only, Next.js server is not single-threaded

import { FileDbBase } from './FileDbBase';

export class FileDbMemoryFirst<T> extends FileDbBase<T> {
  private data: T | null = null;

  public async select<P>(selector: (data: T) => P) {
    if (this.data) {
      return selector(this.data);
    }
    try {
      await this.lock();
      this.data = await this.load();
      return selector(this.data!);
    } catch (error) {
      throw error;
    } finally {
      await this.unlock();
    }
  }

  public async update(updater: (data: T) => T) {
    try {
      await this.lock();
      if (!this.data) {
        this.data = await this.load();
      }
      this.data = updater(this.data!);
      await this.save(this.data);
    } finally {
      await this.unlock();
    }
  }
}
