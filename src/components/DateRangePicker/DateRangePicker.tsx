import React, { FunctionComponent } from 'react';
import { UserMetadata } from '@src/services/storage';
import Content from '@src/content.json';
import { DatePicker, Typography } from 'antd';
import styles from './DateRangePicker.scss';
import dayjs, { Dayjs } from 'dayjs';
const { Text } = Typography;
import { DateUtils, IsraelDateDigitsFormat } from '@src/lib/utils/date';
import moment from 'moment/moment';

interface IDateRangePickerProps {
  userMetadata: UserMetadata;
  onDateChange: (selectedDate: Date, dateOption: 'firstDate' | 'lastDate') => void;
}

export const DateRangePicker: FunctionComponent<IDateRangePickerProps> = ({ onDateChange, userMetadata }) => {
  const firstDate = userMetadata.firstDate ? dayjs(userMetadata.firstDate) : undefined;
  const lastDate = userMetadata.lastDate ? dayjs(userMetadata.lastDate) : undefined;

  const shouldDisabledDates = (currentDate: Dayjs, dateOption: 'firstDate' | 'lastDate'): boolean => {
    /* First Date - Disable all dates before today's date or before the chosen first date for appointment
     Last Date - Disable all dates before today's date or after the chosen last date for appointment */
    const todayDate = new Date().toDateString();
    const isBeforeToday = DateUtils.isBefore(currentDate.toDate(), new Date(todayDate));
    const isAfterLastDate = !!lastDate && DateUtils.isAfter(currentDate.toDate(), lastDate.toDate());
    const isBeforeFirstDate = !!firstDate && DateUtils.isBefore(currentDate.toDate(), firstDate.toDate());

    return isBeforeToday || (dateOption === 'firstDate' ? isAfterLastDate : isBeforeFirstDate);
  };

  const _onDateChange = (dateString: string, dateOption: 'firstDate' | 'lastDate') => {
    const selectedDate = moment(dateString, IsraelDateDigitsFormat).toDate();
    onDateChange(selectedDate, dateOption);
  };

  return (
    <div className={styles.container}>
      <div className={styles.dateContainer}>
        <Text>{Content.firstDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.firstDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          value={firstDate}
          data-testid={'first-date'}
          format={IsraelDateDigitsFormat}
          disabledDate={(date) => date && shouldDisabledDates(date, 'firstDate')}
          onChange={(_, dateString) => _onDateChange(dateString, 'firstDate')}
        />
      </div>
      <div className={styles.dateContainer}>
        <Text>{Content.lastDateForAppointment.title}</Text>
        <DatePicker
          placeholder={Content.lastDateForAppointment.placeholder}
          className={styles.datePickerContainer}
          format={IsraelDateDigitsFormat}
          data-testid={'last-date'}
          disabledDate={(date) => date && shouldDisabledDates(date, 'lastDate')}
          value={lastDate}
          onChange={(_, dateString) => _onDateChange(dateString, 'lastDate')}
        />
      </div>
    </div>
  );
};
