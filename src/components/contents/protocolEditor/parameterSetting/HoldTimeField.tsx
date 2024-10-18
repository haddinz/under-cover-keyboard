import React from 'react';
import StepPairField from './StepPairField';
import ProtocolValidatorHelper from '../../protocol/ProtocolValidatorHelper';
import ProtocolEditorContext from '../ProtocolEditorContext';
import ThermoCycleSection from '../../../../models/pcrProfile/ThermoCycleSection';
import PcrSection from '../../../../models/pcrProfile/PcrSection';
import MeltCurveSection from '../../../../models/pcrProfile/MeltCurveSection';
import HotStartSection from '../../../../models/pcrProfile/HotStartSection';

const toSecond = (millisecValue: number) => { return millisecValue === 0 ? 0 : millisecValue / 1000; }
const toMilliSecond = (secValue: number) => secValue * 1000;

const HoldTimeField: React.FC<{ section: PcrSection, onStep1Change: (val: number) => any, onStep2Change: (val: number) => any, readOnly: boolean }>
  = function ({ section, onStep1Change, onStep2Change, readOnly }) {
    let step1Val: number | undefined;
    let step2Val: number | undefined;
    if (section instanceof ThermoCycleSection || section instanceof MeltCurveSection || section instanceof HotStartSection) {
      if (section.step1?.holdTime === undefined) {
        step1Val = NaN;
      } else {
        // convert from millisecond to second
        step1Val = toSecond(section.step1.holdTime)
      }
      if (section.step2?.holdTime === undefined) {
        step2Val = NaN;
      } else {
        // convert from millisecond to second
        step2Val = toSecond(section.step2.holdTime);
      }
    }
    const step1Validation = React.useMemo(() => {
      return readOnly || step1Val === undefined ? null : ProtocolValidatorHelper.isHoldtimeValid(step1Val);
    }, [step1Val]);
    const step2Validation = React.useMemo(() => {
      return readOnly || step2Val === undefined ? null : ProtocolValidatorHelper.isHoldtimeValid(step2Val);
    }, [step2Val]);

    // changes detection
    const ctx = React.useContext(ProtocolEditorContext);
    const step1Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step1 === undefined ? false : toSecond(sample.step1.holdTime) !== step1Val;
    }, [step1Val]);
    const step2Changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return readOnly || sample?.step2 === undefined ? false : toSecond(sample.step2.holdTime) !== step2Val;
    }, [step2Val]);

    return (
      <StepPairField
        enabled={section.enabled}
        step1Val={step1Val}
        step2Val={step2Val}
        step1Change={(v) => onStep1Change(toMilliSecond(v))}
        step2Change={(v) => onStep2Change(toMilliSecond(v))}
        step1Validation={step1Validation}
        step2Validation={step2Validation}
        readOnly={readOnly}
        step1Changed={step1Changed}
        step2Changed={step2Changed}
      />
    );
  };

export default HoldTimeField;
