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
  const todayDate = dayjs(new Date());

  const isAfter = (currentDate: Dayjs, compare: Dayjs): boolean =>
    DateUtils.isAfter(currentDate.toDate(), compare.toDate());
  const isEqual = (currentDate: Dayjs, compare: Dayjs): boolean =>
    DateUtils.isEqual(currentDate.toDate(), compare.toDate());
  const isBefore = (currentDate: Dayjs, compare: Dayjs): boolean =>
    DateUtils.isBefore(currentDate.toDate(), compare.toDate());

  const isValidEndDate = (currentDate: Dayjs): boolean => {
    // Valid end date should be after or equal today and after or equal start date
    return (
      (isAfter(currentDate, todayDate) || isEqual(currentDate, todayDate)) &&
      !!startDate &&
      (isAfter(currentDate, startDate) || isEqual(currentDate, startDate))
    );
  };

  const isValidStartDate = (currentDate: Dayjs): boolean => {
    // Valid start date should be after or equal today and before or equal end date
    return (
      (isAfter(currentDate, todayDate) || isEqual(currentDate, todayDate)) &&
      !!endDate &&
      (isBefore(currentDate, endDate) || isEqual(currentDate, endDate))
    );
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
          disabledDate={(date) => date && !isValidStartDate(date)}
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
          disabledDate={(date) => date && !isValidEndDate(date)}
          value={endDate}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.END_DATE)}
        />
      </div>
    </div>
  );
};
