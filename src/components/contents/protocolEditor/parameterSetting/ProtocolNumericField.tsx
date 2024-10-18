import React from 'react';
import { StampedeTextBox, StampedeTooltip } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import './ProtocolNumericField.scss';

let globalId = 0;

const ProtocolNumericField: React.FC<{
  value: number,
  onChange(val: number): any,
  disabled: boolean,
  error: boolean | undefined,
  inlineText: string | undefined,
  precision?: number,
  step?: number,
  changed?: boolean,
}> = function ({ value, onChange, disabled, error, inlineText, precision, step, changed }) {
  const id = React.useMemo(() => {
    globalId += 1;
    return `protocol-editor-section-field-${globalId}`;
  }, []);
  const originalValue = React.useMemo(() => value, []);
  const onChangeInternal = (val: string) => {
    val = val.trim();
    if (val === '') {
      onChange(NaN);
      return;
    }
    let num = parseFloat(val);
    if (isNaN(num)) {
      num = 0;
    }
    onChange(num);
  }
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onChange(originalValue);
    }
  };
  React.useEffect(() => {
    const input = document.getElementById(id);
    if (input) {
      input.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      if (input) {
        input.removeEventListener('keyup', handleKeyUp);
      }
    }
  }, []);
  return (
    <div
      className={`protocol-number-field ${changed && !disabled ? 'protocol-number-field-changed' : ''} ${error ? 'pe-4' : ''}`}
    >
      <StampedeTextBox
        key={id}
        id={id}
        variant="outline"
        mode="number"
        value={value}
        onChange={(arg: { value: any }) => onChangeInternal(arg.value)}
        disabled={disabled}
        error={error}
        precision={precision}
        size="sm"
        step={step}
        decoration="none"
      />
      {error && inlineText && (
        <StampedeTooltip
          title={inlineText}
          placement="bottom"
        >
          <div className="protocol-number-field__helper">
            <FmlxIcon name="InfoCircle" fontSize="xs" />
          </div>
        </StampedeTooltip>
      )}
    </div>
  );
};

ProtocolNumericField.defaultProps = {
  precision: 3,
  step: 0.01,
  changed: false,
};

export default ProtocolNumericField;
