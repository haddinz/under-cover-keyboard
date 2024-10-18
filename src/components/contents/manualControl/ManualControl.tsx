import React from 'react';
import { SectionEnum } from '../../../enums/SectionEnum';
import BaseContent from '../../base/BaseContent';
import Footer from '../../layout/Footer';
import CameraView from '../cameraView/CameraView';
import HeaterLedControl from './heaterLedControl/HeaterLedControl';
import LedHeaterControl from './ledHeaterControl/LedHeaterControl';
import './ManualControl.scss';
import ManualControlHeader from './ManualControlHeader';
import MotorControl from './motorControl/MotorControl';

export default class ManualControl extends BaseContent<any, any> {
  get section() { return SectionEnum.ManualControl; }
  get headerContent() { return <ManualControlHeader />; }
  get footerContent(): any {
    return <Footer />;
  }

  render = () => {
    const Container = this.commonTemplate;
    return (
      <Container>
        <div className="row">
          <div className="col-md-6">
            <div>
              <MotorControl />
            </div>
            <div className="flex-common-x-start" style={{ minHeight: 'calc(100% - 200px)' }}>
              <LedHeaterControl />
            </div>
          </div>
          <div className="col-md-6 height-100">
            <CameraView />
          </div>
          <div className="col-12">
            <HeaterLedControl />
          </div>
        </div>
      </Container>
    );
  }
}
