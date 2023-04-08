export class LocalStorageTestkit {
  private storage: Record<string, any> = {};

  clear(): void {
    this.storage = {};
  }
  async get(key: string): Promise<any> {
    return Promise.resolve({
      [key]: this.storage[key],
    });
  }

  async set(value: Record<string, any>): Promise<void> {
    this.storage = {
      ...this.storage,
      ...value,
    };
  }
}
