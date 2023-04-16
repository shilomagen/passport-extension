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

export const BaseURL = 'https://central.myvisit.com/CentralAPI';
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
        'application-api-key': '8640a12d-52a7-4c2a-afe1-4411e00e3ac4',
        'application-name': 'myVisit.com v3.5',
        'accept-language': 'en',
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

  public async getCalendars(serviceId: number): Promise<EnrichedService[]> {
    const params: SearchAvailableDatesRequest = {
      maxResults: 100,
      startDate: DateUtils.toApiFormattedDate(Date.now()),
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
