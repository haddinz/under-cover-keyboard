import React from 'react';
import ProtocolEditorContext from '../ProtocolEditorContext';
import ThermoCycleSection from '../../../../models/pcrProfile/ThermoCycleSection';
import ProtocolValidatorHelper from '../../protocol/ProtocolValidatorHelper';
import MeltCurveSection from '../../../../models/pcrProfile/MeltCurveSection';
import PcrSection from '../../../../models/pcrProfile/PcrSection';
import HotStartSection from '../../../../models/pcrProfile/HotStartSection';
import PrimerMixingSection from '../../../../models/pcrProfile/PrimerMixingSection';
import StepPairField from './StepPairField';

const MotorVelocityField: React.FC<{ section: PcrSection, onStep1Change: (val: number) => any, onStep2Change: (val: number) => any, readOnly: boolean }>
  = function ({ section, onStep1Change, onStep2Change, readOnly }) {
    let step1Val: number | undefined;
    let step2Val: number | undefined;
    if (section instanceof ThermoCycleSection || section instanceof MeltCurveSection || section instanceof HotStartSection || section instanceof PrimerMixingSection) {
      step1Val = section.step1.motorMovement.velocity;
      step2Val = section.step2.motorMovement.velocity;
    }
    const step1Validation = React.useMemo(() => {
      return readOnly || step1Val === undefined ? null : ProtocolValidatorHelper.isMotorVelocityValid(step1Val);
    }, [step1Val]);
    const step2Validation = React.useMemo(() => {
      return readOnly || step2Val === undefined ? null : ProtocolValidatorHelper.isMotorVelocityValid(step2Val);
    }, [step2Val]);

    // changes detection
    const ctx = React.useContext(ProtocolEditorContext);
    const step1Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step1?.motorMovement?.velocity === undefined ? false : sample.step1.motorMovement.velocity !== step1Val;
    }, [step1Val]);    
    const step2Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step2?.motorMovement?.velocity === undefined ? false : sample.step2.motorMovement.velocity !== step2Val;
    }, [step2Val]);

    return (
      <StepPairField
        enabled={section.enabled}
        step1Val={step1Val}
        step2Val={step2Val}
        step1Change={onStep1Change}
        step2Change={onStep2Change}
        step1Validation={step1Validation}
        step2Validation={step2Validation}
        readOnly={readOnly}
        step1Changed={step1Changed}
        step2Changed={step2Changed}
      />
    );
  };
export default MotorVelocityField;
