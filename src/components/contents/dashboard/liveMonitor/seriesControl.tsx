import { useInjection } from 'inversify-react';
import React from 'react';
import config from '../../../../config';
import { invokeLater } from '../../../../helper/EventHelper';
import LiveMonitorSeries from '../../../../models/sensorChart/LiveMonitorSeries';
import DialogService from '../../../../services/DialogService';
import { StampedeButton, StampedeCheckBox, StampedeTextBox } from '../../../FmlxUi';
import FmlxIcon from '../../../icon/FmlxIcon';
import ChartYScaleBtn from './ChartYScaleBtn';

const COLOR_CHECKED = '#006AF5';
const COLOR_WHITE = '#ffffff';

const SeriesCheckbox: React.FC<{
  partIndex: number,
  labelIndex: number,
  label: string,
  activeIndexes: number[],
  colors: string[],
  setActive(i: number, active: boolean)
}> = function SeriesCheckbox({ partIndex, label, labelIndex, activeIndexes, colors, setActive }) {
  const serieIndex = partIndex * 5 + labelIndex;
  const active = activeIndexes.indexOf(serieIndex) >= 0;
  const color = colors[serieIndex];
  const onClick = (e: React.ChangeEvent<HTMLInputElement>) => {
    setActive(serieIndex, e.target.checked);
  }
  return (
    <div className="sensor-chart-legend-item">
      <StampedeCheckBox id={`series_control_${serieIndex}`} onChange={onClick} checked={active} size="sm" />
      <label htmlFor={`series_control_${serieIndex}`} style={{ color }}>{label}</label>
    </div>
  );
};

export const SeriesControl: React.FC<{
  active: any[],
  labels: any[],
  colors: string[],
  setActive: (index: number, active: boolean) => any,
}> = function SeriesControl({ active, labels, colors, setActive }) {
  const partials = [labels.slice(0, 5), labels.slice(5)];
  return (
    <>
      {
        partials.map((partialLabel, partIndex) => {
          return (
            <div key={`partialLabel_${partialLabel.join('-')}`} className="sensor-chart-legend text-center">
              {partialLabel.map((label, i) => {
                return (
                  <SeriesCheckbox
                    key={`series_check_${label}`}
                    label={label}
                    partIndex={partIndex}
                    labelIndex={i}
                    colors={colors}
                    setActive={setActive}
                    activeIndexes={active}
                  />
                );
              })}
            </div>
          );
        })
      }
    </>
  );
};

export const InputMaxYAxis: React.FC<{ onSubmit(val: number | undefined), data: LiveMonitorSeries[] }> = function InputMaxYAxisV2({ onSubmit, data }) {
  const dialog = useInjection(DialogService);
  const [value, setValue] = React.useState(config.SETTING.DEFAULT_MAX_CHART_Y_AXIS.toString());
  const submit = () => {
    const num = parseFloat(value);
    if (isNaN(num) || num < 0) {
      dialog.alertError('Please enter a valid number');
      return;
    }
    onSubmit(num);
  };
  const onChange = (arg: { value: string }) => {
    setValue(arg.value);
  };
  const detectMaxYAxis = () => {
    const max = getLiveMonMaxValue(data);
    setValue(max.toFixed(2));
    onSubmit(max);
    invokeLater(() => dialog.alertInfo(`Set max y axis around ${max.toFixed(2)}`), 100);
  };
  const alwaysAutoScaleY = () => {
    onSubmit(undefined);
    invokeLater(() => dialog.alertInfo('Always autoscale y axis'), 100);
  };
  return (
    <form onSubmit={(e) => e.preventDefault()} className="row pt-2 ms-1">
      <div className="col-6">
        <div className="flex-common-x-end">
          <span className="yaxis-option-label no-wrap me-3">YAxis Option</span>
          <StampedeTextBox mode="number" value={value} inlineText="Max Y Point" onChange={onChange} />
        </div>
      </div>
      <div className="col-6">
        <div className="flex-common-x-end">
          <div className="me-2">
            <StampedeButton
              label="APPLY"
              mode="button"
              onClick={submit}
            />
          </div>
          <ChartYScaleBtn onClick={detectMaxYAxis} onDoubleClick={alwaysAutoScaleY} />
        </div>
      </div>
    </form>
  );
};
const getLiveMonMaxValue = (data: LiveMonitorSeries[]) => {
  let max = 0;
  data.forEach((d) => {
    const maxItem = Math.max(...d.values);
    if (maxItem > max) {
      max = maxItem;
    }
  });
  return 1.12 * max;
};
