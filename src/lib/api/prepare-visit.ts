import { CommonDataResponse } from './common';

export interface AnswerQuestionRequest {
  PreparedVisitToken: string;
  QuestionnaireItemId: number;
  QuestionId: number;
  AnswerIds: number[] | null;
  AnswerText: string | null;
}

interface ValidationMessage {
  Message: string;
  Type: string;
}
export interface Validation {
  Messages: ValidationMessage[];
}

export interface NavigationState {
  State?: any;
  OrganizationId: number;
  ServiceTypeId: number;
  LocationId: number;
  ServiceId: number;
  QflowServiceId: number;
}

export interface Question {
  AskOncePerCustomer: boolean;
  QuestionId: number;
  OrganizationId: number;
  IsActive: boolean;
  Title: string;
  Text: string;
  Description: string;
  CustomErrorText: string;
  Type: number;
  MappedTo: number;
  MappedToCustomerCustomPropertyId: number;
  MappedToProcessCustomPropertyId: number;
  MappedToPropertyName: string;
  Required: boolean;
  ValidateAnswerOnQFlow: boolean;
  ValidateAnswerOnClient: boolean;
  ValidationExpression: string;
  QuestionKey: string;
  Answers: any[];
  ExtRef: string;
  SaveAnswerWithAppointment: boolean;
}

export interface QuestionnaireItem {
  QuestionnaireItemId: number;
  ServiceTypeId: number;
  OrganizationId?: any;
  QuestionId: number;
  Position: number;
  IsActive: boolean;
  Question: Question;
}

export interface NavigationState {
  State?: any;
  OrganizationId: number;
  ServiceTypeId: number;
  LocationId: number;
  ServiceId: number;
  QflowServiceId: number;
}

export interface PrepareVisitData {
  PreparedVisitId: number;
  UserId: number;
  ServiceId: number;
  ServiceTypeId: number;
  OrganizationId?: any;
  DateCreated: Date;
  PreparedVisitToken: string;
  QuestionnaireItem: QuestionnaireItem;
  Validation?: Validation;
  NavigationState?: NavigationState;
  IsUserIdentify?: any;
}

export type PrepareVisitResponse = CommonDataResponse<PrepareVisitData>;
