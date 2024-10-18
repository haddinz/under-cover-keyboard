import React from 'react';
import FmlxIcon from '../../../icon/FmlxIcon';
import MotorActionButton from './MotorActionButton';
import icons from '../../../../_assets/icons';

const MotorActionButtonWithIcon: React.FC<{
  type?: 'button' | 'submit',
  icon: keyof typeof icons,
  fontSize: 'xs' | 'sm' | 'md' | 'lg',
  disabled: boolean,
  onClick?: () => any,
  onMouseDown?: () => any,
  onMouseUp?: () => any,
}> = function MotorActionButtonWithIcon({ icon, type, fontSize, disabled, onClick, onMouseDown, onMouseUp }) {
  const className = disabled ? 'button-motor-move button-motor-move-disabled' : 'button-motor-move';
  const emptyFunc = () => { };
  return (
    <MotorActionButton
      type={type ?? 'button'}
      className={className}
      onClick={onClick ?? emptyFunc}
      onMouseDown={onMouseDown ?? emptyFunc}
      onMouseUp={onMouseUp ?? emptyFunc}
      disabled={disabled}
    >
      <FmlxIcon name={icon} fontSize={fontSize} customColor={disabled ? '#C2C2C2' : '#FFFFFF'} />
    </MotorActionButton>
  );
};

MotorActionButtonWithIcon.defaultProps = {
  type: 'button',
  onClick: undefined,
  onMouseUp: undefined,
  onMouseDown: undefined,
};

export default MotorActionButtonWithIcon;
