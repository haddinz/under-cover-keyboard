import { useInjection } from 'inversify-react';
import React, { useContext, useEffect, useState } from 'react';
import { RunProgressContext } from '../../../../context/contexes';
import ElementHelper from '../../../../helper/ElementHelper';
import CpanelUpdate, { RunStatus, SequenceRunProgress } from '../../../../models/CpanelUpdate';
import CPanelService from '../../../../services/CPanelService';
import UIEventService from '../../../../services/UIEventService';
import ToolTipComponent from '../../../tooltip/ToolTipComponent';
import RunBotton from '../runConfirmation/RunButton';
import './ProgressView.scss';

const VIEW_NAME = 'progress-view';

const ProgressView: React.FC = function ProgressView() {
  const cpanelService = useInjection(CPanelService);
  const eventListener = useInjection(UIEventService);
  const [runId, setRunId] = useState<string | null>(null);
  const [isOverflow, setIsOverflow] = useState(false);
  const [runProgress, setRunProgress] = useState<SequenceRunProgress | null>(null);
  useEffect(() => {
    // did mount
    cpanelService.subscribeCpanelUpdate(VIEW_NAME, onCpanelUpdate);
    eventListener.onResize.add(VIEW_NAME, onResize);
    onResize();
    return () => {
      // will unmount
      cpanelService.unsubscribeCpanelUpdate(VIEW_NAME);
      eventListener.onResize.remove(VIEW_NAME);
    };
  }, []);
  const onCpanelUpdate = (update: CpanelUpdate) => {
    setRunProgress(update.runProgress);
    setRunId(update.runProgress?.identifier ?? null);
    onResize();
  };
  const onResize = () => {
    const view = document.getElementById('run-progress-desc');
    if (!view) {
      return;
    }
    const overflow = ElementHelper.isXOverflow(view);
    setIsOverflow(overflow);
  };
  const innerProgressWidth = runProgress === null ? '0px' : `calc(${runProgress.progress} * 100%)`;
  const isError = runProgress === null ? false : isErrorProgress(runProgress.runStatus);
  const contextVal = { runProgress };
  const CtxProvider = RunProgressContext.Provider;
  return (
    <div className="d-flex run-progress-view">
      <div className="run-progress-bar">
        <CtxProvider value={contextVal}>
          <Tooltip id="run-progress-desc" isOverflow={isOverflow} runId={runId ?? ''} />
        </CtxProvider>
        <div className={`run-progress-bar-container ${isError ? 'run-progress-bar-container-aborted' : ''}`}>
          <div
            className={`run-progress-inner ${isError ? 'run-progress-inner-aborted' : ''}`}
            style={{ width: innerProgressWidth }}
          />
          <h4 className={`step-info ${isError ? 'step-info-aborted' : ''}`}>
            {runProgress?.completed ?? 0} of {runProgress?.totalStep ?? 0} steps
          </h4>
        </div>
      </div>
      <div className="flex-common-x-end ms-2 experiment-control-btn">
        <CtxProvider value={contextVal}>
          <RunBotton />
        </CtxProvider>
      </div>
    </div>
  );
};

const isErrorProgress = (runStatus: RunStatus) => runStatus === RunStatus.Aborted || runStatus === RunStatus.GeneratingAbortedReport || runStatus === RunStatus.FailedToStart;

const getRunProgressDesc = (runId: string, runProgress: SequenceRunProgress | null) => {
  if (runProgress === null) {
    return 'No protocol is running';
  }
  const { message, desc } = runProgress;
  return `Run ID: ${runId} - ${message}${desc && desc.trim() !== '' ? ` | ${desc}` : ''}`;
};

type TooltipProps = { id: string, runId: string, isOverflow: boolean };
const Tooltip: React.FC<TooltipProps> = function Tooltip({ id, runId, isOverflow }) {
  const { runProgress } = useContext(RunProgressContext);
  const runProgressDesc = getRunProgressDesc(runId, runProgress);
  const tooltip = <div className="tooltip-dark run-progress-desc-tooltip px-2 py-2">{runProgressDesc}</div>;
  return (
    <ToolTipComponent
      tooltip={tooltip}
      disabled={!isOverflow}
      position="start"
    >
      <div id={id} className="run-progress-desc no-wrap" style={{ cursor: isOverflow ? 'pointer' : 'auto' }}>
        {runProgressDesc}
      </div>
    </ToolTipComponent>
  );
};

export default ProgressView;
