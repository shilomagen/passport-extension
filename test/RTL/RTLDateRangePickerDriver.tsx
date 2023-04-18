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

  private setDate(element: Element, updatedDate: string) {
    fireEvent.mouseDown(element);
    fireEvent.change(element, { target: { value: updatedDate } });
    const calenderDate = document.querySelector('.ant-picker-cell-selected') as Element;
    fireEvent.click(calenderDate);
  }

  get = {
    startDateValue: () => this.getStartDateElement().getAttribute('value'),

    endDateValue: () => this.getEndDateElement().getAttribute('value'),
  };

  set = {
    startDate: (date: string) => {
      const element = this.getStartDateElement();
      this.setDate(element, date);
    },

    endDate: (date: string) => {
      const element = this.getEndDateElement();
      this.setDate(element, date);
    },
  };
}
