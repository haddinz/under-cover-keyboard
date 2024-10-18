import Axios from 'axios';
import { RestAPI } from '../../enums/routeApi';

const getConnectedNetwork = async () => {
  const url = RestAPI.GetConnectedNetworks;
  try {
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi getConnectedNetwork:', error);
    return null;
  }
};

const getHostname = async () => {
  const url = RestAPI.GetHostName;
  try {
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi getHostName:', error);
    return null;
  }
};

const getWifiEnable = async () => {
  const url = RestAPI.GetWifiEnable;
  try {
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi getWifiEnable:', error);
    return null;
  }
};

const getNetworkHistoryListApi = async () => {
  const url = RestAPI.GetListNetwork;
  try {
    const response = await Axios.get(url);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi getNetworkHistoryListApi:', error);
    return null;
  }
};

const forgetNetworkApi = async (name) => {
  const data = new FormData();
  data.append('name', name);
  const url = RestAPI.ForgetNetwork;

  try {
    const response = await Axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return true;
  } catch (error) {
    console.error('networkConfigurationApi forgetNetworkApi:', error);
    return false;
  }
};

const hostnameCheckApi = async (hostname) => {
  const data = new FormData();
  data.append('hostname', hostname);
  const url = RestAPI.HostnameCheck;

  try {
    const response = await Axios.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi hostnameCheckApi :', error);
    return null;
  }
};

const saveConfigNetworkApi = async (data) => {
  const url = RestAPI.SaveConfigWifi;

  try {
    await Axios.post(url, data);
    return true;
  } catch (error) {
    console.error('networkConfigurationApi saveConfigNetworkApi :', error);
    return false;
  }
};

const connectNetworkApi = async (data) => {
  const url = RestAPI.ConnectNetwork;

  try {
    const response = await Axios.post(url, data);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi connectNetworkApi :', error);
    return null;
  }
};

const deviceMaintenanceApi = async (signal) => {
  const url = RestAPI.DeviceMaintenance;

  try {
    const response = await Axios.post(url, { config: { signal } });
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi deviceMaintenanceApi :', error);
    return null;
  }
};

const stopDeviceMaintenanceApi = async () => {
  const url = RestAPI.StopMaintenance;

  try {
    await Axios.post(url);
    return true;
  } catch (error) {
    console.error('networkConfigurationApi stopDeviceMaintenanceApi :', error);
    return false;
  }
};

const getConfigNetworkSettingApi = async () => {
  const url = RestAPI.GetConfigSettingNetwork;

  try {
    const response = await Axios.post(url);
    return response.data;
  } catch (error) {
    console.error('networkConfigurationApi getConfigNetworkSetting :', error);
    return false;
  }
};

const networkConfigurationApi = {
  getConnectedNetwork,
  getHostname,
  getWifiEnable,
  getNetworkHistoryListApi,
  forgetNetworkApi,
  hostnameCheckApi,
  saveConfigNetworkApi,
  connectNetworkApi,
  deviceMaintenanceApi,
  stopDeviceMaintenanceApi,
  getConfigNetworkSettingApi,
};

export default networkConfigurationApi;
