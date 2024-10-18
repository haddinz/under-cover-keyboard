import { resolve } from 'inversify-react';
import React from 'react';
import config from '../../../config';
import NotifTypeEnum from '../../../enums/NotifTypeEnum';
import { SectionEnum } from '../../../enums/SectionEnum';
import { ReactComponent as EmptyReport } from '../../../images/EmptyReport.svg';
import IRecordResult from '../../../interfaces/IRecordResult';
import HistoryRecord from '../../../postProcess/HistoryRecord';
import PostProcessService from '../../../services/PostProcessService';
import BaseContent from '../../base/BaseContent';
import PaginationButton from '../../pagination/PaginationButton';
import '../explorer/Explorer.scss';
import ExplorerCheckBox from '../explorer/ExplorerCheckBox';
import ExplorerSortBtn from '../explorer/ExplorerSortBtn';
import IExplorerState from '../explorer/IExplorerState';
import ExplorerAction from './../explorer/ExplorerAction';
import './ReportExplorer.scss';
import ReportHeaderView from './ReportHeaderView';
import ExplorerNoMatch from '../explorer/ExplorerNoMatch';

const defaultParams = () => {
  return {
    order: 'RunStartedAt',
    orderDesc: true,
    page: 0,
    limit: 10,
    totalData: 0,
    searchTerm: '',
    items: [],
  };
};

