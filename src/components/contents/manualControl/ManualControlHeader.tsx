import { useInjection } from 'inversify-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import NumberHelper from '../../../helper/NumberHelper';
import DeviceSettingsService from '../../../services/DeviceSettingsService';
import DialogService from '../../../services/DialogService';
import { StampedeButton } from '../../FmlxUi';
import FmlxIcon from '../../icon/FmlxIcon';
import LoadingScreen from '../../loading/LoadingScreen';
import './ManualControlHeader.scss';
import CameraParameter from '../../../models/CameraParameter';

const GLOBAL = {
  max: {
    exposure: 1000000,
    awbGains: {
      red: 30,
      blue: 30,
    },
    frameRate: 60,
  },
};

const ManualControlHeader: React.FC = function ManualControlHeader() {
  const dialog = useInjection(DialogService);
  const showModal = () => {
    const content = <DeviceSettingForm close={closeModal} />;
    dialog.showModalNoFooter('Device Settings', content, null, 'sm')
      .then(null);
  };
  const closeModal = dialog.hideModal;
  return (
    <StampedeButton
      withIcon="start"
      icon={<FmlxIcon name="Setting" fontSize="sm" />}
      label="SETTINGS"
      onClick={showModal}
    />
  );
};

const DeviceSettingForm: React.FC<{ close(): any }> = function DeviceSettingForm(props: { close(): any }) {
  const { close } = props;
  const dialog = useInjection(DialogService);
  const service = useInjection(DeviceSettingsService);
  const [showLoading, setShowLoading] = useState(false);
  const [loadingLabel, setLoadingLabel] = useState<string>();
  const [exposure, setExposure] = useState<number>(0);
  const [awbGainR, setAwbGainR] = useState<number>(0);
  const [awbGainB, setAwbGainB] = useState<number>(0);
  const [gain, setGain] = useState<number>(0);
  const [frameRate, setFrameRate] = useState<number>(0);

  const onChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    const inputVal = parseFloat(input.value);
    switch (input.name) {
      case 'exposure':
        setExposure(parseInt(inputVal.toFixed(0), 10));
        break;
      case 'awbGains.red':
        setAwbGainR(inputVal);
        break;
      case 'awbGains.blue':
        setAwbGainB(inputVal);
        break;
      case 'gain':
        setGain(inputVal);
        break;
      case 'frameRate':
        setFrameRate(inputVal);
        break;
      default:
        break;
    }
  };
  const exposureValid = React.useMemo(() => exposureInRange(exposure), [exposure]);
  const awbGainRValid = React.useMemo(() => redAwbGainInRange(awbGainR), [awbGainR]);
  const awbGainBValid = React.useMemo(() => blueAwbGainInRange(awbGainB), [awbGainB]);
  const frameRateValid = React.useMemo(() => frameRateInRange(frameRate), [frameRate]);
  const gainValid = React.useMemo(() => gainInRange(gain), [gain]);
  const submitEnabled = exposureValid && awbGainRValid && awbGainBValid && frameRateValid && gainValid;

  const componentDidMount = () => {
    startLoading('Loading configuration');
    service.getCameraParameter()
      .then((param) => {
        setExposure(param.exposure);
        setAwbGainB(param.awbGains.blue);
        setAwbGainR(param.awbGains.red);
        setGain(param.gain);
        setFrameRate(param.frameRate);
      })
      .finally(() => {
        setShowLoading(false);
      });
  };
  const save = () => {
    startLoading('Applying new value');
    const param: CameraParameter = {
      exposure, awbGains: { red: awbGainR, blue: awbGainB }, gain, frameRate,
    };
    service.setCameraParameter(param)
      .then(() => dialog.alertSuccess('Setting has been saved'))
      .catch(dialog.alertError)
      .finally(() => setShowLoading(false));
  };
  const setAutoExposure = () => {
    startLoading('Getting fps');
    service.getCameraFrameRate()
      .then(calculateAutoExposure)
      .catch(dialog.alertError)
      .finally(() => setShowLoading(false));
  };
  const calculateAutoExposure = (fps: number) => {
    const exp = 1 / fps * 1000000;
    setExposure(parseFloat(exp.toFixed(0)));
  };
  const startLoading = (label: string) => {
    setLoadingLabel(label);
    setShowLoading(true);
  };
  useEffect(() => {
    componentDidMount();
    return () => {
      //
    };
  }, []);
  return (
    <form className="device-settings">
      {showLoading &&
        (
          <div className="device-settings-loading">
            <div>
              <LoadingScreen show showIconOnly />
              <span>{loadingLabel}</span>
            </div>
          </div>
        )}
      <div style={{ visibility: showLoading ? 'hidden' : 'visible' }}>
        <div className="device-settings-label mt-0">Exposure (0 - 1,000,000 µs)</div>
        <div className="flex-common">
          <Input
            name="exposure"
            symbol="µs"
            className="device-settings-input-exposure"
            onChange={onChange}
            valid={exposureValid}
            value={exposure}
          />
          <StampedeButton
            label="AUTO"
            mode="button"
            type="positive"
            onClick={setAutoExposure}
          />
        </div>
        <div className="device-settings-label">Gain</div>
        <Input
          name="gain"
          symbol="dB"
          className=""
          onChange={onChange}
          valid={gainValid}
          value={gain}
        />
        <div className="device-settings-label">Auto White Balance Gain - Blue (0 - {GLOBAL.max.awbGains.blue})</div>
        <Input
          name="awbGains.blue"
          symbol="dB"
          className=""
          onChange={onChange}
          valid={awbGainBValid}
          value={awbGainB}
        />
        <div className="device-settings-label">Auto White Balance Gain - Red (0 - {GLOBAL.max.awbGains.red})</div>
        <Input
          name="awbGains.red"
          symbol="dB"
          className=""
          onChange={onChange}
          valid={awbGainRValid}
          value={awbGainR}
        />
        <div className="device-settings-label">Framerate (0 - {GLOBAL.max.frameRate})</div>
        <Input
          name="frameRate"
          symbol="dB"
          className=""
          onChange={onChange}
          valid={frameRateValid}
          value={frameRate}
        />
        <div className="device-settings-footer mt-4">
          <div>
            <StampedeButton
              type="primary"
              variant="outline"
              label="CANCEL"
              onClick={close}
            />
            <StampedeButton
              type="primary"
              label="SAVE"
              onClick={submitEnabled ? save : undefined}
              disabled={!submitEnabled}
            />
          </div>
        </div>
      </div>
    </form>
  );
};

const Input: React.FC<{
  name: string, className: string, symbol: string, value: number, valid: boolean, onChange(e: ChangeEvent)
}> = function Input({ name, value, symbol, className, onChange, valid }) {
  const inValidClass = valid ? '' : 'device-settings-input-invalid';
  return (
    <div className={`device-settings-input ${className} ${inValidClass}`}>
      <input type="number" name={name} value={value} onChange={onChange} />
      <span className="flex-common"><span>{symbol}</span></span>
    </div>
  );
};

const exposureInRange = (val: number) => {
  return NumberHelper.inRange(val, 0, GLOBAL.max.exposure);
};
const redAwbGainInRange = (val: number) => {
  return NumberHelper.inRange(val, 0, GLOBAL.max.awbGains.red);
};
const blueAwbGainInRange = (val: number) => {
  return NumberHelper.inRange(val, 0, GLOBAL.max.awbGains.blue);
};
const frameRateInRange = (val: number) => {
  return NumberHelper.inRange(val, 0, GLOBAL.max.frameRate);
};
const gainInRange = (val: number) => {
  return !isNaN(val);
};

export default ManualControlHeader;
