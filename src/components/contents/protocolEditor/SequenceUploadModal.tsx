import React, { useEffect, useState, ChangeEvent } from 'react';
import { useInjection } from 'inversify-react';
import SequenceService from '../../../services/SequenceService';
import DialogService from '../../../services/DialogService';
import LoadingService from '../../../services/LoadingService';
import SequenceFile from '../../../models/SequenceFile';
import { StampedeButton, StampedeCheckBox, StampedeModal } from '../../FmlxUi';
import './SequenceUploadModal.scss';
import FmlxIcon from '../../icon/FmlxIcon';

type footerType = 'RemoveSequences' | 'CloseModal'

const SequenceUploadModal: React.FC<{
  protocol: string,
  newRecord: boolean,
  onCancel(): any,
  setTemporaryFile(files: FileList): any,
  tempSequenceFiles: FileList | undefined,
}> = function SequenceUploadModal({ protocol, onCancel, newRecord, setTemporaryFile, tempSequenceFiles }) {
  const dialog = useInjection(DialogService);
  const service = useInjection(SequenceService);
  const loading = useInjection(LoadingService);
  const [sequences, setSequences] = useState<SequenceFile[]>();
  const [temporarySequences, setTemporarySequences] = useState<SequenceFile[]>();
  const [selectedSequences, setSelectedSequences] = useState<SequenceFile[]>([]);
  const [uploadedSequences, setUploadedSequence] = useState<FileList>();

  const [footerType, setFooterType] = useState<footerType>();
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isShowFooter, setIsShowFooter] = useState<boolean>(false);
  const [isSequenceChecked, setIsSequenceChecked] = useState<boolean>(false);
  const inputFileRef = React.useRef<HTMLInputElement>();
  const formInputFileRef = React.useRef<HTMLFormElement>();

  const showConfirmCloseModal = () => {
    if (isSaved || uploadedSequences === undefined) {
      onCancel();
    } else if (uploadedSequences.length > 0) {
      setFooterType('CloseModal');
      setIsShowFooter(true);
    }
  };

  const onCancelSequenceModal = () => {
    onCancel();
  };

  const showFileDialog = () => {
    if (inputFileRef.current) {
      inputFileRef.current.click();
    }
  };

  const onFileChange = (e: ChangeEvent) => {
    if (sequences === undefined) return;
    const input = e.target as HTMLInputElement;
    if (!input.files) {
      return;
    }
    const selectedFiles: FileList = input.files;

    const newUploadedSequences = [...sequences];

    Array.from(selectedFiles).forEach((file) => {
      if (!newUploadedSequences.find((sequence) => sequence.name === file.name)) {
        const newSequence: SequenceFile = {
          created: file.lastModified.toString(),
          name: file.name,
        };
        newUploadedSequences.push(newSequence);
      }
    });

    setTemporarySequences(newUploadedSequences);
    setUploadedSequence(selectedFiles);
  };

  const confirmDeleteSequences = () => {
    setFooterType('RemoveSequences');
    setIsShowFooter(true);
  };

  const cancelFooter = () => {
    setIsShowFooter(false);
  };

  const downloadSequences = () => {
    if (selectedSequences == null) { return; }

    const sequenceNames = selectedSequences.map((item) => item.name);

    if (newRecord) {
      service.downloadDefaultAll(sequenceNames)
        .catch((ex) => {
          console.error(ex);
          dialog.alertError(ex);
        });
    } else {
      service.downloadAll(protocol, sequenceNames)
        .catch((ex) => {
          console.error(ex);
          dialog.alertError(ex);
        });
    }
  };

  const deleteSequences = () => {
    if (selectedSequences == null) { return; }

    if (newRecord) {
      // TODO: modify alert when sequence is stored as temporary file
      dialog.alertError('Sequence is not found, please save protocol first.');
      return;
    }

    const sequenceNames = selectedSequences.map((item) => item.name);

    service.deleteAll(protocol, sequenceNames)
      .then(() => {
        dialog.alertSuccess('Successfully remove sequences');
        cancelFooter();
        setUploadedSequence(undefined);
        setSelectedSequences([]);
        setIsShowFooter(false);
        setIsSequenceChecked(false);
        init();
      })
      .catch((ex) => {
        console.error(ex);
        dialog.alertError(ex);
      });
  };

  const uploadSequences = () => {
    if (uploadedSequences == null || uploadedSequences.length === 0) { return; }
    if (newRecord) {
      setTemporaryFile(uploadedSequences);

      setIsSaved(true);
      // TODO: modify alert when sequence is stored as temporary file
      dialog.alertInfo('Sequences has been modified. Please save protocol to upload the sequence');
      return;
    }
    service.upload(protocol, uploadedSequences).then(() => {
      dialog.alertSuccess('Successfully upload sequences');
      setUploadedSequence(undefined);
      init();
      setIsSaved(true);
    })
      .catch((ex) => {
        console.error(ex);
        dialog.alertError(ex);
      });
  };

  const switchHeaderChecked = () => {
    if (selectedSequences === undefined) return;
    if (sequences === undefined) return;

    const hasSequenceSelected = selectedSequences.length > 0;

    let newSelectedSequences: SequenceFile[] = [];

    if (!hasSequenceSelected) {
      newSelectedSequences = [...sequences];
      setIsSequenceChecked(true);
    } else {
      setIsSequenceChecked(false);
    }

    setSelectedSequences(newSelectedSequences);
  };

  const switchSequenceChecked = (selectedItem: SequenceFile) => {
    if (selectedSequences === undefined) return;

    const newSelectedSequences = [...selectedSequences];

    const indexOf = newSelectedSequences.indexOf(selectedItem);
    if (indexOf >= 0) {
      newSelectedSequences.splice(indexOf, 1);
    } else {
      newSelectedSequences.push(selectedItem);
      setIsSequenceChecked(true);
    }

    if (newSelectedSequences.length === 0) { setIsSequenceChecked(false); }

    setSelectedSequences(newSelectedSequences);
  };

  const init = async () => {
    loading.start('Load Sequences...');
    try {
      if (newRecord) {
        service.getDefaultSequences().then((result) => {
          if (tempSequenceFiles !== undefined) {
            Array.from(tempSequenceFiles).forEach((file) => {
              if (!result.find((sequence) => sequence.name === file.name)) {
                const newSequence: SequenceFile = {
                  created: '',
                  name: file.name,
                };
                result.push(newSequence);
              }
            });
          }

          setSequences(result);
          setTemporarySequences(result);
        });
      } else {
        service.getSequences(protocol).then((result) => {
          setSequences(result);
          setTemporarySequences(result);
        });
      }
    } catch (ex: any) {
      console.log(ex);
      dialog.alertError(ex);
    }
    loading.stop();
  };

  useEffect(() => {
    init();
    const newSelectedSequences: SequenceFile[] = [];
    setSelectedSequences(newSelectedSequences);
  }, []);

  return (
    <StampedeModal
      title="View Sequence"
      open
      customFooter={<SequenceFooter isShowFooter={isShowFooter} onCancel={cancelFooter} onRemove={deleteSequences} footerType={footerType} onCloseModal={onCancelSequenceModal} />}
      size="xl"
      customHeader={(
        <SequenceModalHeader
          saveSequence={uploadSequences}
          cancel={showConfirmCloseModal}
          uploadSequence={showFileDialog}
          formInputFileRef={formInputFileRef}
          inputFileRef={inputFileRef}
          onFileChange={onFileChange}
          isShowFooter={isShowFooter}
          uploadedSequences={uploadedSequences}
        />
      )}
    >
      <div className="form-modal-cover">
        <div className="instrument-sequence">
          <div className="instrument-sequence-body">
            <div className="instrument-sequence-list">
              {selectedSequences && (
                <div className="toolbar-sequence">
                  <div className="toolbar-sequence-text">
                    <h5>{selectedSequences.length} selected</h5>
                  </div>

                  <div className="toolbar-sequence-button-group">
                    <StampedeButton
                      label="Download"
                      withIcon="start"
                      icon={<FmlxIcon name="Download" fontSize="xs" customColor="#414141" />}
                      variant="outline"
                      type="basic"
                      onClick={downloadSequences}
                      size="sm"
                      disabled={isShowFooter || !isSequenceChecked}
                    />
                    <StampedeButton
                      label="Delete"
                      withIcon="start"
                      icon={<FmlxIcon name="Trash" fontSize="xs" customColor="#DB0000" />}
                      size="sm"
                      variant="outline"
                      type="basic"
                      onClick={confirmDeleteSequences}
                      disabled={isShowFooter || !isSequenceChecked}
                    />
                  </div>

                </div>
              )}
              {temporarySequences &&
            (
              <>
                <SequenceHeader
                  disabled={isShowFooter}
                  selectedSequences={selectedSequences}
                  sequences={temporarySequences}
                  headerChecked={isSequenceChecked}
                  switchHeaderChecked={switchHeaderChecked}
                />
                <div className="instrument-sequence-list-wrapper">
                  <SequenceList
                    disabled={isShowFooter}
                    items={temporarySequences}
                    selectedItems={selectedSequences ?? []}
                    switchSequenceChecked={switchSequenceChecked}
                    uploadedSequences={uploadedSequences}
                  />
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </StampedeModal>
  );
};

const SequenceModalHeader: React.FC<{ uploadSequence(): any, saveSequence(): any, cancel(): any, formInputFileRef: any, onFileChange(e: ChangeEvent): any, inputFileRef: any, isShowFooter: boolean, uploadedSequences: FileList | undefined }> =
  function ({ uploadSequence, saveSequence, cancel, formInputFileRef, onFileChange, inputFileRef, isShowFooter, uploadedSequences }) {
    return (
      <h2 className="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root fmlx-modal-header  css-ohyacs" id="mui-2">
        <div className="header-sequence-modal">
          <div className="title">View Sequence</div>
          <div className="header-button-group">
            <StampedeButton
              label="Upload New Sequence"
              variant="outline"
              type="basic"
              onClick={uploadSequence}
              size="sm"
              disabled={isShowFooter}
            />
            <form className="d-none" ref={formInputFileRef}>
              <input type="file" accept=".yml" multiple onChange={onFileChange} ref={inputFileRef} />
            </form>
            <StampedeButton
              label="Save"
              size="sm"
              onClick={saveSequence}
              disabled={isShowFooter || !(uploadedSequences !== undefined && uploadedSequences.length > 0)}
            />
            <StampedeButton
              onlyIcon
              icon={<FmlxIcon name="CancelOutline" fontSize="md" customColor="#474747" />}
              size="sm"
              variant="outline"
              type="basic"
              onClick={cancel}
            />
          </div>
        </div>
      </h2>
    );
  };

const SequenceHeader: React.FC<{ headerChecked: boolean, sequences: SequenceFile[], selectedSequences: SequenceFile[], switchHeaderChecked(): any, disabled: boolean }> =
  function ({ headerChecked, sequences, selectedSequences, switchHeaderChecked, disabled }) {
    return (
      <table className="table-sequence-list">
        <tbody>
          <tr>
            <td className="table-sequence-checkbox-cell">
              <SequenceCheckBox
                disabled={disabled}
                indeterminate={(sequences.length !== selectedSequences.length) && headerChecked}
                checked={headerChecked}
                onClick={switchHeaderChecked}
              />
            </td>
            <td className="table-sequence-header">
              <b>Select All</b>
            </td>
          </tr>
        </tbody>
      </table>
    );
  };

const SequenceList: React.FC<{
  items: SequenceFile[], selectedItems: SequenceFile[], switchSequenceChecked(sequenceFile: SequenceFile): any, uploadedSequences: FileList | undefined, disabled: boolean
}> = function ({ items, selectedItems, switchSequenceChecked, uploadedSequences, disabled }) {
  return (
    <table className="table-sequence-list">
      {!items ? null : (
        <tbody>
          { items.map((sequence) => {
            const key = `sequence-${sequence.name}`;
            const isSelected = selectedItems.indexOf(sequence) >= 0;
            let isNewFile = false;

            if (uploadedSequences) { isNewFile = Array.from(uploadedSequences).find((file) => file.name === sequence.name) !== undefined; }

            return (
              <SequenceRow
                disabled={disabled}
                isSelected={isSelected}
                key={key}
                item={sequence}
                switchSequenceChecked={switchSequenceChecked}
                isNewFile={isNewFile}
              />
            );
          })}
        </tbody>
      )}
    </table>
  );
};

const SequenceRow: React.FC<{ isSelected: boolean, item: SequenceFile, switchSequenceChecked(sequenceFile: SequenceFile): any, isNewFile: boolean, disabled: boolean }> =
  function ({ isSelected, item, switchSequenceChecked, isNewFile, disabled }) {
    return (
      <tr className={isSelected ? 'table-sequence-row-selected' : ''}>
        <td className="table-sequence-checkbox-cell">
          <SequenceCheckBox
            disabled={disabled}
            indeterminate={false}
            checked={isSelected}
            onClick={() => switchSequenceChecked(item)}
          />
        </td>
        <td>
          <span className="table-sequence-item-name">{item.name} {isNewFile && (<b className="new-file">*</b>) }</span>
        </td>
      </tr>
    );
  };

const SequenceCheckBox: React.FC<{
    checked: boolean,
    indeterminate: boolean,
    onClick: () => any,
    disabled: boolean,
  }> = function SequenceCheckBox({ checked, indeterminate, onClick, disabled }) {
    return (
      <div>
        <span>
          <StampedeCheckBox
            checked={checked}
            indeterminate={indeterminate}
            onChange={onClick}
            disabled={disabled}
          />
        </span>
      </div>
    );
  };

const SequenceFooter: React.FC<{
    isShowFooter: boolean,
    footerType: footerType | undefined,
    onCancel: () => any,
    onRemove: () => any,
    onCloseModal: () => any,
  }> = function SequenceFooter({ isShowFooter, footerType, onCancel, onRemove, onCloseModal }) {
    const display = isShowFooter ? 'footer-sequence' : 'd-none';
    return (
      <div className={display}>
        {footerType === 'RemoveSequences' && (
          <>
            <div className="footer-sequence-text">
          Are you sure you want to delete the sequence file(s)?
            </div>
            <div className="footer-sequence-button-group">
              <StampedeButton
                withIcon="start"
                icon={<FmlxIcon name="CancelOutline" fontSize="md" customColor="#474747" />}
                label="No"
                variant="outline"
                type="basic"
                onClick={onCancel}
                size="sm"
              />
              <StampedeButton
                withIcon="start"
                icon={<FmlxIcon name="CheckOutline" fontSize="md" customColor="#ffffff" />}
                label="Yes"
                size="sm"
                type="danger"
                onClick={onRemove}
              />
            </div>
          </>
        )}
        {footerType === 'CloseModal' && (
          <>
            <div className="footer-sequence-text">
            Are you sure to remove the changes? Sequences needs to be saved first before you close this dialog.
            </div>
            <div className="footer-sequence-button-group">
              <StampedeButton
                withIcon="start"
                icon={<FmlxIcon name="CancelOutline" fontSize="md" customColor="#474747" />}
                label="Cancel"
                variant="outline"
                type="basic"
                onClick={onCancel}
                size="sm"
              />
              <StampedeButton
                withIcon="start"
                icon={<FmlxIcon name="CheckOutline" fontSize="md" customColor="#ffffff" />}
                label="Yes"
                size="sm"
                type="danger"
                onClick={onCloseModal}
              />
            </div>
          </>
        )}

      </div>
    );
  };

export default SequenceUploadModal;