export default class ReportExplorer extends BaseContent<any, IExplorerState<HistoryRecord>> {
  @resolve(PostProcessService)
  private service: PostProcessService;

  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedItems: [],
      itemsLoaded: false,
      getParams: defaultParams(),
      isRecordsEmpty: true,
      isNoRecordsMatch: false,
    };
  }
  componentDidMount() {
    this.loadItems();
  }
  get selectedItems() { return this.state.selectedItems; }
  get section(): any {
    return SectionEnum.ReportExplorer;
  }
  get headerContent(): any {
    return (
      <ReportHeaderView
        displayedItems={this.state.items}
        selectedItems={this.state.selectedItems}
        showSearchInput={!this.state.isRecordsEmpty}
        refreshItems={this.loadItems}
        searchItems={this.searchItems}
      />
    );
  }
  get footerContent(): any {
    return null;
  }
  searchItems = (value: string) => {
    const { getParams } = this.state;
    getParams.searchTerm = value;
    this.setState({ getParams }, () => this.loadItems(0, false));
  }
  loadItems = (page?: number, showLoading = true) => {
    const { getParams } = this.state;
    if (page !== undefined && page >= 0) {
      getParams.page = page;
    }
    if (showLoading) {
      this.loading.start('Opening report...');
    }
    this.setState({ getParams }, () => {
      this.service.getReports(getParams)
        .then(this.handleItemsLoaded)
        .catch(this.dialog.alertError)
        .finally(this.loading.stop);
    });
  }
  handleItemsLoaded = (response: IRecordResult<HistoryRecord>) => {
    const { getParams } = this.state;
    getParams.page = response.page;
    getParams.limit = response.limit;
    getParams.order = response.order;
    getParams.orderDesc = response.orderDesc;
    getParams.totalData = response.totalData;

    const { searchTerm, items } = response;
    const isRecordsEmpty = (!searchTerm || searchTerm.trim() === '') && response.totalData <= 0;
    const isNoRecordsMatch = searchTerm !== undefined && searchTerm !== null && searchTerm?.trim() !== '' && response.totalData === 0;

    this.setState({ items, isRecordsEmpty, isNoRecordsMatch, getParams, selectedItems: [], itemsLoaded: true });
  }
  loadItemsAtPage = (page: number) => {
    const { getParams } = this.state;
    getParams.page = page;
    this.setState({ getParams }, this.loadItems);
  }
  orderItems = (order: string, orderDesc: boolean) => {
    const { getParams } = this.state;
    getParams.order = order;
    getParams.orderDesc = orderDesc;
    this.setState({ getParams }, this.loadItems);
  }
  delete = (item: HistoryRecord) => {
    const backToFirstPage = this.state.items.length === 1 && this.state.items[0] === item;
    this.dialog.showModal('Delete Report', deleteReportContent(item), 'YES, DELETE', 'md', NotifTypeEnum.Error, NotifTypeEnum.Error)
      .then(() => {
        this.service.delete(item.identifier)
          .then(() => {
            this.dialog.alertSuccess('1 reports successfully removed!');
            this.loadItems(backToFirstPage ? 0 : undefined);
          })
          .catch(this.dialog.alertError);
      });
  }
  switchHeaderChecked = () => {
    const { items } = this.state;
    let { selectedItems } = this.state;
    if (selectedItems.length === items.length) {
      selectedItems = [];
    } else {
      selectedItems = [...items];
    }
    this.setState({ selectedItems });
  }
  switchItemChecked = (selectedItem: HistoryRecord) => {
    const { selectedItems } = this.state;
    const indexOf = selectedItems.indexOf(selectedItem);
    if (indexOf >= 0) {
      selectedItems.splice(indexOf, 1);
    } else {
      selectedItems.push(selectedItem);
    }
    this.setState({ selectedItems });
  }
  dataTableHeader = (label: string, name: string) => {
    const { getParams } = this.state;
    const activeOrder = getParams.order === name;
    const activeDesc = activeOrder && getParams.orderDesc;
    const activeAsc = activeOrder && !getParams.orderDesc;
    return (
      <th>
        <div className="input-group mx-auto" style={{ width: 'max-content' }}>
          <div className="d-flex" style={{ alignItems: 'center' }}>
            <span className="me-2">{label}</span>
          </div>
          <div className="input-group-append">
            <div className="ms-1 table-explorer-sort">
              <ExplorerSortBtn
                name={name}
                active={activeAsc}
                desc={false}
                onClick={this.orderItems}
              />
              <ExplorerSortBtn
                name={name}
                active={activeDesc}
                desc
                onClick={this.orderItems}
              />
            </div>
          </div>
        </div>
      </th>
    );
  }
  download = (item: HistoryRecord) => {
    this.service.download(item.identifier);
  }
  openDetail = (report: HistoryRecord, e: React.MouseEvent) => {
    // applied only when double click on row body
    if (e.target instanceof HTMLButtonElement) {
      return;
    }
    if (e.detail === 2) {
      const id = encodeURIComponent(report.identifier);
      const path = `//${window.location.host}/app/report-detail/${id}`;
      window.open(path, '_blank');
    }
  }

  render() {
    const { itemsLoaded, items, getParams, isRecordsEmpty, isNoRecordsMatch } = this.state;
    const Container = this.commonTemplate;
    const header = this.dataTableHeader;
    const allItemsSelected = this.selectedItems.length === items.length;
    const someItemsSelected = this.selectedItems.length > 0;
    const headerChecked = allItemsSelected || someItemsSelected;

    if (!itemsLoaded) {
      return (
        <Container noPadding>
          <div className="explorer-content">
            <div className="reports-no-content">
              <div className="pt-5" />
            </div>
          </div>
        </Container>
      );
    }
    if (isNoRecordsMatch) {
      return (
        <Container noPadding>
          <div className="explorer-content">
            <ExplorerNoMatch />
            <div className="table-explorer-list-wrapper" />
            <div className="explorer-footer" />
          </div>
        </Container>
      );
    }
    if (isRecordsEmpty) {
      return (
        <Container noPadding>
          <div className="explorer-content">
            <div className="reports-no-content">
              <div className="pt-5">
                <EmptyReport />
                <p className="pt-5 mt-5">No report is saved on the device right now. New report will be listed once a test is executed.</p>
              </div>
            </div>
          </div>
        </Container>
      );
    }
    return (
      <Container noPadding>
        <div className="explorer-content">
          <table className="table-explorer-list">
            <thead>
              <tr>
                <th className="table-explorer-checkbox-cell">
                  <ExplorerCheckBox
                    checked={headerChecked}
                    indeterminate={headerChecked && !allItemsSelected}
                    onClick={this.switchHeaderChecked}
                  />
                </th>
                {header('Report Name (Run ID)', 'Identifier')}
                {header('Protocol Name', 'ProtocolVersion')}
                {header('Date Executed', 'RunStartedAt')}
                {header('Status', 'Status')}
                {header('Size', 'LogSize')}
                <th>Action</th>
              </tr>
            </thead>
          </table>
          <div className="table-explorer-list-wrapper">
            <table className="table-explorer-list">
              <tbody>
                {items.map((item, i) => {
                  const started = new Date(item.runStartedAt);
                  const key = `report-${item.identifier}-${i}`;
                  const isSelected = this.selectedItems.indexOf(item) >= 0;
                  return (
                    <tr
                      key={key}
                      className={isSelected ? 'clickable table-explorer-row-selected' : 'clickable'}
                      onClick={(e: React.MouseEvent) => this.openDetail(item, e)}
                    >
                      <td className="table-explorer-checkbox-cell">
                        <ExplorerCheckBox
                          checked={isSelected}
                          onClick={() => this.switchItemChecked(item)}
                        />
                      </td>
                      <td>
                        <span className="table-explorer-item-name">
                          {item.identifier}
                        </span>
                      </td>
                      <td><span>{item.protocolVersion}</span></td>
                      <td><span>{started.toLocaleString('en-US', config.SETTING.DATE_OPTS)}</span></td>
                      <td><span>{item.status ?? '-'}</span></td>
                      <td><span>{getSize(item)}</span></td>
                      <td>
                        <ExplorerAction
                          delete={() => this.delete(item)}
                          download={() => this.download(item)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="explorer-footer">
            <PaginationButton
              limit={getParams.limit}
              activePage={getParams.page}
              totalData={getParams.totalData}
              onClick={this.loadItemsAtPage}
            />
          </div>
        </div>
      </Container>
    );
  }
}

const deleteReportContent = (item: HistoryRecord) => {
  return (
    <div className="pt-3">
      <p>Selected reports will be removed from the device.</p>
      <p className="pt-2">Are you sure to delete {item.identifier}?</p>
    </div>
  );
};

const getSize = (result: HistoryRecord) => {
  if (!result || !result.logSize) {
    return '0 KB';
  }
  const size = result.logSize / 1024;
  return `${size.toFixed(0)} KB`;
};
