import { HttpService } from '@src/lib/http';
import { AnswerQuestionRequest, PrepareVisitData } from '@src/lib/api';
import { Answers, QuestionResolver } from '@src/lib/question-resolver/question-resolver';
import {
  aFailedResponse,
  aSuccessResponse,
  PrepareVisitResponse,
  ResponseStatus,
  User,
  UserVisitResponse,
} from '@src/lib/internal-types';
import { ErrorCode } from '@src/lib/constants';
import { UserMetadata } from '@src/services/storage';

export class VisitService {
  constructor(private readonly httpService: HttpService) {}

  private buildAnswerRequestFrame(question: PrepareVisitData): Omit<AnswerQuestionRequest, 'AnswerIds' | 'AnswerText'> {
    return {
      PreparedVisitToken: question.PreparedVisitToken,
      QuestionId: question.QuestionnaireItem.QuestionId,
      QuestionnaireItemId: question.QuestionnaireItem.QuestionnaireItemId,
    };
  }

  private extractDataByAnswer(answer: Answers, userMetadata: UserMetadata): string {
    switch (answer) {
      case Answers.Id:
        return userMetadata.id;
      case Answers.PhoneNumber:
        return userMetadata.phone;
    }
    return '';
  }

  private async answer(question: PrepareVisitData, userMetadata: UserMetadata): Promise<PrepareVisitResponse> {
    if (QuestionResolver.isDone(question)) {
      return aSuccessResponse(question);
    }

    if (QuestionResolver.hasErrors(question)) {
      return aFailedResponse(QuestionResolver.hasErrors(question) as ErrorCode);
    }

    const whatToAnswer = QuestionResolver.resolveAnswer(question);
    const request: AnswerQuestionRequest = {
      ...this.buildAnswerRequestFrame(question),
      ...(whatToAnswer === Answers.VisitType
        ? {
            AnswerIds: [77],
            AnswerText: null,
          }
        : {
            AnswerIds: null,
            AnswerText: this.extractDataByAnswer(whatToAnswer, userMetadata),
          }),
    };
    const nextQuestion = await this.httpService.answer(request);
    return this.answer(nextQuestion, userMetadata);
  }

  async prepare(userMetadata: UserMetadata): Promise<UserVisitResponse> {
    const initialQuestion = await this.httpService.prepareVisit();
    const response = await this.answer(initialQuestion, userMetadata);
    return response.status === ResponseStatus.Success
      ? aSuccessResponse({
          visitId: response.data.PreparedVisitId,
          visitToken: response.data.PreparedVisitToken,
        })
      : aFailedResponse(response.data.errorCode);
  }
}
