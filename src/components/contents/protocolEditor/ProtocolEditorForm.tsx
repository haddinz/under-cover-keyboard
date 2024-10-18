import React from 'react';
import { setObjectValue } from '../../../helper/ObjectHelper';
import PcrProfileField from '../../../models/pcrProfile/PcrProfileFields';
import PcrSection from '../../../models/pcrProfile/PcrSection';
import PcrSectionKey from '../../../models/pcrProfile/PcrSectionKey';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import './ProtocolEditor.scss';
import ProtocolGeneralInfoForm from './ProtocolGeneralForm';
import ProtocolParameterForm from './ProtocolParameterForm';
import SequenceUploadModal from './SequenceUploadModal';

type State = {
  model: ProtocolModel,
  openSequence: boolean
};
type Props = {
  model: ProtocolModel,
  defaultModel: ProtocolModel | undefined,
  newRecord: boolean,
  onModelUpdated(model: ProtocolModel): any,
  setTemporarySequencesFile(files?: FileList): any,
  tempSequenceFiles: FileList | undefined,
};

export default class ProtocolEditorForm extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      model: this.props.model,
      openSequence: false,
    };
  }
  onSectionFieldChange = (key: PcrSectionKey, path: PcrProfileField, val: any) => {
    const { model } = this.state;
    const section = model.sections.get(key);
    if (!section) {
      return;
    }
    if (val === undefined || val === null || val === '') {
      val = 0;
    }
    if (typeof val !== 'number' && typeof val !== 'boolean') {
      val = parseFloat(val);
    }
    setObjectValue(section, path, val);
    this.setState({ model }, this.props.onModelUpdated(model));
  }
  onFieldChange = (path: keyof ProtocolModel, val: any) => {
    const { model } = this.state;
    setObjectValue(model, path, val);
    this.setState({ model }, this.props.onModelUpdated(model));
  }
  onUploadSequence = () => {
    this.setState({ openSequence: true });
  }
  onUploadCancel = () => {
    this.setState({ openSequence: false });
  }
  addProtocolSection = (s: PcrSection) => {
    const { model } = this.state;
    model.copySection(s);
    this.setState({ model }, this.props.onModelUpdated(model));
  }
  removeProtocolSection = (s: PcrSection) => {
    const { model } = this.state;
    model.removeSection(s);
    this.setState({ model }, this.props.onModelUpdated(model));
  }
  moveProtocolSection = (s: PcrSection, right: boolean) => {
    const { model } = this.state;
    model.moveSection(s, right);
    this.setState({ model }, this.props.onModelUpdated(model));
  }
  render() {
    const { model, openSequence } = this.state;
    const { newRecord } = this.props;
    return (
      <>
        {openSequence && (
          <SequenceUploadModal
            protocol={model.name}
            newRecord={newRecord}
            onCancel={this.onUploadCancel}
            setTemporaryFile={this.props.setTemporarySequencesFile}
            tempSequenceFiles={this.props.tempSequenceFiles}
          />
        )}
        <div className="container-fluid">
          <ProtocolGeneralInfoForm
            model={model}
            onFieldChange={this.onFieldChange}
            onUploadSequence={this.onUploadSequence}
          />
          <ProtocolParameterForm
            className="mt-5"
            defaultModel={this.props.defaultModel}
            model={model}
            sectionFieldChange={this.onSectionFieldChange}
            addSection={this.addProtocolSection}
            removeSection={this.removeProtocolSection}
            moveSection={this.moveProtocolSection}
          />
        </div>
      </>
    );
  }
}
