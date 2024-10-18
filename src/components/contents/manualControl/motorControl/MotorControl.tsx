import { FmlxRadioButton } from 'fmlx-common-ui';
import { resolve } from 'inversify-react';
import React, { useContext } from 'react';
import config from '../../../../config';
import { MotorControlContext } from '../../../../context/contexes';
import NumberHelper from '../../../../helper/NumberHelper';
import CpanelUpdate from '../../../../models/CpanelUpdate';
import { DefaultServiceResponse } from '../../../../models/ServiceResponse';
import DialogService from '../../../../services/DialogService';
import CpanelUpdateAwareComponent from '../../../base/CpanelUpdateAwareComponent';
import { StampedeRadioButton } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import FormAbsoluteMove from './FormAbsoluteMove';
import FormRelativeMove from './FormRelativeMove';
import './MotorControl.scss';
import VelocitySetting from './VelocitySetting';

type State = {
  velocity: number;
  position: number;
  mode: ActionMode;
  isHoming: boolean;
  showVelocitySetting: boolean;
  isMovingAbs: boolean;
  maxMotorPosition: number;

  // always 0
  minMotorPosition: number;
};

enum ActionMode {
  STATUS_MOVE_ABS,
  STATUS_MOVE_REL,
}

const motorResolution = config.SETTING.MOTOR_RESULITION;

export default class MotorControl extends CpanelUpdateAwareComponent<any, State> {
  private firstUpdate = false;
  private moveAbsFieldSyncWithUpdate = false;
  @resolve(DialogService)
  private dialog: DialogService;

  get name(): string { return 'MotorControl'; }

