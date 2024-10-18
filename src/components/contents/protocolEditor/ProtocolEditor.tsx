import { FmlxButton } from 'fmlx-common-ui';
import { resolve } from 'inversify-react';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { SectionEnum } from '../../../enums/SectionEnum';
import IState from '../../../interfaces/IState';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import ProtocolService from '../../../services/ProtocolService';
import appStateAction from '../../../stores/app/appStateAction';
import protocolStateAction from '../../../stores/protocol/protocolStateAction';
import { StampedeModal, StampedeTextBox, StampedeTooltip } from '../../FmlxUi';
import BaseContent from '../../base/BaseContent';
import ProtocolEditorForm from '../protocolEditor/ProtocolEditorForm';
import ProtocolEditorHeaderView from './ProtocolEditorHeaderView';

type State = {
  model?: ProtocolModel,
  newRecord: boolean,
  showLeaveConfirm: boolean,
  defaultModel?: ProtocolModel,
  tempSequenceFiles?: FileList,
}

class ProtocolEditor extends BaseContent<any, State> {
  @resolve(ProtocolService)
  private service: ProtocolService;
  private editProtocolName?: string;
  private tempModel?: ProtocolModel;
  
  private leavePageConfirmCallback?: (confirm: boolean) => any;

  constructor(props) {
    super(props);
    this.state = {
      model: undefined,
      defaultModel: undefined,
      newRecord: true,
      showLeaveConfirm: false,
      tempSequenceFiles: undefined,
    };
  }
  componentDidMount() {
    const selectedName = this.props.editProtocolName;
    const isEditForm = selectedName !== null && selectedName !== undefined;
    if (isEditForm) {
      this.editProtocolName = selectedName;
      this.loadItem(selectedName);
      this.props.setEditProtocolName(undefined);
    } else {
      this.loadItem();
    }
  }
  componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.navigationAttempt && !this.state.showLeaveConfirm) {
      this.handleNavigationAttempt(this.props.navigationAttempt);
    }
  }
  get section(): any { return SectionEnum.ProtocolSetting; }
  get headerContent(): any { return <ProtocolEditorHeaderView onSaveClick={this.save} />; }
  get footerContent(): any { return null; }

  handleNavigationAttempt = (attempt: { from: SectionEnum, to: SectionEnum }) => {
    if (attempt.from === SectionEnum.ProtocolSetting && attempt.to !== SectionEnum.ProtocolSetting) {
      const hasChanges = this.hasChanges();
      if (!hasChanges) {
        this.props.setNavigationConfirmation(Promise.resolve(true));
        return;
      }
      const confirmTask = new Promise<boolean>((confirm, _) => {
        this.leavePageConfirmCallback = confirm;
      });
      confirmTask.then(() => {
        this.leavePageConfirmCallback = undefined;
      });
      this.props.setNavigationConfirmation(confirmTask);

      this.setState({ showLeaveConfirm: true });
    }
  }
  dismissPageLeave = () => {
    this.setState({ showLeaveConfirm: false }, () => {
      if (this.leavePageConfirmCallback) {
        this.leavePageConfirmCallback(false);
      }
    });
  }
  confirmPageLeave = () => {
    this.setState({ showLeaveConfirm: false }, () => {
      if (this.leavePageConfirmCallback) {
        this.leavePageConfirmCallback(true);
      }
    });
  }
  setTemporarySequenceFiles = (tempSequenceFiles?: FileList) => {
    this.setState({ tempSequenceFiles });
  }
  save = () => {
    const { newRecord, model, tempSequenceFiles } = this.state;
    if (!model) {
      return;
    }
    if (!model.isValid()) {
      this.dialog.alertError('Protocol parameter is not valid!');
      return;
    }
    if (model.getEnabledSectionsCount() <= 0) {
      this.dialog.alertError('Make sure there is at least 1 active step');
      return;
    }
    if (newRecord) {
      this.service.create(model, tempSequenceFiles)
        .then(() => {
          this.dialog.alertSuccess('Created successfully');
          this.editProtocolName = model.name;
          this.tempModel = model.toPlainJson();
          this.setState({ newRecord: false, tempSequenceFiles: undefined });
        })
        .catch(this.dialog.alertError);
    } else if (this.editProtocolName) {
      this.service.update(this.editProtocolName, model)
        .then(() => {
          this.dialog.alertSuccess('Updated successfully');
          this.editProtocolName = model.name;
          this.tempModel = model.toPlainJson();
          this.setState({ newRecord: false, tempSequenceFiles: undefined });
        })
        .catch(this.dialog.alertError);
    }
  }
  loadItem = (name?: string) => {
    if (name) {
      this.loadDefault();
      this.service.read(name)
        .then((model) => this.handleModelLoaded(model, false))
        .catch(this.dialog.alertError);
    } else {
      this.service.getDefault()
        .then((model) => {
          this.handleModelLoaded(model, true);
          this.handleDefaultModelLoaded(ProtocolModel.fromJson(model.toPlainJson()));
        })
        .catch(this.dialog.alertError);
    }
  }
  loadDefault = () => {
    this.service.getDefault()
        .then((model) => this.handleDefaultModelLoaded(model))
        .catch(this.dialog.alertError);
  }
  hasChanges = () => {
    const { model, tempSequenceFiles } = this.state;
    if (!this.tempModel || !model) {
      return false;
    }
    const hasTempSequenceFiles = tempSequenceFiles && tempSequenceFiles.length > 0;
    if (hasTempSequenceFiles) {
      return true;
    }
    // TODO: improve comparison
    const contentChanged = JSON.stringify(this.tempModel) !== JSON.stringify(model.toPlainJson());
    return contentChanged;
  }
  handleModelLoaded = (model: ProtocolModel, newRecord: boolean) => {
    this.tempModel = model.toPlainJson();
    this.setState({ newRecord, model });
  }
  handleDefaultModelLoaded = (defaultModel: ProtocolModel) => {
    this.setState({ defaultModel });
  }
  onModelUpdated = (model: ProtocolModel) => {
    this.setState({ model });
  }
  onTitleChange = (val: string) => {
    const { model } = this.state;
    if (!model) {
      return;
    }
    model.name = val;
    this.setState({ model });
  }
   
  render() {
    const Container = this.commonTemplate;
    const { model, showLeaveConfirm, defaultModel, newRecord } = this.state;
    return (
      <>
        <LeaveConfirm
          show={showLeaveConfirm}
          cancelLeave={this.dismissPageLeave}
          commitLeave={this.confirmPageLeave}
          model={model}
        />
        <Container customHeaderTitle={<HeaderTitle model={model} onTitleChange={this.onTitleChange} />}>
          {model && defaultModel && (
            <ProtocolEditorForm
              model={model}
              newRecord={newRecord}
              defaultModel={defaultModel}
              onModelUpdated={this.onModelUpdated}
              setTemporarySequencesFile={this.setTemporarySequenceFiles}
              tempSequenceFiles={this.state.tempSequenceFiles}
            />
          )}
        </Container>
      </>
    );
  }
}

