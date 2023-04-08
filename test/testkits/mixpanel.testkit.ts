interface MixpanelEvent {
  name: string;
  data: any;
}

export class MixpanelTestkit {
  private reports: MixpanelEvent[] = [];
  private userId = '';
  private token = '';

  init = (token: string): void => {
    this.token = token;
  };

  public identify(id: string): void {
    this.userId = id;
  }

  public track(event: string, data: any): void {
    this.reports.push({ name: event, data });
  }

  reset = () => {
    this.reports = [];
    this.userId = '';
  };

  getReports(): MixpanelEvent[] {
    return this.reports;
  }

  getToken(): string {
    return this.token;
  }

  getUserId(): string {
    return this.userId;
  }
}
