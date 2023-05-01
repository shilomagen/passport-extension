import React, { FunctionComponent } from 'react';
import parse from 'date-fns/parse';
import {} from '@src/services/storage';
import Content from '@src/content.json';
import { DatePicker, Typography } from 'antd';
import styles from './DateRangePicker.scss';
import dayjs, { Dayjs } from 'dayjs';
const { Text } = Typography;
import { DateUtils, IsraelDateFormat } from '@src/lib/utils/date';
import { DatePickerTestIds } from '@src/components/dataTestIds';
import { validateStartDate, validateEndDate } from '@src/validators/validators';

export enum DateOptions {
  START_DATE = 'startDate',
  END_DATE = 'endDate',
}

interface IDateRangePickerProps {
  startDate: number;
  endDate: number;
  onDateChanged: (selectedDate: Date, dateOption: DateOptions) => void;
}

export const DateRangePicker: FunctionComponent<IDateRangePickerProps> = (props) => {
  const startDate = props.startDate ? dayjs(props.startDate) : undefined;
  const endDate = props.endDate ? dayjs(props.endDate) : undefined;

  const _onDateChanged = (dateString: string, dateOption: DateOptions) => {
    const selectedDate = parse(dateString, IsraelDateFormat, new Date());
    props.onDateChanged(selectedDate, dateOption);
  };

  const shouldDisabledDates = (date: Dayjs): boolean => {
    const startOfTodayDate = dayjs(new Date()).startOf('day').toDate();
    const startOfCompareDate = date.startOf('day').toDate();
    return DateUtils.isBefore(startOfCompareDate, startOfTodayDate);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateContainer}>
        <Text>{Content.startDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.startDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          value={startDate}
          format={IsraelDateFormat.toUpperCase()}
          data-testid={DatePickerTestIds.START_DATE_PICKER}
          disabledDate={(date) => date && shouldDisabledDates(date)}
          status={!validateStartDate(props.startDate, props.endDate) ? 'error' : ''}
          onChange={(_, dateString) => _onDateChanged(dateString, DateOptions.START_DATE)}
        />
      </div>
      <div className={styles.dateContainer}>
        <Text>{Content.endDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.endDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          format={IsraelDateFormat.toUpperCase()}
          data-testid={DatePickerTestIds.END_DATE_PICKER}
          value={endDate}
          disabledDate={(date) => date && shouldDisabledDates(date)}
          status={!validateEndDate(props.endDate, props.startDate) ? 'error' : ''}
          onChange={(_, dateString) => _onDateChanged(dateString, DateOptions.END_DATE)}
        />
      </div>
    </div>
  );
};
