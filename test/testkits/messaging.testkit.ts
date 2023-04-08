export class MessagingTestkit {
  private readonly listeners: ((...args: any[]) => void)[] = [];

  sendMessage = async (message: any): Promise<void> => {
    for (let i = 0; i < this.listeners.length; i++) {
      await this.listeners[i](message);
    }
  };

  addListener = (listener: (...args: any[]) => void): void => {
    this.listeners.push(listener);
  };
}
