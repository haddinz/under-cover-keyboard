import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';
import TempControllerId from '../../enums/TempControllerId';
import CpanelUpdate from '../../models/CpanelUpdate';
import CPanelService from '../../services/CPanelService';
import FmlxIcon from '../icon/FmlxIcon';
import './Footer.scss';

const VIEW_NAME = 'footer';
const ledIndexes = [0, 1, 2, 3, 4];

const Footer: React.FC = function Footer() {
  const service = useInjection(CPanelService);
  const [update, setCpanelUpdate] = useState(CpanelUpdate.defaultUpdate());
  useEffect(() => {
    // did mount
    service.subscribeCpanelUpdate(VIEW_NAME, setCpanelUpdate);
    return () => {
      // will unmount
      service.unsubscribeCpanelUpdate(VIEW_NAME);
    };
  }, []);

  const pcr1Footer = pcrValueLabel(update, TempControllerId.PCR1);
  const pcr2Footer = pcrValueLabel(update, TempControllerId.PCR2);

  return (
    <footer className="footer container-fluid" data-testid="app-footer">
      <div className="row pt-3">
        <div className="col-md-8">
          <div className="footer-title"><span title={getFooterTitle(update)}>General</span></div>
          <div className="w-100 d-flex" style={{ borderRight: 'solid 1px rgba(202, 202, 202, 1)' }}>
            <ComponentInfo width={`${100 / 5}%`} label="Motor" value={`${update.m0Position.toFixed(1)} deg`} />
            <ComponentInfo width={`${100 / 5}%`} label="LED 1" value={update.ledEnabled} />
            <ComponentInfo width={`${100 / 5}%`} label="LED 2" value={update.ledEnabled} />
            <ComponentInfo width={`${100 / 5}%`} label="Ambient" value={`${update.ambientTemperature.toFixed(1)}°C`} />
            <ComponentInfo width={`${100 / 5}%`} label="PCR 1" value={update.temperatureEnabled.pcr1} footer={pcr1Footer} />
            <ComponentInfo width={`${100 / 5}%`} label="PCR 2" value={update.temperatureEnabled.pcr2} footer={pcr2Footer} />
            <ComponentInfo width={`${100 / 9}%`} label="Chip" value={update.chipDetected} />
          </div>
        </div>
        <div className="col-md-4">
          <div className="footer-title"><span title={getSlugAdjusterTitle(update.heaterLedPwmDutyValues)}>Heater LED</span></div>
          <div className="w-100 d-flex" style={{ borderRight: 'solid 1px rgba(202, 202, 202, 1)' }}>
            {ledIndexes.map((i) => {
              const width = i === ledIndexes.length - 1 ? 100 / 7 : 100 / 4.5;
              const key = `slug-adjuster-${i}`;
              return <ComponentInfo key={key} width={`${width}%`} label={`Ch ${i}`} value={update.heaterLedPwmDutyValues[i] > 0} />;
            })}
          </div>
        </div>
      </div>
    </footer>
  );
};

const getFooterTitle = (update: CpanelUpdate) => {
  const { targetTemperature, temperature, temperatureEnabled } = update;
  return [
    `MotorPos: ${update.m0Position}`,
    `CameraFramerate: ${update.cameraFramerate}`,
    `Led1Enabled: ${update.ledEnabled}`,
    `Led2Enabled: ${update.ledEnabled}`,
    `Pcr1Temp: ${temperature.pcr1.toFixed(1)}C/${targetTemperature.pcr1.toFixed(1)}C ${temperatureEnabled.pcr1 ? 'on' : 'off'}`,
    `Pcr2Temp: ${temperature.pcr2.toFixed(1)}C/${targetTemperature.pcr2.toFixed(1)}C ${temperatureEnabled.pcr2 ? 'on' : 'off'}`,
    `ChipDetected: ${update.chipDetected}`,
  ].join('\n');
};

const getSlugAdjusterTitle = (values: number[]) => {
  return values.map((value, index) => `ch${index} value: ${value}`).join('\n');
};

const pcrValueLabel = (cpanelUpdate: CpanelUpdate, id: TempControllerId) => {
  const { temperature, targetTemperature } = cpanelUpdate;
  const { PCR1 } = TempControllerId;
  const temp = id === PCR1 ? temperature?.pcr1?.toFixed(1) : temperature?.pcr2?.toFixed(1);
  const target = id === PCR1 ? targetTemperature?.pcr1?.toFixed(1) : targetTemperature?.pcr2?.toFixed(1);
  return <span>{temp}&#176;C/{target}&#176;C</span>;
};

const ComponentInfo: React.FC<{
  width: string,
  label: string,
  value: any,
  footer?: any
}> = function ComponentInfo({ width, label, value, footer }) {
  return (
    <div style={{ width }}>
      <div className="">
        <div className="footer-component-label">
          {label}
        </div>
        <div className="footer-component-value">
          {typeof value === 'boolean' ?
            (
              <FmlxIcon
                name={value ? 'CheckboxChecked' : 'Cancel'}
                fontSize={value ? 'xs' : 'sm'}
                customColor={value ? 'green' : 'rgba(219, 0, 0, 1)'}
              />
            ) : value}
          {footer && <div>{footer}</div>}
        </div>
      </div>
    </div>
  );
};

ComponentInfo.defaultProps = {
  footer: null,
};

export default Footer;
