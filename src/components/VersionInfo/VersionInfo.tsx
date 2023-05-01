import React, { FC } from 'react';
import browser from 'webextension-polyfill';
import { Typography } from 'antd';

import { version as Content } from '@src/content.json';

import styles from './VersionInfo.scss';

const { Text } = Typography;

export const VersionInfo: FC = () => {
  const version = browser.runtime.getManifest().version;
  const id = browser.runtime.id;

  return (
    <div className={styles.container}>
      <Text>
        {Content.versionNumber} {version}
      </Text>
      <a href={`https://chrome.google.com/webstore/detail/${id}`} target="_blank" rel="noreferrer">
        <Text>({Content.checkForUpdates})</Text>
      </a>
    </div>
  );
};
