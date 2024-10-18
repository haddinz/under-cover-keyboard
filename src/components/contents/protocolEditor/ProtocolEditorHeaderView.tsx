import React from 'react';
import { StampedeButton } from '../../FmlxUi';

const ProtocolEditorHeaderView: React.FC<{ onSaveClick(): any }> = function ({ onSaveClick }) {
  return (
    <div>
      <StampedeButton label="SAVE" onClick={onSaveClick} />
    </div>
  );
};
export default ProtocolEditorHeaderView;
