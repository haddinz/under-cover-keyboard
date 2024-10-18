import React, { ChangeEvent } from 'react';

const InputMotorPosition: React.FC<{
  name: string, value: any, onChange: (e: ChangeEvent) => any, disabled: boolean
}> = function InputMotorPosition({ name, value, onChange, disabled }) {
  const disabledClass = (disabled ? 'input-motor-position-container-disabled' : '');
  return (
    <div className={`input-motor-position-container px-2 ${disabledClass}`}>
      {
        disabled ?
          <input value={value} className="input-motor-position" disabled />
          :
          (
            <input
              type="number"
              name={name}
              id={name}
              value={value}
              step="0.1"
              onChange={onChange}
              className="input-motor-position"
              required
            />
          )
      }
      <span>&#176;</span>
    </div>
  );
};

export default InputMotorPosition;
