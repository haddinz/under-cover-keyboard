const PcrProfileSetting = {
  temp: { max: 105, min: 0 },
  motorOffset: { max: 6.0, min: -6.0, step: 0.3 },
  motorVel: { max: 3.6, min: 0, step: 0.3 },
  maxCycle: 50,
  maxHoldTimeSec: 15,
};

const dateOpt: Intl.DateTimeFormatOptions = {
  month: '2-digit',
  day: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
};

const SETTING = {
  NUM_CHANNEL: 5,
  DEFAULT_MAX_CHART_Y_AXIS: 100,
  MAX_CHART_X_AXIS: 150,
  MOTOR_RESULITION: 0.3,
  CHART_UPDATE_INTERVAL_MS: 66, // match camera FPS (15)
  STREAM_INTERVAL_MS: 100, // match camera FPS (15)
  PCR_PROFILE_SETTING: PcrProfileSetting,
  DATE_OPTS: dateOpt,
};

const production = {
  SERVICE_HOST: `//${window.location.host}/`,
  SERVICE_URL: `//${window.location.host}/hub/cpanel`,
  CAMERA_STREAM_URL: `//${window.location.hostname}:7777`,
  SETTING: SETTING,
  TITLE: 'Stampede',
  TEST_MODE: false,
};

const DEV_HOST = 'localhost';
const DEV_PORT = 5000;
const CAM_HOST = 'localhost';
const CAM_PORT = 7777;

const development = {
  SERVICE_HOST: `http://${DEV_HOST}:${DEV_PORT}/`,
  SERVICE_URL: `http://${DEV_HOST}:${DEV_PORT}/hub/cpanel`,
  CAMERA_STREAM_URL: `http://${CAM_HOST}:${CAM_PORT}`,
  SETTING: SETTING,
  TITLE: 'Stampede Development',
  TEST_MODE: process.env.NODE_ENV === 'test',
};

const config = process.env.NODE_ENV === 'production' ? production : development;
export default config;
