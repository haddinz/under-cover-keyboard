import { useInjection } from 'inversify-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import CpanelUpdate, { TemperatureProperty } from '../../../../models/CpanelUpdate';
import TemperatureChecking from '../../../../models/TemperatureChecking';
import ConflictError from '../../../../models/errors/ConflictError';
import ProtocolModel from '../../../../models/protocol/ProtocolModel';
import CPanelService from '../../../../services/CPanelService';
import DeviceIndicator from '../../../../services/DeviceIndicator';
import DeviceSettingsService from '../../../../services/DeviceSettingsService';
import DialogService from '../../../../services/DialogService';
import ProtocolService from '../../../../services/ProtocolService';
import RunTestApi from '../../../../services/RunTestApi';
import { StampedeButton } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import './ProtocolConfirmation.scss';

const MAX_ID_LENGTH = 30;
const VIEW_NAME = 'protocol-confirmation-form';

const ProtocolConfirmation: React.FC<{ close(canceled: boolean): any }> = function ProtocolConfirmation({ close }) {
  const [runId, setRunId] = useState('');
  const [activeProtocol, setActiveProtocol] = useState('');
  const [tempLimit, setTempLimit] = useState(new TemperatureChecking());
  const [temp, setTemp] = useState(new TemperatureProperty(0, 0));

  const runApi = useInjection(RunTestApi);
  const protocolSvc = useInjection(ProtocolService);
  const cpanel = useInjection(CPanelService);
  const deviceSetting = useInjection(DeviceSettingsService);
  const dialog = useInjection(DialogService);
  const indicator = useInjection(DeviceIndicator);

  const onLoad = () => {
    document.getElementById('protocol-confirmation-input-id')?.focus();
    protocolSvc.getActiveProtocol()
      .then(activeProtocolLoaded)
      .catch(() => {
        close(false);
        dialog.alertError('Cannot run a test. Make sure there is a protocol active.');
      });
  };
  const activeProtocolLoaded = (resp: ProtocolModel | null) => {
    if (!resp) {
      return;
    }
    setActiveProtocol(resp.name);
    deviceSetting.getTemperatureLimit()
      .then(setTempLimit)
      .catch(dialog.alertError);
    cpanel.subscribeCpanelUpdate(VIEW_NAME, onCPanelUpdate);
    indicator.setReady();
  };
  const onUnLoad = () => {
    cpanel.unsubscribeCpanelUpdate(VIEW_NAME);
  };
  const onCPanelUpdate = (update: CpanelUpdate) => {
    setTemp(update.temperature);
  };
  const onRunIdChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = e.target;
    if (value.length > MAX_ID_LENGTH) {
      return;
    }
    setRunId(value);
  };
  const onKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onConfirm();
    }
  };
  const onConfirm = () => {
    if (runId.trim() === '') {
      return;
    }
    runApi.ensureUniqueId(runId)
      .then(() => handleRunIdCheck(runId, runId))
      .catch((err) => {
        if (err instanceof ConflictError) {
          handleRunIdCheck(runId, err.message);
        } else {
          dialog.alertError(err);
        }
      });
  };
  const handleRunIdCheck = (requestedRunId: string, acceptedRunId: string) => {
    if (requestedRunId !== acceptedRunId) {
      const newRunId = acceptedRunId;
      dialog.showModal('Protocol Confirmation', renameContent(requestedRunId, newRunId), 'RENAME AND GO')
        .then(() => start(newRunId));
    } else {
      start(requestedRunId);
    }
  };
  const start = (id: string) => {
    runApi.directRun(id, activeProtocol)
      .then(() => {
        close(false);
        dialog.alertSuccess(`Protocol with Run ID: ${id} is running!`);
      })
      .catch((e) => {
        dialog.alertError(e);
        close(true);
      });
  };
  const cancel = () => {
    indicator.setIdle();
    close(true);
  };
  const inputExceed = runId.length < MAX_ID_LENGTH;
  const sizeClassName = `protocol-confirmation-input-size ${inputExceed ? '' : 'protocol-confirmation-input-size-exceed'}`;
  const warning = getWarningString(temp, tempLimit);

  useEffect(() => {
    onLoad();
    return () => {
      onUnLoad();
    };
  }, []);

  return (
    <form className="protocol-confirmation" id="protocol-confirmation">
      <p className="common-text-overflow">
        <span className="regular-label no-wrap">Active Protocol:</span>
        <span className="regular-label-bold ms-2">{activeProtocol}</span>
      </p>
      <div className="mb-4">
        <span className="d-block regular-label mb-1">Input RUN ID to start the test with the active protocol.</span>
        <textarea
          id="protocol-confirmation-input-id"
          className="regular-label protocol-confirmation-input-id"
          value={runId}
          onChange={onRunIdChange}
          placeholder="Type here"
          onKeyPress={onKeyPress}
          required
        />
        <div className="flex-common-x-end">
          <span className={sizeClassName}>{runId.length}/{MAX_ID_LENGTH}</span>
        </div>
      </div>
      <div
        className="regular-label protocol-confirmation-warning mb-3"
        style={{ visibility: warning ? 'visible' : 'hidden' }}
      >
        <div className="d-flex">
          <FmlxIcon name="Warning" customColor="rgba(255, 202, 10, 1)" fontSize="lg" />
          <div className="flex-common ms-1">{warning}</div>
        </div>
      </div>
      <div className="protocol-confirmation-footer d-block">
        <div>
          <StampedeButton
            variant="outline"
            label="CANCEL"
            onClick={cancel}
          />
          <StampedeButton
            label="START"
            onClick={onConfirm}
            disabled={!runId || runId.trim() === ''}
          />
        </div>
      </div>
    </form>
  );
};

const getWarningString = (temp: TemperatureProperty<number>, tempLimit: TemperatureChecking) => {
  const warnings: string[] = [];
  const pcr1Warning = TemperatureChecking.getWarningString('PCR1', temp.pcr1, tempLimit.pcr1);
  const pcr2Warning = TemperatureChecking.getWarningString('PCR2', temp.pcr2, tempLimit.pcr2);
  if (pcr1Warning) {
    warnings.push(pcr1Warning);
  }
  if (pcr2Warning) {
    warnings.push(pcr2Warning);
  }
  if (warnings.length === 0) {
    return null;
  }
  return `Temperature for ${warnings.join(' & ')}`;
};

const renameContent = (runId: string, replacement: string) => {
  return (
    <>
      <p className="regular-label pb-2">
        RUN ID: {runId} is used in previous test.
      </p>
      <p className="regular-label">
        Do you want to rename into {replacement} and continue to run?
      </p>
    </>
  );
};

export default ProtocolConfirmation;
