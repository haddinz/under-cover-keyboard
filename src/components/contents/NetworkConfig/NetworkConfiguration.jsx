import React, { useEffect, useMemo, useRef, useState } from 'react';
import './NetworkConfiguration.scss';
import PropTypes from 'prop-types';
import { FmlxButton, FmlxIcon, FmlxModal } from 'fmlx-common-ui';
// eslint-disable-next-line import/no-cycle
import { useInjection } from 'inversify-react';
// eslint-disable-next-line import/no-cycle
import SettingNetwork from './SettingNetwork/SettingNetwork';
import { NetworkConfigContext } from '../../../context/contextLib';
// eslint-disable-next-line import/no-cycle
import AdvanceSettings from './AdvanceSettings/AdvanceSetting';
import WifiInfo from './WifiInfo/WifiInfo';
import networkConfigurationApi from '../../api/networkConfigurationApi';
import LoadingService from '../../../services/LoadingService';
import DialogService from '../../../services/DialogService';
import SignalrApiClient from '../../../services/SignalrApiClient';

function NetworkConfiguration({ show, onClose }) {
  const [actionButtonHeader, setActionButtonHeader] = useState(1);
  const [detailWifiInfo, setDetailWifiInfo] = useState({});
  const [historyNetworkList, setHistoryNetworkList] = useState([]);
  const [errorInput, setErrorInput] = useState({ error: false, text: '' });
  const [configSettNetwork, setConfigSettNetwork] = useState({});
  const [currentSettingNet, setCurrentSettingNet] = useState({});

  const abortControllersRef = useRef({});

  const apiClient = useInjection(SignalrApiClient);
  const loading = useInjection(LoadingService);
  const toastAction = useInjection(DialogService);

  const fetchConfiguration = async () => {
    try {
      const fetcheGetConfigNetwork = await networkConfigurationApi.getConfigNetworkSettingApi();

      setConfigSettNetwork(fetcheGetConfigNetwork);
      setCurrentSettingNet(fetcheGetConfigNetwork);
    } catch (error) {
      console.log('Error fetching network configuration:', error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchConfiguration();
      setActionButtonHeader(1);
      setDetailWifiInfo({});
      setErrorInput({ error: false, text: '' });
    }
  }, [show]);

  const handleButtonReset = () => {
    setConfigSettNetwork(currentSettingNet);
    setErrorInput({ error: false, text: '' });
  };

  const isDisableApply = configSettNetwork.hostName === currentSettingNet.hostName && configSettNetwork.isWifiEnabled === currentSettingNet.isWifiEnabled || errorInput.error;

  const onAbortController = async () => {
    if (abortControllersRef.current) {
      await networkConfigurationApi.stopDeviceMaintenanceApi();
      abortControllersRef.current.abort();
      abortControllersRef.current = null;
    }
  };

  const customHeader = () => {
    switch (actionButtonHeader) {
      case 1:
        return (
          <div className="custom-header-network-configuration">
            <span>Settings Network</span>
            <FmlxButton
              variant={FmlxButton.Variant.PLAIN}
              type={FmlxButton.Type.BASIC}
              onlyIcon
              icon={<FmlxIcon name="CloseOutline" />}
              withTooltip={false}
              onClick={() => {
                onClose();
                apiClient.networkScanListeners.remove('networkScan');
                onAbortController();
              }}
            />
          </div>
        );

      case 2:
        return (
          <div className="custom-header-advanced-setting">
            <FmlxButton
              variant={FmlxButton.Variant.PLAIN}
              type={FmlxButton.Type.BASIC}
              onlyIcon
              icon={<FmlxIcon name="ArrowBack" />}
              withTooltip={false}
              onClick={() => {
                setActionButtonHeader(1);
                handleButtonReset();
              }}
            />
            <span>Advance Settings</span>
          </div>
        );

      case 3:
        return (
          <div className="custom-header-advanced-setting">
            <FmlxButton
              variant={FmlxButton.Variant.PLAIN}
              type={FmlxButton.Type.BASIC}
              onlyIcon
              icon={<FmlxIcon name="ArrowBack" />}
              withTooltip={false}
              onClick={() => {
                setActionButtonHeader(2);
                setDetailWifiInfo({});
              }}
            />
            <span>Wi-fi Info</span>
          </div>
        );
      default:
        return null;
    }
  };

  const customFooter = () => {
    switch (actionButtonHeader) {
      case 1:
        return (
          <div className="custom-footer-network-configuration">
            <FmlxButton
              label="Advanced Settings"
              size={FmlxButton.Size.EXTRA_LARGE}
              type={FmlxButton.Type.BASIC}
              onClick={() => {
                setActionButtonHeader(2);
                apiClient.networkScanListeners.remove('networkScan');
                onAbortController();
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const customContent = () => {
    switch (actionButtonHeader) {
      case 1:
        return <SettingNetwork onClose={onClose} />;
      case 2:
        return <AdvanceSettings />;
      case 3:
        return <WifiInfo />;
      default:
        return null;
    }
  };

  const saveConfigNetwork = async () => {
    const saveConfigurationNetwork = await networkConfigurationApi.saveConfigNetworkApi(configSettNetwork);

    if (saveConfigurationNetwork) {
      if (configSettNetwork.isWifiEnabled !== currentSettingNet.isWifiEnabled) {
        loading.stop();
        toastAction.alertSuccess('Network settings changed. Restarting Device..');
      }
      onClose();
      apiClient.networkScanListeners.remove('networkScan');
      onAbortController();
    } else {
      toastAction.alertError('Failed to change network settings');
    }
  };

  const handleButtonApply = async () => {
    let desc = '';
    const descChangeNetwork = 'Changing network';
    const descRestart = 'Restarting Device.. After restarting, open the system in a new tab to access the applied settings';

    if (configSettNetwork.isWifiEnabled !== currentSettingNet.isWifiEnabled) {
      if (configSettNetwork.hostName === currentSettingNet.hostName) {
        desc = descChangeNetwork;
      } else {
        desc = descRestart;
      }
    } else if (configSettNetwork.hostName !== currentSettingNet.hostName) {
      desc = descRestart;
    } else {
      desc = descChangeNetwork;
    }

    loading.start(desc);

    if (currentSettingNet.hostName === configSettNetwork.hostName) {
      saveConfigNetwork();
    } else {
      const hostnameCheck = await networkConfigurationApi.hostnameCheckApi(configSettNetwork.hostName);

      if (!hostnameCheck.isValid) {
        setErrorInput({ error: true, text: hostnameCheck.message });
        loading.stop();
      } else {
        saveConfigNetwork();
      }
    }
  };

  const contextValue = useMemo(() => ({
    historyNetworkList,
    setHistoryNetworkList,
    actionButtonHeader,
    setActionButtonHeader,
    detailWifiInfo,
    setDetailWifiInfo,
    errorInput,
    setErrorInput,
    abortControllersRef,
    configSettNetwork,
    setConfigSettNetwork,
  }), [historyNetworkList, setHistoryNetworkList, actionButtonHeader,
    setActionButtonHeader, detailWifiInfo, setDetailWifiInfo,
    errorInput, setErrorInput, abortControllersRef, configSettNetwork, setConfigSettNetwork]);

  return (
    <NetworkConfigContext.Provider
      value={contextValue}
    >
      <div className="network-configuration-container">
        <FmlxModal
          open={show}
          disableBlur
          customHeader={customHeader()}
          customFooter={customFooter()}
          primaryButton={{
            show: actionButtonHeader === 2,
            label: 'APPLY',
            disabled: isDisableApply,
            onClick: () => {
              handleButtonApply();
            },
          }}
          secondaryButton={{
            show: actionButtonHeader === 2,
            label: 'RESET',
            type: FmlxButton.Type.BASIC,
            variant: FmlxButton.Variant.OUTLINE,
            onClick: () => {
              handleButtonReset();
            },
          }}
          tertiaryButton={{
            show: false,
          }}
        >
          <div className="network-configuration-content">{customContent()}</div>
        </FmlxModal>
      </div>
    </NetworkConfigContext.Provider>
  );
}

NetworkConfiguration.defaultProps = {
  show: false,
  onClose: () => {},
};

NetworkConfiguration.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
};

export default NetworkConfiguration;
