import React, { FunctionComponent } from 'react';
import moment from 'moment/moment';
import { UserMetadata } from '@src/services/storage';
import Content from '@src/content.json';
import { DatePicker, Typography } from 'antd';
import styles from './DateRangePicker.scss';
import dayjs, { Dayjs } from 'dayjs';
const { Text } = Typography;
import { DateUtils, IsraelDateDigitsFormat } from '@src/lib/utils/date';
import { DateRangePickerTestIds } from '@src/components/dataTestIds';

export enum DateOptions {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

interface IDateRangePickerProps {
  userMetadata: UserMetadata;
  onDateChange: (selectedDate: Date, dateOption: DateOptions) => void;
}

export const DateRangePicker: FunctionComponent<IDateRangePickerProps> = ({ onDateChange, userMetadata }) => {
  const startDate = userMetadata.startDate ? dayjs(userMetadata.startDate) : undefined;
  const endDate = userMetadata.endDate ? dayjs(userMetadata.endDate) : undefined;

  const shouldDisabledDates = (currentDate: Dayjs, dateOption: DateOptions): boolean => {
    /* First Date - Disable all dates before today's date or before the chosen first date for appointment
     Last Date - Disable all dates before today's date or after the chosen last date for appointment */
    const todayDate = new Date().toDateString();
    const isBeforeToday = DateUtils.isBefore(currentDate.toDate(), new Date(todayDate));
    const isAfterEndDate = !!endDate && DateUtils.isAfter(currentDate.toDate(), endDate.toDate());
    const isBeforeStartDate = !!startDate && DateUtils.isBefore(currentDate.toDate(), startDate.toDate());

    return isBeforeToday || (dateOption === DateOptions.START_DATE ? isAfterEndDate : isBeforeStartDate);
  };

  const _onDateChange = (dateString: string, dateOption: DateOptions) => {
    const selectedDate = moment(dateString, IsraelDateDigitsFormat).toDate();
    onDateChange(selectedDate, dateOption);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateContainer}>
        <Text>{Content.startDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.startDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          value={startDate}
          data-testid={DateRangePickerTestIds.START_DATE_PICKER}
          format={IsraelDateDigitsFormat}
          disabledDate={(date) => date && shouldDisabledDates(date, DateOptions.START_DATE)}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.START_DATE)}
        />
      </div>
      <div className={styles.dateContainer}>
        <Text>{Content.endDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.endDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          format={IsraelDateDigitsFormat}
          data-testid={DateRangePickerTestIds.END_DATE_PICKER}
          disabledDate={(date) => date && shouldDisabledDates(date, DateOptions.END_DATE)}
          value={endDate}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.END_DATE)}
        />
      </div>
    </div>
  );
};
