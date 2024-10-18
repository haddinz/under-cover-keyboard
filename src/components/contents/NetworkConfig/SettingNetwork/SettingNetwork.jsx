import React, { useEffect, useState } from 'react';
import { FmlxIcon, FmlxTooltip } from 'fmlx-common-ui';
import PropTypes from 'prop-types';
import '../NetworkConfiguration.scss';
import { useInjection } from 'inversify-react';
import { AbortController } from '@microsoft/signalr/dist/esm/AbortController';
import { CircularProgress } from '@mui/material';
import networkConfigurationApi from '../../../api/networkConfigurationApi';
import { ExpandableItemType, NETWORK_SCAN_LISTENER_NAME, TypeInterfaceNetwork } from '../../../../enums/networkConfigEnum';
import SignalrApiClient from '../../../../services/SignalrApiClient';
// eslint-disable-next-line import/no-cycle
import ExpandableListItem from '../ExpandableListItem';
import ChangeNetworkForm from './ChangeNetworkForm';
import { useNetworkConfigContext } from '../../../../context/contextLib';

function SettingNetwork({ onClose }) {
  const [currentNetwork, setCurrentNetwork] = useState([]);
  const [listWifi, setListWifi] = useState([]);

  const { abortControllersRef } = useNetworkConfigContext();

  const apiClient = useInjection(SignalrApiClient);

  const networkScan = async () => {
    apiClient.networkScanListeners.add(NETWORK_SCAN_LISTENER_NAME, (streamResponse) => {
      setListWifi((prevList) => {
        const updatedList = streamResponse.map((item) => {
          const prevItem = prevList.find((prev) => prev.name === item.name);
          return {
            ...item,
            isSelected: prevItem ? prevItem.isSelected : false,
          };
        });
        return updatedList;
      });
    });
  };

  useEffect(() => {
    const fetchConnectedNetworks = async () => {
      try {
        const connectedNetwork = await networkConfigurationApi.getConnectedNetwork();
        setCurrentNetwork(connectedNetwork);
      } catch (error) {
        console.error('Error fetching connected networks:', error);
      }
    };

    const fetchDeviceMaintenance = async () => {
      const newAbortController = new AbortController();
      abortControllersRef.current = newAbortController;

      await networkConfigurationApi.deviceMaintenanceApi(newAbortController.signal);
    };

    fetchConnectedNetworks();
    networkScan();
    fetchDeviceMaintenance();
  }, []);

  const handleSelectItem = (name) => {
    setListWifi((prevList) => prevList.map((item) => (item.name === name
      ? { ...item, isSelected: true }
      : { ...item, isSelected: false }),
    ),
    );
  };

  const formatListNetworks = (type, items) => {
    if (items?.length === 0) return '';

    const prefix = type === TypeInterfaceNetwork.WLAN ? 'WiFi' : 'LAN';

    return items
      ?.map((item, index) => {
        const itemPrefix = type === TypeInterfaceNetwork.WLAN ? prefix : `${prefix} ${index + 1}`;
        return `${itemPrefix} : ${item.name}`;
      })
      .join('<br />');
  };

  const resultNetworkTooltip = (array) => {
    const wlanItems = array?.filter(
      (item) => item.interface === TypeInterfaceNetwork.WLAN,
    );

    const ethernetItems = array?.filter(
      (item) => item.interface === TypeInterfaceNetwork.ETHERNET,
    );

    const wlanResult = formatListNetworks(TypeInterfaceNetwork.WLAN, wlanItems);
    const ethernetResult = formatListNetworks(
      TypeInterfaceNetwork.ETHERNET,
      ethernetItems,
    );

    return (
      <div>
        <div>{wlanResult}</div>
        <div>{ethernetResult}</div>
      </div>
    );
  };

  return (
    <>
      <div className="content-choose-device">
        <FmlxTooltip
          placement={FmlxTooltip.Placement.BOTTOM}
          title={<div>{resultNetworkTooltip(currentNetwork)}</div>}
        >
          <div className="tooltip-current-network">
            <FmlxIcon name="Info" size={FmlxIcon.Size.EXTRA_SMALL} />
            <span>Current Network</span>
          </div>
        </FmlxTooltip>
      </div>

      {listWifi.length === 0 && (
        <div className="loading-container">
          <CircularProgress color="inherit" size={77} />
          <p>Searching for Networks...</p>
        </div>
      )}

      <div className="list-wifi">
        {listWifi?.map((item) => (
          <ExpandableListItem
            key={`item-wifi${item.name}`}
            type={ExpandableItemType.EXPANABLE}
            label={item.name}
            wifiStrength={item.strength}
            isPasswordRequired={item.isPasswordRequired}
            selectedItem={item.isSelected}
            onSelect={() => handleSelectItem(item.name)}
          >
            <ChangeNetworkForm item={item} onClose={onClose} />
          </ExpandableListItem>
        ))}
      </div>
    </>
  );
}

SettingNetwork.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SettingNetwork;
