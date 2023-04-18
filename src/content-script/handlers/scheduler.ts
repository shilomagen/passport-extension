import { BaseHandler, BaseParams } from '@src/content-script/handlers/index';
import { ScheduleAppointmentTask } from '@src/content-script/task';
import { AppointmentScheduler } from '@src/lib/appointment-scheduler';
import { ResponseStatus, UserVisitSuccessData } from '@src/lib/internal-types';
import { ErrorCode } from '@src/lib/constants';
import { results as Content } from '@src/content.json';
import { AnalyticsEventType } from '@src/services/analytics';

export interface ScheduleHandleResponse {
  isDone: boolean;
}

export class Handler extends BaseHandler<ScheduleAppointmentTask, ScheduleHandleResponse> {
  constructor(protected readonly params: BaseParams, protected readonly userVisit: UserVisitSuccessData) {
    super(params);
  }

  async handle(task: ScheduleAppointmentTask): Promise<ScheduleHandleResponse> {
    const { httpService } = this.params;
    const appointmentScheduler = new AppointmentScheduler(httpService);
    const res = await appointmentScheduler.scheduleAppointment(this.userVisit, task.params.slot);
    if (res.status === ResponseStatus.Success) {
      alert(Content.scheduledSuccessfully);
      await this.params.analytics.report({
        type: AnalyticsEventType.AppointmentScheduled,
        payload: {
          ...task.params.slot,
        },
      });
      return { isDone: true };
    } else if (res.data.errorCode === ErrorCode.AlreadyHadAnAppointment) {
      alert(Content.userHasAppointment);
      return { isDone: true };
    } else {
      return {
        isDone: false,
      };
    }
  }
}
