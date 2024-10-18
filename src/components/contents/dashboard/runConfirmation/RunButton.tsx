import { useInjection } from 'inversify-react';
import React, { useContext } from 'react';
import { RunProgressContext } from '../../../../context/contexes';
import NotifTypeEnum from '../../../../enums/NotifTypeEnum';
import DialogService from '../../../../services/DialogService';
import LoadingService from '../../../../services/LoadingService';
import ProtocolService from '../../../../services/ProtocolService';
import RunTestApi from '../../../../services/RunTestApi';
import { StampedeButton } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import ProtocolConfirmation from './ProtocolConfirmation';
import DeviceIndicator from '../../../../services/DeviceIndicator';
import { RunStatus } from '../../../../models/CpanelUpdate';

const RunBotton: React.FC = function RunBotton() {
  const dialog = useInjection(DialogService);
  const service = useInjection(RunTestApi);
  const loading = useInjection(LoadingService);
  const pcrProfileSvc = useInjection(ProtocolService);
  const indicator = useInjection(DeviceIndicator);

  const { runProgress } = useContext(RunProgressContext);
  const isRunning = runProgress?.runStatus === RunStatus.Running ?? false;
  const onClick = () => {
    service.checkAvailability()
      .then(startProtocol)
      .catch(dialog.alertError);
  };
  const onProtocolConfirmationCanceled = () => indicator.setIdle();
  const startProtocol = () => {
    pcrProfileSvc.getActiveProtocol()
      .then(() => {
        dialog.showModalNoFooter(
          'Protocol Confirmation',
          <ProtocolConfirmation close={close} />,
          onProtocolConfirmationCanceled,
        );
      })
      .catch(() => dialog.alertError('Cannot run a test. Make sure there is a profile active.'));
  };
  const close = (canceled: boolean) => {
    dialog.hideModal();
    if (canceled) {
      indicator.setIdle();
    }
  };
  const abortConfirm = () => {
    dialog.showModal('Abort Protocol', getAbortContent(), 'YES, ABORT', 'md', NotifTypeEnum.Error)
      .then(abortProtocol);
  };
  const abortProtocol = () => {
    if (!runProgress) {
      return;
    }
    loading.start('Aborting protocols...');
    service.abortSequence(runProgress.identifier)
      .then((resp) => dialog.alertError(resp))
      .catch(dialog.alertError)
      .finally(loading.stop);
  };
  return isRunning ?
    (
      <StampedeButton
        icon={<FmlxIcon name="Stop" />}
        withIcon="start"
        label=" ABORT "
        type="danger"
        size="lg"
        onClick={abortConfirm}
      />
    ) :
    (
      <StampedeButton
        icon={<FmlxIcon name="Run" />}
        withIcon="start"
        label="RUN TEST"
        type="positive"
        size="lg"
        onClick={onClick}
      />
    );
};

const getAbortContent = () => {
  return (
    <div>
      <p className="regular-label pb-2">Aborting protocol will cancel the current execution</p>
      <p className="regular-label">Are you sure to abort the protocol?</p>
    </div>
  );
};

export default RunBotton;
