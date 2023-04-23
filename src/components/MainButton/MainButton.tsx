import React from 'react';
import { Button, Typography } from 'antd';
import browser from 'webextension-polyfill';
import { SearchStatus, SearchStatusType } from '@src/lib/internal-types';
import { ActionTypes, PlatformMessage } from '@src/platform-message';
import { buttons as Content } from '@src/content.json'
import styles from './MainButton.scss';

const { Text } = Typography;

interface MainButtonProps {
  searchStatusType: SearchStatusType
  enabled: boolean
}

interface SearchMessageProps {
  searchStatus: SearchStatus
}

const send = async (action: ActionTypes) => {
  await browser.runtime.sendMessage({ action } as PlatformMessage);
}

export const MainButton = ({ searchStatusType, enabled }: MainButtonProps) => {
  const renderButton = () => {
    if (searchStatusType === SearchStatusType.Started || searchStatusType === SearchStatusType.Warning) {
      return <Button onClick={() => send(ActionTypes.StopSearch)}>{Content.stopSearch}</Button>
    } else if (searchStatusType === SearchStatusType.Waiting) {
      return <Button disabled>{Content.waiting}</Button>
    } else {
      return <Button onClick={() => send(ActionTypes.StartSearch)} disabled={!enabled}>{Content.search}</Button>
    }
  }
  
  return <div className={styles.buttonContainer}>
      {renderButton()}
  </div>
}

export const SearchMessage = ({ searchStatus }: SearchMessageProps) => {
  const colorClass = searchStatus.type === SearchStatusType.Error
      ? styles.error
      : searchStatus.type === SearchStatusType.Warning
        ? styles.warning
        : searchStatus.type === SearchStatusType.Complete
          ? styles.success
          : ''

    return <div className={styles.messageContainer}>
            <Text className={[colorClass, styles.centered].join(' ')}>
              {searchStatus.message}
            </Text>
          </div>
}