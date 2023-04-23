import React, { FunctionComponent } from 'react';
import parse from 'date-fns/parse';
import { UserMetadata } from '@src/services/storage';
import Content from '@src/content.json';
import { DatePicker, Typography } from 'antd';
import styles from './DateRangePicker.scss';
import dayjs, { Dayjs } from 'dayjs';
const { Text } = Typography;
import { DateUtils, IsraelDateFormat } from '@src/lib/utils/date';
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
    // Start Date - Disable all dates before today's date or before the chosen first date for appointment
    // End Date - Disable all dates before today's date or after the chosen last date for appointment
    const startOfTodayDate = dayjs(new Date()).startOf('day').toDate();
    const startOfCurrentDate = currentDate.startOf('day').toDate();
    const isBeforeToday = DateUtils.isBefore(startOfCurrentDate, startOfTodayDate);
    const isAfterEndDate = !!endDate && DateUtils.isAfter(startOfCurrentDate, endDate.startOf('day').toDate());
    const isBeforeStartDate = !!startDate && DateUtils.isBefore(startOfCurrentDate, startDate.startOf('day').toDate());

    return isBeforeToday || (dateOption === DateOptions.START_DATE ? isAfterEndDate : isBeforeStartDate);
  };

  const _onDateChange = (dateString: string, dateOption: DateOptions) => {
    const selectedDate = parse(dateString, IsraelDateFormat, new Date());
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
          format={IsraelDateFormat.toUpperCase()}
          disabledDate={(date) => date && shouldDisabledDates(date, DateOptions.START_DATE)}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.START_DATE)}
        />
      </div>
      <div className={styles.dateContainer}>
        <Text>{Content.endDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.endDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          format={IsraelDateFormat.toUpperCase()}
          data-testid={DateRangePickerTestIds.END_DATE_PICKER}
          disabledDate={(date) => date && shouldDisabledDates(date, DateOptions.END_DATE)}
          value={endDate}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.END_DATE)}
        />
      </div>
    </div>
  );
};
