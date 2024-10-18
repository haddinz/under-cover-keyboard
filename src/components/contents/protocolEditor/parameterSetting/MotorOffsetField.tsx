import React from 'react';
import PcrSection from '../../../../models/pcrProfile/PcrSection';
import MeltCurveSection from '../../../../models/pcrProfile/MeltCurveSection';
import ThermoCycleSection from '../../../../models/pcrProfile/ThermoCycleSection';
import HotStartSection from '../../../../models/pcrProfile/HotStartSection';
import PrimerMixingSection from '../../../../models/pcrProfile/PrimerMixingSection';
import ProtocolValidatorHelper from '../../protocol/ProtocolValidatorHelper';
import ProtocolEditorContext from '../ProtocolEditorContext';
import StepPairField from './StepPairField';

const MotorOffsetField: React.FC<{
  section: PcrSection,
  onStep1Change: (val: number) => any,
  onStep2Change: (val: number) => any,
  readOnly: boolean,
}> = function ({ section, onStep1Change, onStep2Change, readOnly }) {
    let step1Val: number | undefined;
    let step2Val: number | undefined;
    if (section instanceof ThermoCycleSection || section instanceof MeltCurveSection || section instanceof HotStartSection || section instanceof PrimerMixingSection) {
      step1Val = section.step1?.motorMovement?.offset;
      step2Val = section.step2?.motorMovement?.offset;
    }
    const step1Validation = React.useMemo(() => {
      return readOnly || step1Val === undefined ? null : ProtocolValidatorHelper.isMotorOffsetValid(step1Val);
    }, [step1Val]);
    const step2Validation = React.useMemo(() => {
      return readOnly || step2Val === undefined ? null : ProtocolValidatorHelper.isMotorOffsetValid(step2Val);
    }, [step2Val]);

    // changes detection
    const ctx = React.useContext(ProtocolEditorContext);
    const step1Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step1?.motorMovement === undefined ? false : sample.step1.motorMovement.offset !== step1Val;
    }, [step1Val]);
    const step2Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step2?.motorMovement === undefined ? false : sample.step2.motorMovement.offset !== step2Val;
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
export default MotorOffsetField;
