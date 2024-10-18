import React from 'react';
import { resolve } from 'inversify-react';
import ArrayHelper from '../../../../helper/ArrayHelper';
import SensorChartHelper from '../../../../helper/SensorChartHelper';
import { StampedeButton, StampedeCheckBox } from '../../../FmlxUi';
import ExplorerSortBtn from '../../explorer/ExplorerSortBtn';
import AnalyticalDetaiItem from './AnalyticalDetailItem';
import AnalyticCapture from './helper/AnalyticCapture';
import ReportModel from './../../../../postProcess/ReportModel';
import CustomEventHandler from '../../../../helper/CustomEventHandler';
import ChannelType from '../../../../enums/ChannelType';
import UIEventService from '../../../../services/UIEventService';
import FmlxIcon from '../../../icon/FmlxIcon';

const CH_INDEXES = {};
CH_INDEXES[ChannelType.FAM] = [0, 1, 2, 3, 4];
CH_INDEXES[ChannelType.ROX] = [5, 6, 7, 8, 9];

const BLUE = 'rgba(0, 106, 245, 1)';
const allSeries = ArrayHelper.create(0, 10, (i) => i);
const VIEW_NAME = 'analytical-detail-table';

const Circle: React.FC<{ backgroundColor: string }> = function Circle({ backgroundColor }) {
  return <div style={{ width: 20, height: 20, borderRadius: 10, backgroundColor }} />;
};

type Props = {
  activeSeries: number[];
  reportModel: ReportModel;
  toggleSeries(active: boolean, ...series: number[]): any;
  onResetHandler: CustomEventHandler<null>;
  items: AnalyticalDetaiItem[];
}
type State = {
  orderKey: keyof AnalyticalDetaiItem,
  orderDesc: boolean,
  chSelectionOpen: boolean,
  displayedDyes: ChannelType[],
}

