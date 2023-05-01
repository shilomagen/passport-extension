import axios, { AxiosError, AxiosInstance } from 'axios';
import fetchAdapter from '@vespaiach/axios-fetch-adapter';
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
  answer: (visitToken: string): string => `PreparedVisit/${visitToken}/Answer`,
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
  answer: (visitToken: string): string => `${BaseURL}/${PartialURLs.answer(visitToken)}`,
};

export class HttpService {
  private readonly errorHandler: (err: AxiosError) => Promise<void>;

  private httpClient: AxiosInstance;
  private static readonly DEFAULT_HEADERS = {
    // MyVisit default configuration
    'application-api-key': 'D7662A08-48D1-4BC8-9E45-7F9DDF8987E3',
    'application-name': 'PibaV1',
    'accept-language': 'en',
  };

  constructor(errorHandler: (err: AxiosError) => Promise<void>) {
    this.errorHandler = errorHandler;
    this.httpClient = this.setupClient();
  }

  private setupClient = (headers: Record<string, string> = {}): AxiosInstance => {
    const instance = axios.create({
      adapter: fetchAdapter,
      withCredentials: true,
      headers: {
        ...HttpService.DEFAULT_HEADERS,
        ...headers,
      },
    });

    this.addRejectInterceptor(instance, this.errorHandler);

    return instance;
  };

  public updateVisitToken = (visitToken: string): void => {
    this.httpClient = this.setupClient({ Preparedvisittoken: visitToken });
  };

  public addRejectInterceptor = (instance: AxiosInstance, errorHandler: (err: AxiosError) => Promise<void>): void => {
    instance.interceptors.response.use(
      (res) => res,
      async (error: AxiosError) => {
        await errorHandler(error);
        return Promise.reject(error);
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
      maxResults: 31,
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

  public setAppointment(params: AppointmentSetRequest): Promise<AppointmentSetResponse | null> {
    return this.httpClient
      .get<AppointmentSetResponse>(Urls.setAppointment, {
        params,
      })
      .then((res) => res.data);
  }

  public getUserInfo(): Promise<GetUserInfoResponse | null> {
    return this.httpClient.get(Urls.getUserInfo).then((res) => res.data);
  }
}
