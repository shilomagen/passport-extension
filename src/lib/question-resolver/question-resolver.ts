import { ErrorCode } from '@src/lib/constants';
import { PrepareVisitData } from '@src/lib/api';

export enum Answers {
  Id = 'ID',
  PhoneNumber = 'PHONE_NUMBER',
  VisitType = 'VISIT_TYPE',
}

export const ErrorStrings: Record<string, ErrorCode> = {
  ['מספר הטלפון']: ErrorCode.PhoneNumberNotValid,
  ['תעודת הזהות']: ErrorCode.IdNotValid,
};

const QuestionsToAnswers: Record<number, Record<number, Answers>> = {
  1674: {
    113: Answers.Id,
  },
  1675: {
    114: Answers.PhoneNumber,
  },
  201: {
    116: Answers.VisitType,
  },
};

export class QuestionResolver {
  static isDone(question: PrepareVisitData): boolean {
    return !Boolean(question.QuestionnaireItem);
  }

  protected static resolveErrorCode(errorMessage: string): ErrorCode | null {
    const errStr = Object.keys(ErrorStrings).find((errStr) => errorMessage.includes(errStr));
    return errStr ? ErrorStrings[errStr] : ErrorCode.General;
  }

  static hasErrors(question: PrepareVisitData): ErrorCode | null {
    const error = question.Validation?.Messages?.[0];
    return error ? QuestionResolver.resolveErrorCode(error.Message) : null;
  }

  static resolveAnswer(question: PrepareVisitData): Answers {
    const { QuestionnaireItemId, QuestionId } = question.QuestionnaireItem;
    const maybeAnswer = QuestionsToAnswers[QuestionnaireItemId]?.[QuestionId];
    if (maybeAnswer) {
      return maybeAnswer;
    } else {
      throw new Error(`Could not find an answer in the map ${JSON.stringify(question)}`);
    }
  }
}
