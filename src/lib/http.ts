import axios, { AxiosInstance } from 'axios';
import { ServiceIds } from './constants';
import {
  AnswerQuestionRequest,
  AppointmentSetRequest,
  AppointmentSetResponse,
  LocationServicesRequest,
  LocationServicesResponse,
  PrepareVisitData,
  PrepareVisitResponse,
  SearchAvailableDatesRequest,
  SearchAvailableDatesResponse,
  SearchAvailableSlotsRequest,
  SearchAvailableSlotsResponse,
} from './api';
import { DateUtils } from './utils';
import { EnrichedService, Service } from './internal-types';
import { toService } from './mappers';
import { GetUserInfoResponse } from '@src/lib/api/user-info';

export const BaseURL = 'https://piba-api.myvisit.com/CentralAPI';
export const PartialURLs = {
  createAnonymousSession: 'UserCreateAnonymous',
  locationSearch: 'LocationSearch',
  locationServices: 'LocationGetServices',
  searchAvailableDates: 'SearchAvailableDates',
  searchAvailableSlots: 'SearchAvailableSlots',
  setAppointment: 'AppointmentSet',
  cancelAppointment: 'AppointmentCancel',
  prepareVisit: 'Organization/56/PrepareVisit',
  getUserInfo: 'UserGetInfo',
  answer: (visitToken: string) => `PreparedVisit/${visitToken}/Answer`,
};

export const Urls = {
  createAnonymousSession: `${BaseURL}/${PartialURLs.createAnonymousSession}`,
  locationSearch: `${BaseURL}/${PartialURLs.locationSearch}`,
  locationServices: `${BaseURL}/${PartialURLs.locationServices}`,
  searchAvailableDates: `${BaseURL}/${PartialURLs.searchAvailableDates}`,
  searchAvailableSlots: `${BaseURL}/${PartialURLs.searchAvailableSlots}`,
  setAppointment: `${BaseURL}/${PartialURLs.setAppointment}`,
  cancelAppointment: `${BaseURL}/${PartialURLs.cancelAppointment}`,
  prepareVisit: `${BaseURL}/${PartialURLs.prepareVisit}`,
  getUserInfo: `${BaseURL}/${PartialURLs.getUserInfo}`,
  answer: (visitToken: string) => `${BaseURL}/${PartialURLs.answer(visitToken)}`,
};

export class HttpService {
  private readonly httpClient: AxiosInstance;

  constructor(onAuthError: () => Promise<void>) {
    this.httpClient = axios.create({
      headers: {
        // MyVisit default configuration
        'application-api-key': 'D7662A08-48D1-4BC8-9E45-7F9DDF8987E3',
        'application-name': 'PibaV1',
        'accept-language': 'en',
        pragma: 'no-cache',
        'cache-control': 'no-cache',
      },
      withCredentials: true,
    });
    this.addRejectInterceptor(onAuthError);
  }

  public updateVisitToken = (visitToken: string) => {
    this.httpClient.defaults.headers['Preparedvisittoken'] = visitToken;
  };

  public addRejectInterceptor = (func: () => Promise<void>) => {
    this.httpClient.interceptors.response.use(
      (res) => res,
      async (error) => {
        const status = error?.response?.status;
        if (status === 401 || status === 403) {
          await func();
        }
      },
    );
  };

  public async getServiceIdByLocationId(
    locationId: number,
    serviceTypeId: number = ServiceIds.BiometricPassportAppointment,
  ): Promise<Service[]> {
    const params: LocationServicesRequest = {
      locationId,
      serviceTypeId,
    };
    return this.httpClient
      .get<LocationServicesResponse>(Urls.locationServices, { params })
      .then((res) => (res.data.Results ?? []).map(toService));
  }

  public async getCalendars(serviceId: number, startDate: number): Promise<EnrichedService[]> {
    const params: SearchAvailableDatesRequest = {
      maxResults: 100,
      startDate: DateUtils.toApiFormattedDate(startDate),
      serviceId,
    };
    const result = await this.httpClient.get<SearchAvailableDatesResponse>(Urls.searchAvailableDates, { params });
    return (result.data.Results ?? []).map((result) => ({
      ...result,
      serviceId,
    }));
  }

  public getAvailableSlotByCalendar(calendarId: number, serviceId: number): Promise<number[]> {
    const params: SearchAvailableSlotsRequest = {
      CalendarId: calendarId,
      ServiceId: serviceId,
      dayPart: 0,
    };
    return this.httpClient
      .get<SearchAvailableSlotsResponse>(Urls.searchAvailableSlots, { params })
      .then((res) => (res?.data?.Results ?? []).map(({ Time }) => Time));
  }

  public prepareVisit(): Promise<PrepareVisitData> {
    return this.httpClient.post<PrepareVisitResponse>(Urls.prepareVisit).then((res) => res.data.Data);
  }

  public answer(answerRequest: AnswerQuestionRequest): Promise<PrepareVisitData> {
    return this.httpClient
      .post<PrepareVisitResponse>(Urls.answer(answerRequest.PreparedVisitToken), answerRequest)
      .then((res) => res.data.Data);
  }

  public setAppointment(visitToken: string, params: AppointmentSetRequest): Promise<AppointmentSetResponse | null> {
    return this.httpClient
      .get<AppointmentSetResponse>(Urls.setAppointment, {
        params,
        headers: {
          PreparedVisitToken: visitToken,
        },
      })
      .then((res) => res.data);
  }

  public getUserInfo(): Promise<GetUserInfoResponse | null> {
    return this.httpClient.get(Urls.getUserInfo).then((res) => res.data);
  }
}
