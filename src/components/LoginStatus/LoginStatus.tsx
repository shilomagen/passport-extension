import React, { FunctionComponent } from 'react';
import { Typography } from 'antd';
import { statuses as Content } from '@src/content.json';
import styles from './LoginStatus.scss';
import { useLoggedIn } from '@src/hooks/loggedIn';

const { Text } = Typography;

export const LoginStatus: FunctionComponent = () => {
  const loggedIn = useLoggedIn();
  const circleStyle = [styles.circle, loggedIn ? styles.connected : styles.disconnected].join(' ');
  return (
    <div className={styles.container}>
      <div className={circleStyle} />
      <Text style={{color:'white'}}>{loggedIn ? Content.connected : Content.disconnected}</Text>
    </div>
  );
};
