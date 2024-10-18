import React, { useEffect, useState } from 'react';
import { FmlxTextBox, FmlxIcon, FmlxSwitch, FmlxTooltip } from 'fmlx-common-ui';
import { CircularProgress } from '@mui/material';
import { useInjection } from 'inversify-react';
import networkConfigurationApi from '../../../api/networkConfigurationApi';
import { useNetworkConfigContext } from '../../../../context/contextLib';
// eslint-disable-next-line import/no-cycle
import ExpandableListItem from '../ExpandableListItem';
import { ExpandableItemType } from '../../../../enums/networkConfigEnum';
import LoadingService from '../../../../services/LoadingService';

function AdvanceSettings() {
  const loadingScreen = useInjection(LoadingService);

  const [loading, setLoading] = useState(false);

  const { historyNetworkList, setHistoryNetworkList, setActionButtonHeader, setDetailWifiInfo,
    errorInput, setErrorInput, configSettNetwork, setConfigSettNetwork } = useNetworkConfigContext();

  const getNetworkHistory = async () => {
    try {
      const response = await networkConfigurationApi.getNetworkHistoryListApi();

      if (response) {
        setHistoryNetworkList(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching get wifi enable:', error);
    }
  };

  useEffect(() => {
    setLoading(true);
    getNetworkHistory();
  }, []);

  const handleButtonForget = async (ssid) => {
    loadingScreen.start('Loading');
    const response = await networkConfigurationApi.forgetNetworkApi(ssid);

    if (response) {
      loadingScreen.stop();
      getNetworkHistory();
    }
  };

  const handleChevronRight = async (item) => {
    setActionButtonHeader(3);
    setDetailWifiInfo(item);
  };

  const validasiHostname = (value) => {
    const hasNoSpaces = /^\S*$/.test(value);
    const isMaxLength = value.length <= 15;
    const hasLetterOrNumber = /[a-zA-Z0-9]/.test(value);

    if (!hasNoSpaces || !isMaxLength || !hasLetterOrNumber) {
      setErrorInput({
        error: true,
        text: 'Name must contain min 1 - 15 characters and has no space.',
      });
    } else {
      setErrorInput({ error: false, text: '' });
    }

    setConfigSettNetwork({ ...configSettNetwork, hostName: value });
  };

  return (
    <div className="advanced-setting-content">
      <div className="form-change-device-name">
        <span>Change device name</span>
        <div className="form-textbox-with-info">
          <FmlxTextBox
            value={configSettNetwork.hostName}
            onChange={({ value }) => validasiHostname(value)}
            error={errorInput.error}
            inlineText={errorInput.text}
            disabled={loading}
          />
          <FmlxTooltip
            placement={FmlxTooltip.Placement.BOTTOM}
            title="Name must contain min 1 - 15 characters and has no space."
          >
            <FmlxIcon name="CellAbout" size={FmlxIcon.Size.EXTRA_SMALL} />
          </FmlxTooltip>
        </div>
      </div>
      <hr style={{ width: '100%', textAlign: 'left', marginLeft: 0 }} />
      <div className="form-wifi-module">
        <span>Wi-Fi module</span>
        <FmlxSwitch
          checked={configSettNetwork.isWifiEnabled}
          onChange={(val) => {
            setConfigSettNetwork({ ...configSettNetwork, isWifiEnabled: val });
          }}
          disabled={loading}
        />
      </div>
      <hr style={{ width: '100%', textAlign: 'left', marginLeft: 0 }} />
      <span>Manage Known Network </span>
      {loading && (
        <div className="loading-container">
          <CircularProgress color="inherit" size={77} />
          <p>Loading...</p>
        </div>
      )}
      { !loading && configSettNetwork.isWifiEnabled && historyNetworkList.length > 0 && (
        <div
          className={`manage-network-list ${historyNetworkList.length > 4 ? 'with-overlay' : ''}`}
        >
          {historyNetworkList?.map((network, i) => (
            <ExpandableListItem
              // eslint-disable-next-line react/no-array-index-key
              key={`item-device${i}`}
              label={network.ssid}
              type={ExpandableItemType.NON_EXPANABLE}
              icon={(
                <FmlxIcon
                  name={network.isPasswordRequired ? 'WiFiLocked' : 'WiFi'}
                />
              )}
              onForget={() => handleButtonForget(network.ssid)}
              onChevronRight={() => handleChevronRight(network)}
              disabledChevronRight={!network.isPasswordRequired}
            />
          ))}
          {historyNetworkList.length > 4 && <div className="overlay" />}
        </div>
      ) }

    </div>
  );
}

export default AdvanceSettings;
