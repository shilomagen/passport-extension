export class LocalStorageTestkit {
  private storage: Record<string, any> = {};

  clear(): void {
    this.storage = {};
  }
  async get(key: string): Promise<any> {
    const keyValue = this.storage[key];
    return keyValue
      ? Promise.resolve({
          [key]: keyValue,
        })
      : Promise.resolve({});
  }

  remove(key: string): Promise<void> {
    delete this.storage[key];
    return Promise.resolve();
  }

  async set(value: Record<string, any>): Promise<void> {
    const key = Object.keys(value)[0];
    this.storage = {
      ...this.storage,
      [key]: value[key],
    };
  }
}
