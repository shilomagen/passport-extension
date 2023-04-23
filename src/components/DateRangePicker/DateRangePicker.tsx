import React, { FunctionComponent } from 'react';
import parse from 'date-fns/parse';
import { UserMetadata } from '@src/services/storage';
import Content from '@src/content.json';
import { DatePicker, Typography } from 'antd';
import styles from './DateRangePicker.scss';
import dayjs from 'dayjs';
const { Text } = Typography;
import { IsraelDateFormat } from '@src/lib/utils/date';
import { DateRangePickerTestIds } from '@src/components/dataTestIds';
import { validateStartDate, validateEndDate } from '@src/validators/validators';

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
          disabledDate={(date) => date && !validateStartDate(date, endDate)}
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
          disabledDate={(date) => date && !validateEndDate(date, startDate)}
          value={endDate}
          onChange={(_, dateString) => _onDateChange(dateString, DateOptions.END_DATE)}
        />
      </div>
    </div>
  );
};
