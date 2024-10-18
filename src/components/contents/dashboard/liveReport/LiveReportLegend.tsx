import React, { useContext } from 'react';
import { LiveReportContext } from '../../../../context/contexes';
import ArrayHelper from '../../../../helper/ArrayHelper';
import { StampedeCheckBox } from '../../../FmlxUi';

const Indexes = {
  FAM: [0, 1, 2, 3, 4],
  ROX: [5, 6, 7, 8, 9],
};

const LiveReportLegend: React.FC = function LiveReportLegend() {
  const { activeSeries, toggleActiveSeries } = useContext(LiveReportContext);
  return (
    <table className="live-report-legend">
      <thead>
        <tr>
          <th>
            <SeriesCheckbox
              labelIndex={Indexes.FAM}
              label="FAM"
              activeIndexes={activeSeries}
              setActive={toggleActiveSeries}
            />
          </th>
          <th>
            <SeriesCheckbox
              labelIndex={Indexes.ROX}
              label="ROX"
              activeIndexes={activeSeries}
              setActive={toggleActiveSeries}
            />
          </th>
        </tr>
      </thead>
      <tbody>
        {Indexes.FAM.map((index) => {
          const labelFam = `FAM ${index}`;
          const labelRox = `ROX ${index}`;
          return (
            <tr key={`legend-${index}`}>
              <td>
                <SeriesCheckbox
                  labelIndex={index}
                  label={labelFam}
                  activeIndexes={activeSeries}
                  setActive={toggleActiveSeries}
                />
              </td>
              <td>
                <SeriesCheckbox
                  labelIndex={index + 5}
                  label={labelRox}
                  activeIndexes={activeSeries}
                  setActive={toggleActiveSeries}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

const SeriesCheckbox: React.FC<{
  labelIndex: number | number[],
  label: string,
  activeIndexes: number[],
  setActive(i: number | number[], active: boolean)
}> = function SeriesCheckbox({ label, labelIndex: index, activeIndexes, setActive }) {
  const active = ArrayHelper.containsAll(activeIndexes, index);
  const onClick = () => setActive(index, !active);
  return (
    <div style={{ width: 'auto' }} className="sensor-chart-legend-btn">
      <StampedeCheckBox
        checked={active}
        onChange={onClick}
      />
      <span className="ps-1">{label}</span>
    </div>
  );
};

export default LiveReportLegend;
