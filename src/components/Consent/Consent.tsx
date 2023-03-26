import React, { FunctionComponent } from 'react';
import { Checkbox } from 'antd';
import { consent as Content } from '@src/content.json';
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
      {Content.prefix}{' '}
      <a href="" onClick={onTermsAndConditionsClick}>
        {Content.termsAndConditions}
      </a>{' '}
      {Content.suffix}
    </Checkbox>
  );
};
