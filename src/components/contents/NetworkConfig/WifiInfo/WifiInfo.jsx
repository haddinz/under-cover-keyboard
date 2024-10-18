import { FmlxIcon, FmlxLink } from 'fmlx-common-ui';
import React, { useState } from 'react';
import { useNetworkConfigContext } from '../../../../context/contextLib';

function WifiInfo() {
  const [showPassword, setShowPassword] = useState(false);

  const { detailWifiInfo } = useNetworkConfigContext();
  const { ssid, password, isPasswordRequired } = detailWifiInfo;

  return (
    <div className="wifi-info-content">
      <div className="form-info-wifi">
        <FmlxIcon
          name={isPasswordRequired ? 'WiFiLocked' : 'WiFi'}
          size={FmlxIcon.Size.LARGE}
        />
        <span>{ssid}</span>
      </div>

      <div className="form-detail-wifi">
        <span>Password</span>
        {showPassword ? (
          <div>
            <span className="show-password">{password}</span>
            <FmlxLink
              label="Hide"
              onClick={() => {
                setShowPassword(false);
              }}
            />
          </div>
        ) : (
          <FmlxLink
            label="Show"
            onClick={() => {
              setShowPassword(true);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default WifiInfo;
