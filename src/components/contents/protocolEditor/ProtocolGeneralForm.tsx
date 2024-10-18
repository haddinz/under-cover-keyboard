import React from 'react';
import { FmlxIcon } from 'fmlx-common-ui';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import { StampedeButton, StampedeTextBox } from '../../FmlxUi';

const ProtocolGeneralInfoForm: React.FC<{ model: ProtocolModel, onFieldChange(path: keyof ProtocolModel, val: any): any, onUploadSequence() } > =
  function ({ model, onFieldChange, onUploadSequence }) {
    return (
      <div className="row">
        <div className="d-flex col-md-6">
          <div className="protocol-editor-label-left protocol-editor-label flex-common-x-start">
            <span>Assay Type</span>
          </div>
          <div className="protocol-editor-field-value flex-common-x-start">
            <span>
              {model.assayType === 'Tuberculosis' ? 'Default' : ''}
            </span>
          </div>
        </div>
        <div className="d-flex col-md-6">
          <div className="protocol-editor-label-right protocol-editor-label flex-common-x-start">
            <span>Note</span>
          </div>
          <StampedeTextBox
            value={model.note}
            placeholder="Write note here..."
            onChange={(arg) => onFieldChange('note', arg.value)}
            variant="outline"
            size="md"
          />
        </div>
        <div className="d-flex col-md-6">
          <div className="protocol-editor-label protocol-editor-label-left flex-common-x-start">
            <span>Sequence File</span>
          </div>
          <div className="protocol-editor-field-value flex-common-x-start">
            <StampedeButton label="Upload Sequence" variant="contain" type="basic" onClick={onUploadSequence} withIcon="start" icon={<FmlxIcon name="Eye" />} />
          </div>
        </div>
      </div>
    );
  };

export default ProtocolGeneralInfoForm;
