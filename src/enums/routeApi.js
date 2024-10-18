import config from '../config';

const API = 'api';

const Services = {
  USER_MANAGEMENT: 'user-management',
  ROLE_MANAGEMENT: 'role-management',
  USER_PROFILE: 'user-profile',
  MENU_MANAGEMENT: 'menu-management',
  TEST_HISTORY: 'test-history',
  INSTRUMENT: 'instrument-commands',
  TEST_SIGNAL: 'test-signal',
  NOTIFICATION: 'notifications',
  PATIENT: 'patient',
  INSTRUMENTS: 'instruments',
  DEVICE_POWER: 'device/power',
  NETWORK: 'network',
  DEVICE: 'device',
};

export const RestAPI = {

  RestartDevice: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown',
  ].join('/'),

  CancelRestart: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'cancel-shutdown',
  ].join('/'),

  CancelShutdown: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'cancel-shutdown',
  ].join('/'),

  ShutdownDeviceNow: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-now',
  ].join('/'),

  GetPatientId: [config.SERVICE_HOST, API, Services.PATIENT, 'getPatient'].join(
    '/',
  ),

  RestartDeviceNow: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-now',
  ].join('/'),

  ShutdownMultipleDevice: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-multiple',
  ].join('/'),

  RestartMultipleDevice: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-multiple',
  ].join('/'),

  DeleteSingleDevice: (name) => [config.SERVICE_HOST, API, Services.INSTRUMENTS, `${name}`].join('/'),

  DeleteMultipleDevice: (nameQueryStr) => [
    config.SERVICE_HOST,
    API,
    Services.INSTRUMENTS,
    `delete-multiple?${nameQueryStr.join('&')}`,
  ].join('/'),

  RestartPreparation: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-preparation',
  ].join('/'),

  ShutdownPreparation: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-preparation',
  ].join('/'),

  RestartMultiplePreparation: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-preparation-multiple',
  ].join('/'),

  ShutdownMultiplePreparation: [
    config.SERVICE_HOST,
    API,
    Services.DEVICE_POWER,
    'shutdown-preparation-multiple',
  ].join('/'),

  NetworkIsEnabled: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'wifi',
    'is-enabled',
  ].join('/'),

  GetHistoryNetwork: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'known-networks',
  ].join('/'),

  GetDetailNetwork: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'known-network-detail',
  ].join('/'),

  GetConnectedNetworks: `${config.SERVICE_HOST}${API}/${[Services.NETWORK, 'connected-networks'].join('/')}`,

  GetAvailableDevices: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'available-devices',
  ].join('/'),

  CheckHostname: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'check-hostname',
  ].join('/'),

  ChangeDeviceName: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'set-hostname',
  ].join('/'),

  GetDeviceOption: [
    config.SERVICE_HOST,
    API,
    Services.INSTRUMENT,
    'device-options',
  ].join('/'),

  AccessPointConnectMulti: [
    config.SERVICE_HOST,
    API,
    Services.NETWORK,
    'access-point',
    'connect-multiple',
  ].join('/'),

  GetHostName: `${config.SERVICE_HOST}${API}/${[Services.NETWORK, 'hostname',
  ].join('/')}`,

  GetWifiEnable: `${config.SERVICE_HOST}${API}/${[Services.NETWORK, 'isWifiEnable',
  ].join('/')}`,

  GetListNetwork: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/known-networks`,

  ForgetNetwork: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/forget`,

  HostnameCheck: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/hostname-check`,

  SaveConfigWifi: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/save-config`,

  ConnectNetwork: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/connect`,

  DeviceMaintenance: `${config.SERVICE_HOST}${API}/maintenance/run`,

  StopMaintenance: `${config.SERVICE_HOST}${API}/maintenance/stop`,

 GetConfigSettingNetwork: `${config.SERVICE_HOST}${API}/${Services.NETWORK}/read-config`,
};
