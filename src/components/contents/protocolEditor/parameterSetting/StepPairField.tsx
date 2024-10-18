import React from 'react';
import ProtocolNumericField from './ProtocolNumericField';
import { ValidationResult } from '../../../../models/ValidationResult';

const StepPairField: React.FC<{
  enabled: boolean,
  step1Val: number | undefined,
  step2Val: number | undefined,
  step1Validation: ValidationResult | null,
  step2Validation: ValidationResult | null,
  step1Change: (val: number) => any,
  step2Change: (val: number) => any,
  step?: number,
  readOnly?: boolean,
  step1Changed?: boolean,
  step2Changed?: boolean,
}>
= function ({
  enabled,
  step1Val,
  step2Val,
  step1Validation,
  step2Validation,
  step,
  step1Change,
  step2Change,
  readOnly,
  step1Changed,
  step2Changed,
}) {
    if (readOnly) {
      return (
        <div className="protocol-editor-section-field-cell">
          <div className="protocol-editor-section-field-divider" />
          <div className="protocol-editor-section-field-cell-double">{step1Val}</div>
          <div className="protocol-editor-section-field-cell-double">{step2Val}</div>
        </div>
      );
    }
    if (step1Val !== undefined && step2Val !== undefined) {
      return (
        <div className="protocol-editor-section-field-cell">
          <div className="protocol-editor-section-field-divider" />
          <div className="protocol-editor-section-field-cell-double">
            <ProtocolNumericField
              value={step1Val}
              onChange={step1Change}
              disabled={!enabled}
              error={step1Validation?.isError}
              inlineText={step1Validation?.message}
              step={step}
              changed={step1Changed}
            />
          </div>
          <div className="protocol-editor-section-field-cell-double">
            <ProtocolNumericField
              value={step2Val}
              onChange={step2Change}
              disabled={!enabled}
              error={step2Validation?.isError}
              inlineText={step2Validation?.message}
              step={step}
              changed={step2Changed}
            />
          </div>
        </div>
      );
    }
    return (
      <div className="protocol-editor-section-field-cell">
        <div className="protocol-editor-section-field-divider" />
        <div className="protocol-editor-section-field-cell-double">-</div>
        <div className="protocol-editor-section-field-cell-double">-</div>
      </div>
    );
  };

StepPairField.defaultProps = {
  step: 0.01,
  readOnly: false,
  step1Changed: false,
  step2Changed: false,
};

export default StepPairField;