const LeaveConfirm: React.FC<{ model: ProtocolModel | undefined, show: boolean, cancelLeave(): any, commitLeave(): any }>
= function ({ model, show, commitLeave, cancelLeave }) {
  return (
    <StampedeModal
      title="Warning"
      primaryButton={{
        label: 'CANCEL',
        show: true,
        type: FmlxButton.Type.PRIMARY,
        variant: FmlxButton.Variant.CONTAIN,
        onClick: cancelLeave,
        disabled: false,
      }}
      secondaryButton={{
        label: 'YES, REMOVE',
        show: true,
        type: FmlxButton.Type.BASIC,
        variant: FmlxButton.Variant.OUTLINE,
        onClick: commitLeave,
        disabled: false,
      }}
      onCloseClick={cancelLeave}
      open={show}
    >
      <div className="mb-4">
        Are you sure to remove the changes in {model?.name ?? 'Protocol'} ? Protocol needs to be saved first before you move to another page
      </div>
    </StampedeModal>
  );
};

const HeaderTitle: React.FC<{ model?: ProtocolModel, onTitleChange(val: string): any }> = function ({ model, onTitleChange }) {
  const [editMode, setEditMode] = useState(false);
  if (!model) {
    return null;
  }
  const onLabelClick = () => {
    setEditMode(true);
  };
  if (editMode) {
    return (
      <ProtocolTitleEditor
        value={model.name}
        onChange={onTitleChange}
        onBlur={() => setEditMode(false)}
      />
    );
  }
  return (
    <StampedeTooltip title="Rename this protocol">
      <div className="pos-relative" onClick={onLabelClick}>{model.name}</div>
    </StampedeTooltip>
  );
};

HeaderTitle.defaultProps = {
  model: undefined,
};

const ProtocolTitleEditor: React.FC<{
  value: string,
  onChange(val: string): any,
  onBlur(): any,
}> = function ({ value, onChange, onBlur }) {
  const id = 'protocol-title-editor-input';
  const originalValue = React.useMemo(() => value, []);
  const isError = React.useMemo(() => !value || value.trim() === '', [value]);
  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onChange(originalValue);
    }
  };
  React.useEffect(() => {
    const input = document.getElementById(id);
    if (input) {
      input.focus();
      input.addEventListener('keyup', handleKeyUp);
    }
    return () => {
      if (input) {
        input.removeEventListener('keyup', handleKeyUp);
      }
    }
  }, []);
  return (
    <div id="protocol-editor-title">
      <StampedeTextBox
        id={id}
        variant="standard"
        value={value}
        onChange={(arg: { value: any }) => onChange(arg.value)}
        error={isError}
        size="md"
        onBlur={onBlur}
      />
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setEditProtocolName: (name?: string) => {
      dispatch(protocolStateAction.setEditProtocolName(name));
    },
    setNavigationConfirmation: (confirm: Promise<boolean>) => {
      dispatch(appStateAction.setNavigationConfirmation(confirm));
    },
  };
};

const mapStateToProps = (state: IState) => {
  return {
    editProtocolName: state.protocolState.editProtocolName,
    navigationAttempt: state.appState.navigationAttempt,
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ProtocolEditor);
