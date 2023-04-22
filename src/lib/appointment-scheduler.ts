import { AppointmentSetRequest, AppointmentSetResponse } from '@src/lib/api';
import {
  aFailedResponse,
  aSuccessResponse,
  EnrichedSlot,
  SetAppointmentResponse,
  UserVisitSuccessData,
} from '@src/lib/internal-types';
import { ErrorCode, MockPosition } from '@src/lib/constants';
import { HttpService } from '@src/lib/http';

enum ErrorStrings {
  DoubleBook = 'לא ניתן לתאם תור חדש לפני ביטול התור הקיים',
}

export class AppointmentScheduler {
  constructor(private readonly httpService: HttpService) {}

  private static resolveError(response: AppointmentSetResponse): ErrorCode {
    if (response.ErrorMessage === 'General server error') {
      return ErrorCode.SetAppointmentGeneralError;
    } else if (Array.isArray(response.Messages)) {
      const errorStr = response.Messages.join('');
      if (errorStr.includes(ErrorStrings.DoubleBook)) {
        return ErrorCode.AlreadyHadAnAppointment;
      } else {
        return ErrorCode.General;
      }
    }
    return ErrorCode.General;
  }

  async scheduleAppointment(userVisit: UserVisitSuccessData, slot: EnrichedSlot): Promise<SetAppointmentResponse> {
    const { serviceId, date, timeSinceMidnight } = slot;
    const { visitId, visitToken } = userVisit;
    const setAppointmentRequest: AppointmentSetRequest = {
      ServiceId: serviceId,
      appointmentDate: date,
      appointmentTime: timeSinceMidnight,
      position: MockPosition,
      preparedVisitId: visitId,
    };

    try {
      const response = await this.httpService.setAppointment(visitToken, setAppointmentRequest);
      return response?.Success
        ? aSuccessResponse(response.Results!)
        : aFailedResponse(AppointmentScheduler.resolveError(response!));
    } catch (err) {
      console.error(err)
      return aFailedResponse(ErrorCode.General)
    }
  }
}
