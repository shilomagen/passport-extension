import { BaseHandler, BaseParams } from '@src/content-script/handlers/index';
import { ScheduleAppointmentTask } from '@src/content-script/task';
import { AppointmentScheduler } from '@src/lib/appointment-scheduler';
import { ResponseStatus, SearchStatus, SearchStatusType, UserVisitSuccessData } from '@src/lib/internal-types';
import { ErrorCode } from '@src/lib/constants';
import Content from '@src/content.json';

export interface ScheduleHandleResponse {
  isDone: boolean;
  status?: SearchStatus
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
      alert(Content.results.scheduledSuccessfully);
      return { isDone: true };
    } else if (res.data.errorCode === ErrorCode.AlreadyHadAnAppointment) {
      alert(Content.results.userHasAppointment);
      return { isDone: true };
    } else {
      return { isDone: false, status: { type: SearchStatusType.Warning, message: Content.errors.retryingSetAppointment } };
    }
  }
}
