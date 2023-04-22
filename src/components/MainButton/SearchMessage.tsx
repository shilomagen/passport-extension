import React, { FC } from 'react';
import { Typography } from 'antd';
import { SearchStatus, SearchStatusType } from '@src/lib/internal-types';
import styles from './MainButton.scss';

const { Text } = Typography;

interface SearchMessageProps {
  searchStatus: SearchStatus;
}

export const SearchMessage: FC<SearchMessageProps> = ({ searchStatus }) => {
  const colorClass =
    searchStatus.type === SearchStatusType.Error
      ? styles.error
      : searchStatus.type === SearchStatusType.Warning
      ? styles.warning
      : '';

  return (
    <div className={styles.messageContainer}>
      <Text className={colorClass}>{searchStatus.message}</Text>
    </div>
  );
};
