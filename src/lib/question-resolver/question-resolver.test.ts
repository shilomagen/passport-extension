import { QuestionResolver } from './question-resolver';
import { PrepareVisitData } from '@src/lib/api';
import { ErrorCode } from '@src/lib/constants';

const MockPrepareVisitData: PrepareVisitData = {
  PreparedVisitId: 86742504,
  UserId: 183585562,
  ServiceId: 2247,
  ServiceTypeId: 156,
  OrganizationId: null,
  DateCreated: new Date('2022-05-02T16:42:35.483'),
  PreparedVisitToken: 'b67ae922-e9c5-4551-9993-e5d5fd7d95a1',
  QuestionnaireItem: {
    QuestionnaireItemId: 200,
    ServiceTypeId: 156,
    OrganizationId: null,
    QuestionId: 114,
    Position: 2,
    IsActive: true,
    Question: {
      QuestionId: 114,
      OrganizationId: 56,
      IsActive: true,
      Title: 'הכנסת מספר טלפון נייד',
      Text: 'אנא הקלד מספר טלפון נייד\nPlease type cellphone No.',
      Description:
        'הכנס מספר נייד עם תחילית 05\nEnter cellphone No. begins with 05.',
      CustomErrorText: 'הקלד ספרות בלבד',
      Type: 0,
      MappedTo: 3,
      MappedToCustomerCustomPropertyId: 0,
      MappedToProcessCustomPropertyId: 0,
      MappedToPropertyName: 'מספר נייד מה-Central',
      Required: true,
      ValidateAnswerOnQFlow: true,
      ValidateAnswerOnClient: true,
      ValidationExpression: '[0-9]{10,10}',
      AskOncePerCustomer: false,
      QuestionKey: 'PHONE_KEYPAD',
      Answers: [],
      ExtRef: '',
      SaveAnswerWithAppointment: false,
    },
  },
  NavigationState: {
    State: null,
    OrganizationId: 56,
    ServiceTypeId: 0,
    LocationId: 0,
    ServiceId: 0,
    QflowServiceId: 0,
  },
  IsUserIdentify: null,
};

describe('[Question Resolver]', () => {
  test('should return null if there is no validation error', () => {
    const prepareVisitDataWithNoError: PrepareVisitData = {
      ...MockPrepareVisitData,
      Validation: undefined,
    };
    expect(QuestionResolver.hasErrors(prepareVisitDataWithNoError)).toBeNull();
  });
  test('should return phone error code', () => {
    const prepareVisitDataWithPhoneError: PrepareVisitData = {
      ...MockPrepareVisitData,
      Validation: {
        Messages: [
          {
            Message: 'מספר הטלפון אינו תקין, הקלד שנית',
            Type: 'Error',
          },
        ],
      },
    };
    expect(QuestionResolver.hasErrors(prepareVisitDataWithPhoneError)).toBe(
      ErrorCode.PhoneNumberNotValid,
    );
  });

  test('should return id error code', () => {
    const prepareVisitDataWithIdError: PrepareVisitData = {
      ...MockPrepareVisitData,
      Validation: {
        Messages: [
          {
            Message: 'תעודת הזהות',
            Type: 'Error',
          },
        ],
      },
    };
    expect(QuestionResolver.hasErrors(prepareVisitDataWithIdError)).toBe(
      ErrorCode.IdNotValid,
    );
  });

  test('should return general error code if we cant find an error', () => {
    const prepareVisitDataWithUnknownError: PrepareVisitData = {
      ...MockPrepareVisitData,
      Validation: {
        Messages: [
          {
            Message: 'unknown',
            Type: 'Error',
          },
        ],
      },
    };
    expect(QuestionResolver.hasErrors(prepareVisitDataWithUnknownError)).toBe(
      ErrorCode.General,
    );
  });
});
