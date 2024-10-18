import React from 'react';
import MeltCurveSection from '../../../../models/pcrProfile/MeltCurveSection';
import PcrSection from '../../../../models/pcrProfile/PcrSection';
import ProtocolValidatorHelper from '../../protocol/ProtocolValidatorHelper';
import ProtocolEditorContext from '../ProtocolEditorContext';
import ProtocolNumericField from './ProtocolNumericField';
import { RampRateStep } from '../../../../stores/protocol/protocolTypeEnum';

const RampRateField: React.FC<{ section: PcrSection, onChange: (val: number) => any, readOnly: boolean }>
  = function ({ section, onChange, readOnly }) {
    let rampRate: number | undefined;
    if (section instanceof MeltCurveSection) {
      rampRate = section.rampRate;
    }
    const ctx = React.useContext(ProtocolEditorContext);
    const validation = React.useMemo(() => {
      return readOnly || rampRate === undefined ? null : ProtocolValidatorHelper.isRampRateValid(rampRate);
    }, [rampRate]);
    const changed = React.useMemo(() => {
      const sample = ctx.sampleSections.get(section.type) as any;
      return !sample ? false : sample.rampRate !== rampRate;
    }, [rampRate]);

    if (readOnly) {
      return <div className="text-center">{rampRate}</div>;
    }
    if (rampRate === undefined || validation === null) {
      return <div className="text-center">-</div>;
    }

    return (
      <div className="protocol-editor-section-field-cell">
        <ProtocolNumericField
          value={rampRate}
          onChange={onChange}
          disabled={!section.enabled}
          error={validation.isError}
          inlineText={validation.message}
          changed={changed}
          step={RampRateStep}
        />
      </div>
    );
  };
export default RampRateField;
