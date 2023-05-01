import { fireEvent, RenderResult, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { DatePickerTestIds, UserMetadataTestIds } from '@src/components/dataTestIds';

export class RTLUserMetadataDriver {
  constructor(private readonly renderResult: RenderResult) {}

  private getStartDateElement() {
    return this.renderResult.getByTestId(DatePickerTestIds.START_DATE_PICKER);
  }

  private getEndDateElement() {
    return this.renderResult.getByTestId(DatePickerTestIds.END_DATE_PICKER);
  }

  private getUserId() {
    return this.renderResult.getByTestId(UserMetadataTestIds.ID);
  }

  private getPhoneNumber() {
    return this.renderResult.getByTestId(UserMetadataTestIds.PHONE_NUMBER);
  }

  private setDate(element: Element, updatedDate: string) {
    fireEvent.mouseDown(element);
    fireEvent.change(element, { target: { value: updatedDate } });
    const calenderDate = document.querySelector('.ant-picker-cell-selected') as Element;
    fireEvent.click(calenderDate);
  }

  get = {
    userId: () => this.getUserId().getAttribute('value'),

    phoneNumber: () => this.getPhoneNumber().getAttribute('value'),

    startDate: () => this.getStartDateElement().getAttribute('value'),

    endDate: () => this.getEndDateElement().getAttribute('value'),
  };

  when = {
    fillUserId: (userId: string) => {
      const element = this.getUserId();
      fireEvent.change(element, { target: { value: userId } });
    },

    fillPhoneNumber: (phoneNumber: string) => {
      const element = this.getPhoneNumber();
      fireEvent.change(element, { target: { value: phoneNumber } });
    },

    selectCities: (cities: string[]) => {
      const select = screen.getByRole('combobox');
      userEvent.click(select);

      cities.forEach((city) => {
        const cityOptions = screen.getAllByText(city);
        const selectedOption = cityOptions[cityOptions.length - 1];
        userEvent.click(selectedOption);
      });
    },

    chooseStartDate: (startDate: string) => {
      const element = this.getStartDateElement();
      fireEvent.mouseDown(element);
      fireEvent.change(element, { target: { value: startDate } });
      const calenderDate = document.querySelectorAll('.ant-picker-cell-selected')[0] as Element;
      userEvent.click(calenderDate);
    },

    chooseEndDate: (endDate: string) => {
      const element = this.getEndDateElement();
      fireEvent.mouseDown(element);
      fireEvent.change(element, { target: { value: endDate } });
      const calenderDates = document.querySelectorAll('.ant-picker-cell-selected');
      const calenderDate = calenderDates[calenderDates.length - 1] as Element;
      userEvent.click(calenderDate);
    },
  };
}