  constructor(props: any) {
    super(props);
    this.state = {
      mode: ActionMode.STATUS_MOVE_ABS,
      position: 0,
      velocity: 50,
      isHoming: false,
      showVelocitySetting: false,
      isMovingAbs: false,
      maxMotorPosition: 0,
      minMotorPosition: 0,
    };
  }
  componentDidMount() {
    this.cpanelService.GetMaxMotorPosition()
      .then((resp) => this.setState({ maxMotorPosition: resp.content }));
    super.componentDidMount();
  }
  onCpanelUpdate = (update: CpanelUpdate) => {
    if (!this.firstUpdate || this.moveAbsFieldSyncWithUpdate) {
      this.firstUpdate = true;
      this.setState({ position: parseFloat(update.m0Position.toFixed(1)) });
    }
  }
  handleChangeModeRelative = (arg: { index: number }) => {
    if (arg.index >= 0) {
      this.setState({ mode: ActionMode.STATUS_MOVE_REL });
    }
  }
  handleChangeModeAbsolute = (arg: { index: number }) => {
    if (arg.index >= 0) {
      this.setState({ mode: ActionMode.STATUS_MOVE_ABS });
    }
  }
  homeMotor = () => {
    this.setState({ isHoming: true }, () => {
      this.syncMoveAbsField();
      this.cpanelService.HomeMotor()
        .then(() => { })
        .catch(this.dialog.alertError)
        .finally(() => {
          this.setState({ isHoming: false }, this.updateMotorPosInput);
        });
    });
  }
  syncMoveAbsField = (sync = true) => {
    this.moveAbsFieldSyncWithUpdate = sync;
  }
  commonServiceCall = (action: Promise<DefaultServiceResponse>, callback?: () => any) => {
    action.then(callback).catch(this.dialog.alertError);
  }
  moveAbsolute = () => {
    const { position, velocity } = this.state;
    if (!this.positionInrange(position)) {
      this.dialog.alertError('Cannot move to commanded position (out of range).');
      return;
    }
    const adjustedPos = NumberHelper.nearestNumber(position, config.SETTING.MOTOR_RESULITION);
    const callback = () => this.setState({ isMovingAbs: false }, this.updateMotorPosInput);
    this.setState({ isMovingAbs: true, position: adjustedPos }, () => {
      this.cpanelService.MoveMotorAbsolute(adjustedPos, velocity)
        .catch(this.dialog.alertError)
        .finally(callback);
    });
  }
  positionInrange = (pos: number) => {
    const { minMotorPosition, maxMotorPosition } = this.state;
    return NumberHelper.inRange(pos, minMotorPosition, maxMotorPosition);
  }
  /**
   * Update input field value based on the latest position
   */
  updateMotorPosInput = () => {
    this.moveAbsFieldSyncWithUpdate = false;
    this.cpanelService.GetMotorPosition()
      .then((response) => {
        this.setState({ position: parseFloat(response.content.toFixed(1)) });
      });
  }
  startMotorMove = (clockWise: boolean) => {
    this.syncMoveAbsField();
    this.commonServiceCall(this.cpanelService.StartMotorMove(this.state.velocity, clockWise));
  }
  stopContinousMove = () => {
    this.cpanelService.StopMotorMove()
      .then(this.waitMotorMove)
      .catch(this.dialog.alertError)
      .finally(this.updateMotorPosInput);
  }
  waitMotorMove = () => {
    this.cpanelService.WaitMotorMove()
      .catch(this.dialog.alertError);
  }
  moveRelative = (absIncrement: number, clockWise: boolean) => {
    const { position: lastPosition } = this.state;
    const increment = (clockWise ? absIncrement : -absIncrement);
    if (!this.positionInrange(lastPosition + increment)) {
      this.dialog.alertError('Cannot move to commanded position (out of range).');
      return;
    }
    const callback = this.updateMotorPosInput;
    this.commonServiceCall(this.cpanelService.MoveMotorRelative(increment, this.state.velocity), callback);
  }
  setVelocityValue = (velocity: number) => this.setState({ velocity });
  setMotorVelocityInputOpen = (showVelocitySetting: boolean) => {
    this.setState({ showVelocitySetting });
  }
  render() {
    const { mode, position, velocity, isHoming, showVelocitySetting, isMovingAbs, maxMotorPosition } = this.state;
    const isActiveMoveAbs = mode === ActionMode.STATUS_MOVE_ABS;
    const isActiveMoveRel = mode === ActionMode.STATUS_MOVE_REL;
    const moveAbsDisabled = isHoming || isMovingAbs || !isActiveMoveAbs;
    const moveRelDisabled = isHoming || !isActiveMoveRel;
    const contextVal = {
      isHoming,
      position,
      moveAbsDisabled,
      moveRelDisabled,
      maxMotorPosition,
      moveRelative: this.moveRelative,
      startMotorMove: this.startMotorMove,
      stopContinousMove: this.stopContinousMove,
      moveAbsolute: this.moveAbsolute,
      handleInputChange: this.handleInputChange,
      homeMotor: this.homeMotor,
    };
    const CtxProvider = MotorControlContext.Provider;
    return (
      <div id="motor-ctrl" className="px-3 pt-2 pb-3 motor-control-container me-4 mb-3">
        {
          showVelocitySetting &&
          (
            <VelocitySetting
              value={velocity}
              onChange={this.setVelocityValue}
              setOpen={this.setMotorVelocityInputOpen}
            />
          )
        }
        <CtxProvider value={contextVal}>
          <div className="row" style={{ alignItems: 'center' }}>
            <Title />
            <div id="Move-Abs-Label" className="col-md-6 ps-1 mb-3 pe-0 mt-1">
              <RadioButtons
                label={<>Absolute Move<span className="move-motor-label-info">(0 - {maxMotorPosition.toFixed(1)}&#176;)</span></>}
                active={isActiveMoveAbs}
                onChange={this.handleChangeModeAbsolute}
              />
            </div>
            <div id="Move-Abs-Input" className="col-md-6 mb-2 mt-1">
              <FormAbsoluteMove onSettingClick={() => this.setMotorVelocityInputOpen(true)} />
            </div>

            <div id="Move-Rel-Label" className="col-md-6 ps-1 pe-0 mb-1">
              <RadioButtons
                label={<>Relative Move<span className="move-motor-label-info">({motorResolution}&#176; multiple)</span></>}
                active={isActiveMoveRel}
                onChange={this.handleChangeModeRelative}
              />
            </div>
            <div id="Move-Rel-Input" className="col-md-6 mb-1">
              <FormRelativeMove />
            </div>
          </div>
        </CtxProvider>
      </div>
    );
  }
}

const Title: React.FC = function Title() {
  return (
    <>
      <div className="col-md-5 mb-3">
        <h6 className="motor-control-title">Motor Control</h6>
      </div>
      <div className="col-md-7 mb-3">
        <ButtonHomeMotor />
      </div>
    </>
  );
};

const ButtonHomeMotor: React.FC = function ButtonHomeMotor() {
  const { isHoming, homeMotor } = useContext(MotorControlContext);
  if (isHoming) {
    const className = 'button-home-motors button-home-motors-disabled rounded px-2 py-1';
    return (
      <button type="button" className={className} disabled>
        <FmlxIcon fontSize="xs" customColor="#C2C2C2" name="Reload" />
        <span className="ms-2">HOME</span>
      </button>
    );
  }
  const className = 'button-home-motors rounded px-2 py-1';
  return (
    <button type="button" onClick={homeMotor} className={className}>
      <FmlxIcon fontSize="xs" customColor="#DB0000" name="Reload" />
      <span className="ms-2">HOME</span>
    </button>
  );
};

const RadioButtons: React.FC<{
  active: boolean, label: any, onChange: (arg: { index: number }) => any
}> = function RadioButtons({ active, label, onChange }) {
  const { isHoming } = useContext(MotorControlContext);

  const onChangeInternal = (arg: { index: number | string }) => {
    if (typeof arg.index === 'number') {
      onChange({ index: arg.index });
    }
  };

  return (
    <StampedeRadioButton
      selectedIndex={active ? 0 : -1}
      items={[{
        content: label,
        disabled: false,
        hint: '',
        type: FmlxRadioButton.HintType.INFORMATION,
        icon: undefined,
      }]}
      onChange={onChangeInternal}
      disabled={isHoming}
    />
  );
};
