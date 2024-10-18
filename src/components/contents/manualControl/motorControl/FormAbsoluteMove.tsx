import React, { FormEvent, useContext } from 'react';
import { MotorControlContext } from '../../../../context/contexes';
import FmlxIcon from '../../../icon/FmlxIcon';
import InputMotorPosition from './InputMotorPosition';
import MotorActionButtonWithIcon from './MotorActionButtonWithIcon';

const FormAbsoluteMove: React.FC<{ onSettingClick: (e: any) => any }> = function FormAbsoluteMove({ onSettingClick }) {
  const { isHoming, position, moveAbsDisabled, handleInputChange, moveAbsolute } = useContext(MotorControlContext);
  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    moveAbsolute();
  };
  return (
    <form onSubmit={onSubmit} className="form-motor-move">
      <InputMotorPosition name="position" value={position} onChange={handleInputChange} disabled={moveAbsDisabled} />
      <div>
        <MotorActionButtonWithIcon type="submit" icon="Run" fontSize="md" disabled={moveAbsDisabled} />
      </div>
      <div className="w-100">
        {isHoming ?
          (
            <button type="button" className="button-motor-setting button-motor-setting-disabled" disabled>
              <FmlxIcon name="Setting" customColor="#C2C2C2" fontSize="sm" />
            </button>
          ) :
          (
            <button onClick={onSettingClick} type="button" className="button-motor-setting">
              <FmlxIcon name="Setting" customColor="#008F40" fontSize="sm" />
            </button>
          )}
      </div>
    </form>
  );
};

export default FormAbsoluteMove;
