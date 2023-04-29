import React, { FunctionComponent } from 'react';
import { Checkbox } from 'antd';
import { consent as Content } from '@src/content.json';
import styles from './Consent.scss'
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const TERMS_AND_CONDITIONS_URL = 'https://myvisit.com/templates/directives/termsDialog.html';

export interface IConsentProps {
  consent: boolean;
  onConsentChanged: (value: boolean) => void;
}

export const Consent: FunctionComponent<IConsentProps> = ({ onConsentChanged, consent }) => {
  const onTermsAndConditionsClick = () => {
    chrome.tabs.create({
      active: true,
      url: TERMS_AND_CONDITIONS_URL,
    });
  };

  const onCheckboxChanged = (e: CheckboxChangeEvent) => onConsentChanged(e.target.checked);

  return (
    <Checkbox onChange={onCheckboxChanged} checked={consent}>
       <span className={styles.text}>{Content.prefix}</span>{' '}
      <a  href="" onClick={onTermsAndConditionsClick}>
       {Content.termsAndConditions}
      </a>{' '}
      <span className={styles.text}>{Content.suffix}</span>
    </Checkbox>
  );
};
