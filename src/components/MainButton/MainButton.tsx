import React, { FC } from 'react';
import { Button } from 'antd';
import browser from 'webextension-polyfill';
import { SearchStatusType } from '@src/lib/internal-types';
import { ActionTypes } from '@src/platform-message';
import { buttons as Content } from '@src/content.json';
import { getMyVisitTab } from '@src/lib/utils/tabs';
import styles from './MainButton.scss';
import { AppTestIds } from '../dataTestIds';

interface MainButtonProps {
  searchStatusType: SearchStatusType;
  enabled: boolean;
}

const sendMessageToMyVisitTab = async (action: ActionTypes) => {
  const maybeMyVisitTab = await getMyVisitTab();
  if (maybeMyVisitTab) {
    await browser.tabs.sendMessage(maybeMyVisitTab.id!, { action });
  }
};

export const MainButton: FC<MainButtonProps> = ({ searchStatusType, enabled }) => {
  const BUTTON_CONFIGURATIONS = {
    STOP: {
      onClick: () => sendMessageToMyVisitTab(ActionTypes.StopSearch),
      'data-testid': AppTestIds.STOP_SEARCH_BUTTON,
      content: Content.stopSearch,
    },
    WAIT: {
      disabled: true,
      content: Content.waiting,
    },
    START: {
      onClick: () => sendMessageToMyVisitTab(ActionTypes.StartSearch),
      'data-testid': AppTestIds.START_SEARCH_BUTTON,
      content: Content.search,
      disabled: !enabled,
    },
  };

  const { content, ...config } = [SearchStatusType.Started, SearchStatusType.Warning].includes(searchStatusType)
    ? BUTTON_CONFIGURATIONS.STOP
    : searchStatusType === SearchStatusType.Waiting
    ? BUTTON_CONFIGURATIONS.WAIT
    : BUTTON_CONFIGURATIONS.START;

  return (
    <div className={styles.buttonContainer}>
      <Button {...config}>{content}</Button>
    </div>
  );
};
