import { fireEvent, RenderResult } from '@testing-library/react';
import { DateRangePickerTestIds } from '@src/components/dataTestIds';

export class RTLDateRangePickerDriver {
  constructor(private readonly renderResult: RenderResult) {}

  private getStartDateElement() {
    return this.renderResult.getByTestId(DateRangePickerTestIds.START_DATE_PICKER);
  }

  private getEndDateElement() {
    return this.renderResult.getByTestId(DateRangePickerTestIds.END_DATE_PICKER);
  }

  get = {
    startDateValue: () => this.getStartDateElement().getAttribute('value'),

    endDateValue: () => this.getEndDateElement().getAttribute('value'),
  };

  set = {
    startDate: (date: string) => {
      const element = this.getStartDateElement();
      fireEvent.mouseDown(element);
      fireEvent.change(element, { target: { value: date } });
      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      fireEvent.click(calenderDate);
    },

    endDate: (date: string) => {
      const element = this.getEndDateElement();
      fireEvent.mouseDown(element);
      fireEvent.change(element, { target: { value: date } });
      const calenderDate = document.querySelector('.ant-picker-cell-selected');
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      fireEvent.click(calenderDate);
    },
  };
}