export default class AnalyticalReportDetail extends React.Component<Props, State> {
  private readonly chSelectRef = React.createRef<HTMLDivElement>();
  @resolve(UIEventService)
  private uiEvent: UIEventService;
  constructor(props) {
    super(props);
    this.state = {
      orderKey: 'index',
      orderDesc: false,
      chSelectionOpen: false,
      displayedDyes: this.defaultDisplayedDyes,
    };
  }
  componentDidMount() {
    this.props.onResetHandler.add(VIEW_NAME, this.reset);
    this.uiEvent.onDocumentClick.add(VIEW_NAME, this.onDocClick);
  }
  componentWillUnmount() {
    this.props.onResetHandler.remove(VIEW_NAME);
    this.uiEvent.onDocumentClick.remove(VIEW_NAME);
  }
  private get defaultDisplayedDyes() { return [ChannelType.FAM, ChannelType.ROX]; }
  private get itemsFiltered() {
    const { items } = this.props;
    const { orderKey, orderDesc } = this.state;
    if (orderKey.trim() === '') {
      return items;
    }
    const sorted = [...items];
    if (orderDesc) {
      sorted.sort((a: any, b: any) => { return b[orderKey] < a[orderKey] ? -1 : 1; });
    } else {
      sorted.sort((a: any, b: any) => { return a[orderKey] < b[orderKey] ? -1 : 1; });
    }
    return sorted.filter((i) => this.isDyesActive(i.channelType));
  }
  onDocClick = (e: MouseEvent) => {
    if (!this.chSelectRef.current || !(e.target instanceof HTMLElement)) {
      return;
    }
    if (!this.chSelectRef.current.contains(e.target)) {
      this.setState({ chSelectionOpen: false });
    }
  }
  reset = () => {
    this.setState({ orderKey: 'index' }, () => this.toggleAllSeries(true));
  }
  downloadData = () => {
    AnalyticCapture.exportDetailCsv(this.props.items, `Analytic-Detail-${this.props.reportModel.identifier}.csv`);
  }
  toggleAllSeries = (enable: boolean) => {
    const execToggling = () => this.props.toggleSeries(enable, ...allSeries);
    if (enable) {
      this.setState({ displayedDyes: this.defaultDisplayedDyes }, execToggling);
    } else {
      execToggling();
    }
  }
  applyOrder = (orderKey: keyof AnalyticalDetaiItem, orderDesc: boolean) => {
    this.setState({ orderKey, orderDesc });
  }
  showDetailRow = (ch: ChannelType, show: boolean) => {
    const { displayedDyes } = this.state;
    const indexOf = displayedDyes.indexOf(ch);
    if (show) {
      if (indexOf < 0) {
        displayedDyes.push(ch);
      }
    } else if (indexOf >= 0) {
      displayedDyes.splice(indexOf, 1);
    }
    const indexes = CH_INDEXES[ch] as number[];
    this.props.toggleSeries(show, ...indexes);
    this.setState({ displayedDyes });
  }
  isDyesActive = (...types: ChannelType[]) => {
    return ArrayHelper.containsAll(this.state.displayedDyes, types);
  }
  toggleChSelection = () => {
    const { chSelectionOpen } = this.state;
    this.setState({ chSelectionOpen: !chSelectionOpen });
  }
  render() {
    const { activeSeries } = this.props;
    const { orderKey, orderDesc, chSelectionOpen } = this.state;
    const items = this.itemsFiltered;
    const displayedRow = {
      Fam: this.isDyesActive(ChannelType.FAM),
      Rox: this.isDyesActive(ChannelType.ROX),
    };
    const displayedSeries = {
      Fam: ArrayHelper.containsAll(activeSeries, CH_INDEXES[ChannelType.FAM]),
      Rox: ArrayHelper.containsAll(activeSeries, CH_INDEXES[ChannelType.ROX]),
    };
    const allChecked = displayedRow.Fam && displayedRow.Rox && displayedSeries.Fam && displayedSeries.Rox;
    const cellClass = 'analytical-report-detail-table-cell';
    return (
      <div className="analytical-report-detail px-3">
        <div className="w-100 mt-2 mb-3 flex-common-x-start ">
          <div className="analytical-report-detail-title">Data Table</div>
          <div className="w-100 flex-common-x-end">
            <button type="button" onClick={this.downloadData} className="analytical-report-common-buttons">
              DOWNLOAD DATA TABLE
            </button>
          </div>
        </div>
        <div className="analytical-report-detail-header">
          <table className="analytical-report-detail-table">
            <thead>
              <tr>
                <td>
                  <div className={cellClass}>
                    <StampedeCheckBox
                      onChange={() => this.toggleAllSeries(!allChecked)}
                      checked={allChecked}
                    />
                  </div>
                </td>
                <td><div className={cellClass}><span>Color</span></div></td>
                <td>
                  <div className={`${cellClass}`}>
                    <span>Channel</span>
                    <div ref={this.chSelectRef} className="pos-relative">
                      <button
                        onClick={this.toggleChSelection}
                        type="button"
                        className="analytic-detail-ch-selection ms-2"
                        style={{ backgroundColor: chSelectionOpen ? 'rgba(180, 180, 180, 0.5)' : '#fff' }}
                      >
                        <span id="ch-select-icon">&#9660;</span>
                      </button>
                      {chSelectionOpen &&
                        (
                          <div className="analytical-report-sub-content-option-dropdown">
                            <ChannelTypeSelect
                              type={ChannelType.FAM}
                              active={displayedRow.Fam && displayedSeries.Fam}
                              onClick={() => this.showDetailRow(ChannelType.FAM, !displayedSeries.Fam ? true : !displayedRow.Fam)}
                            />
                            <ChannelTypeSelect
                              type={ChannelType.ROX}
                              active={displayedRow.Rox && displayedSeries.Rox}
                              onClick={() => this.showDetailRow(ChannelType.ROX, !displayedSeries.Rox ? true : !displayedRow.Rox)}
                            />
                          </div>
                        )}
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cellClass}>
                    <div className="flex-common px-1">
                      <div>Ct</div>
                      <OrderBtn
                        field="ct"
                        orderDesc={orderDesc}
                        activeOrderKey={orderKey}
                        applyOrder={this.applyOrder}
                      />
                    </div>
                  </div>
                </td>
                <td>
                  <div className={cellClass}>
                    <div className="flex-common px-1">
                      <div>Tm</div>
                      <OrderBtn
                        field="meltTemp"
                        orderDesc={orderDesc}
                        activeOrderKey={orderKey}
                        applyOrder={this.applyOrder}
                      />
                    </div>
                  </div>
                </td>
              </tr>
            </thead>
          </table>
        </div>
        <div className="analytical-report-detail-body">
          <table className="analytical-report-detail-table">
            <tbody>
              {items.map((item) => {
                const active = activeSeries.indexOf(item.index) >= 0;
                return (
                  <tr key={`detail-index-${item.index}`}>
                    <td>
                      <div className={cellClass}>
                        <StampedeCheckBox
                          checked={active}
                          onChange={() => this.props.toggleSeries(!active, item.index)}
                        />
                      </div>
                    </td>
                    <td>
                      <div className={cellClass}>
                        <Circle backgroundColor={SensorChartHelper.SensorColors[item.index]} />
                      </div>
                    </td>
                    <td><div className={cellClass}><span>{item.label}</span></div></td>
                    <td><div className={cellClass}><span>{!item.ct || isNaN(item.ct) ? '-' : item.ct.toFixed(2)}</span></div></td>
                    <td><div className={cellClass}><span>{item.meltTemp.length > 0 ? item.meltTemp.map((t) => t.toFixed(2)).join(';') : '-'}</span></div></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

type ChannelTypeSelectProps = { type: ChannelType, active: boolean, onClick(): any };
const ChannelTypeSelect: React.FC<ChannelTypeSelectProps> = function ChannelTypeSelect({ type, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="px-3 pos-relative analytical-report-sub-content-option-dropdown-item flex-common">
      <StampedeCheckBox
        checked={active}
        onChange={() => {}}
      />
      <span className="px-4 ms-1">{type.toUpperCase()}</span>
      {/* Covering component */}
      <div style={{ zIndex: 1 }} className="pos-absolute h-100 w-100" />
    </button>
  );
};

const OrderBtn: React.FC<{
  field: string,
  activeOrderKey: string,
  orderDesc: boolean,
  applyOrder(name: string, orderDesc: boolean): any,
}> = function OrderBtn({ field, activeOrderKey, orderDesc, applyOrder }) {
  return (
    <div className="ms-2">
      <ExplorerSortBtn
        name={field}
        active={!orderDesc && activeOrderKey === field}
        desc={false}
        onClick={applyOrder}
      />
      <ExplorerSortBtn
        name={field}
        active={orderDesc && activeOrderKey === field}
        desc
        onClick={applyOrder}
      />
    </div>
  );
};
