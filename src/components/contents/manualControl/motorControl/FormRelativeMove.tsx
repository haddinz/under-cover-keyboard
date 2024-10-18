import React, { ChangeEvent, useContext, useState } from 'react';
import config from '../../../../config';
import { MotorControlContext } from '../../../../context/contexes';
import NumberHelper from '../../../../helper/NumberHelper';
import InputMotorPosition from './InputMotorPosition';
import MotorActionButtonWithIcon from './MotorActionButtonWithIcon';

const DEFAULT_STEP = config.SETTING.MOTOR_RESULITION.toFixed(1);
const onInputChange = (e: ChangeEvent, setValue: (val: any) => any) => {
  const target = e.target as HTMLInputElement;
  setValue(target.value);
};

const FormRelativeMove: React.FC = function FormRelativeMove() {
  const { moveRelDisabled, moveRelative: ctxMmoveRelative, startMotorMove, stopContinousMove } = useContext(MotorControlContext);
  const [increment, setIncrement] = useState(DEFAULT_STEP);
  const onChange = (e: ChangeEvent) => {
    onInputChange(e, setIncrement);
  };
  const moveRelative = (clockwise: boolean) => {
    let step = parseFloat(increment);
    if (isNaN(step) || step <= 0) {
      step = parseFloat(DEFAULT_STEP);
    }
    step = NumberHelper.nearestNumber(step, config.SETTING.MOTOR_RESULITION);
    setIncrement(step.toFixed(1));
    ctxMmoveRelative(step, clockwise);
  };
  return (
    <form onSubmit={(e) => e.preventDefault()} className="form-motor-move">
      <InputMotorPosition name="increment" value={increment} onChange={onChange} disabled={moveRelDisabled} />
      <ButtonMotorMoveGroup
        onClick={moveRelative}
        onMouseDown={startMotorMove}
        onMouseUp={stopContinousMove}
        disabled={moveRelDisabled}
      />
    </form>
  );
};

const ButtonMotorMoveGroup: React.FC<{
  disabled: boolean, onClick?: (clockwise: boolean) => any, onMouseDown?: (clockwise: boolean) => any, onMouseUp?: (clockwise: boolean) => any
}> = function ButtonMotorMoveGroup({ disabled, onClick, onMouseDown, onMouseUp }) {
  const click = onClick ?? (() => { });
  const mouseUp = onMouseUp ?? (() => { });
  const mouseDown = onMouseDown ?? (() => { });
  return (
    <div className="button-motor-move-group">
      <MotorActionButtonWithIcon
        icon="RotateCCW"
        fontSize="xs"
        disabled={disabled}
        onClick={() => click(false)}
        onMouseDown={() => mouseDown(false)}
        onMouseUp={() => mouseUp(false)}
      />
      <MotorActionButtonWithIcon
        icon="RotateCW"
        fontSize="xs"
        disabled={disabled}
        onClick={() => click(true)}
        onMouseDown={() => mouseDown(true)}
        onMouseUp={() => mouseUp(true)}
      />
    </div>
  );
};

ButtonMotorMoveGroup.defaultProps = {
  onClick: undefined,
  onMouseUp: undefined,
  onMouseDown: undefined,
};

export default FormRelativeMove;
