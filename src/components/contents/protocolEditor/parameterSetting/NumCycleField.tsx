import React from 'react';
import ProtocolNumericField from './ProtocolNumericField';
import ExtractionSection from '../../../../models/pcrProfile/ExtractionSection';
import ProtocolEditorContext from '../ProtocolEditorContext';
import ProtocolValidatorHelper from '../../protocol/ProtocolValidatorHelper';
import PcrSection from '../../../../models/pcrProfile/PcrSection';

const NumCycleField: React.FC<{ section: PcrSection, onChange: (val: number) => any, readOnly: boolean }>
= function ({ section, onChange, readOnly }) {
  const validation = React.useMemo(() => {
    return ProtocolValidatorHelper.isNumCycleValid(section.numberOfCycle);
  }, [section.numberOfCycle]);

  // changes detection
  const ctx = React.useContext(ProtocolEditorContext);
  const changed = React.useMemo(() => {
    const sample = ctx.sampleSections.get(section.type);
    return !readOnly && sample ? sample.numberOfCycle !== section.numberOfCycle : false;
  }, [section.numberOfCycle]);

  if (readOnly) {
    return <div className="text-center">{section.numberOfCycle}</div>;
  }
  if (section instanceof ExtractionSection) {
    return <div className="text-center">-</div>;
  }
  return (
    <div>
      <ProtocolNumericField
        value={section.numberOfCycle}
        onChange={(v) => onChange(parseFloat(v.toFixed(0)))}
        disabled={!section.enabled}
        error={validation.isError}
        inlineText={validation.message}
        precision={0}
        step={1}
        changed={changed}
      />
    </div>
  );
};

export default NumCycleField;
