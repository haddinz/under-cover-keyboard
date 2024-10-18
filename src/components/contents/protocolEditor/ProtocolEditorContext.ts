import React from 'react';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import PcrSection from '../../../models/pcrProfile/PcrSection';
import PcrSectionType from '../../../models/pcrProfile/PcrSectionType';

const ProtocolEditorContext = React.createContext({
  defaultModel: {} as ProtocolModel | undefined,
  sampleSections: {} as Map<PcrSectionType, PcrSection>,
});
export default ProtocolEditorContext;
