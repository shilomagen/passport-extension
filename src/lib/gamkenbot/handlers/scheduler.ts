import { BaseHandler, BaseParams } from '@src/lib/gamkenbot/handlers/index';
import { ScheduleAppointmentTask } from '../task';
import { AppointmentScheduler } from '@src/lib/appointment-scheduler';
import { ResponseStatus, SearchStatus, SearchStatusType, UserVisitSuccessData } from '@src/lib/internal-types';
import { ErrorCode } from '@src/lib/constants';
import Content from '@src/content.json';
import { toAppointment } from '@src/lib/mappers';

export interface ScheduleHandleResponse {
  isDone: boolean;
  status?: SearchStatus;
}

export class Handler extends BaseHandler<ScheduleAppointmentTask, ScheduleHandleResponse> {
  constructor(protected readonly params: BaseParams, protected readonly userVisit: UserVisitSuccessData) {
    super(params);
  }

  async handle(task: ScheduleAppointmentTask): Promise<ScheduleHandleResponse> {
    const { httpService } = this.params;
    const appointmentScheduler = new AppointmentScheduler(httpService);

    const slot = task.params.slot;
    const res = await appointmentScheduler.scheduleAppointment(this.userVisit, task.params.slot);
    if (res.status === ResponseStatus.Success) {
      const { city, address, date, hour } = toAppointment(slot);
      const message = Content.results.scheduledSuccessfully
        .replace('{0}', `${city} (${address})`)
        .replace('{1}', date)
        .replace('{2}', hour);

      return { isDone: true, status: { type: SearchStatusType.Complete, message } };
    } else if (res.data.errorCode === ErrorCode.AlreadyHadAnAppointment) {
      return { isDone: true, status: { type: SearchStatusType.Error, message: Content.results.userHasAppointment } };
    } else {
      return {
        isDone: false,
        status: { type: SearchStatusType.Warning, message: Content.errors.retryingSetAppointment },
      };
    }
  }
}
