import React, { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { TempControlContext } from '../../../../context/contexes';
import TempControllerId from '../../../../enums/TempControllerId';
import { StampedeButton, StampedeSwitch } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';

const PcrTempSetting: React.FC<{
  id: TempControllerId,
  label: string,
  enabled: boolean,
  target: string,
}> = function PcrTempSetting({ id, label, enabled, target }) {
  const [editMode, setEditMode] = useState(false);
  const [targetValue, setTargetValue] = useState(target);
  const { togglePcr, setTemperature } = useContext(TempControlContext);

  const labelClassName = `target-temp-label ${(editMode ? 'target-temp-label-active' : '')}`;
  const formRef = React.createRef<HTMLFormElement>();

  const onSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    if (formRef.current) {
      if (!formRef.current.reportValidity()) {
        return;
      }
    }
    setTemperature(id, targetValue);
    setEditMode(false);
  };
  const onInputChange = (e: ChangeEvent) => {
    const input = e.target as HTMLInputElement;
    setTargetValue(input.value);
  };
  const toggle = (enable: boolean) => {
    togglePcr(id, enable);
  };
  const onCancel = () => {
    setTargetValue(target);
    setEditMode(false);
  };
  const onKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };
  const settingOnClick = () => {
    setTargetValue(target);
    setEditMode(true);
  };

  return (
    <>
      <span className="led-heater-control-label me-3">{label}</span>
      <StampedeSwitch onChange={toggle} checked={enabled} size="lg" withIcon />
      <form ref={formRef} className={labelClassName} onSubmit={onSubmit}>
        {
          editMode ?
            (
              <input
                type="number"
                onChange={onInputChange}
                onKeyUp={onKeyUp}
                step="0.1"
                className="target-temp-input me-1"
                value={targetValue}
              />
            ) :
            (
              <input
                className="target-temp-input me-1"
                value={target}
                disabled
              />
            )
        }
        <span>&#176;C</span>
        {editMode && <ButtonSubmitTargetTemp onSubmit={onSubmit} onCancel={onCancel} />}
      </form>
      {!editMode && <ButtonSetting onClick={settingOnClick} />}
    </>
  );
};

const BUTTON_STYLE: React.CSSProperties = { flexWrap: 'nowrap', alignItems: 'center', gap: 0 };

const ButtonSetting: React.FC<{ onClick: () => any }> = function ButtonSetting({ onClick }) {
  const iconEdit = <FmlxIcon name="Edit" customColor="#414141" fontSize="sm" />;
  return (
    <div className="d-flex" style={BUTTON_STYLE}>
      <StampedeButton onlyIcon size="xs" onClick={onClick} icon={iconEdit} />
    </div>
  );
};
const ButtonSubmitTargetTemp: React.FC<{
  onSubmit: () => any, onCancel: () => any
}> = function ButtonSubmitTargetTemp({ onCancel, onSubmit }) {
  const iconSubmit = <FmlxIcon name="ApplyOutline" customColor="#008F40" fontSize="sm" />;
  const iconCancel = <FmlxIcon name="CancelOutline" customColor="#DB0000" fontSize="sm" />;
  return (
    <div className="d-flex ms-3" style={BUTTON_STYLE}>
      <StampedeButton onlyIcon size="xs" onClick={onSubmit} icon={iconSubmit} />
      <StampedeButton onlyIcon size="xs" onClick={onCancel} icon={iconCancel} />
    </div>
  );
};

export default PcrTempSetting;
