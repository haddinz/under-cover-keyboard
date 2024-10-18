import { FmlxIcon } from 'fmlx-common-ui';
import React from 'react';
import PropTypes from 'prop-types';
import './WiFiStrengthIcon.scss';
import { WifiSignalStrengthEnum } from '../../../enums/networkConfigEnum';

function WiFiStrengthIcon({ strength, isPasswordRequired }) {
  let iconClass;

  if (strength >= 1 && strength < 33) {
    iconClass = WifiSignalStrengthEnum.WEAK;
  } else if (strength >= 33 && strength < 66) {
    iconClass = WifiSignalStrengthEnum.MODERATE;
  } else if (strength >= 66 && strength <= 100) {
    iconClass = WifiSignalStrengthEnum.STRONG;
  } else {
    return <div className="wifi-icon high"><FmlxIcon name="WiFi" id="icon-wifi-4" /></div>;
  }

  return (
    <div className="wifi-icon-container">
      <div className={`wifi-strength-icon ${iconClass}`}>
        <FmlxIcon name="WiFi" id={`icon-wifi-${iconClass}`} />
      </div>

      {isPasswordRequired && (
        <div className="icon-lock">
          <FmlxIcon name="Lock" size={FmlxIcon.Size.EXTRA_SMALL} />
        </div>
      )}
    </div>
  );
}

WiFiStrengthIcon.defaultProps = {
  strength: 0,
  isPasswordRequired: false,
};

WiFiStrengthIcon.propTypes = {
  strength: PropTypes.number,
  isPasswordRequired: PropTypes.bool,
};

export default WiFiStrengthIcon;
