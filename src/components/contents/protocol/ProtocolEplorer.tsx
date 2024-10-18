import { resolve } from 'inversify-react';
import React from 'react';
import { connect } from 'react-redux';
import config from '../../../config';
import NotifTypeEnum from '../../../enums/NotifTypeEnum';
import { ProtocolFileState } from '../../../enums/ProtocolFileState';
import { SectionEnum } from '../../../enums/SectionEnum';
import { ReactComponent as EmptyProfiles } from '../../../images/EmptyProfiles.svg';
import IRecordResult from '../../../interfaces/IRecordResult';
import ConflictError from '../../../models/errors/ConflictError';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import ProtocolService from '../../../services/ProtocolService';
import appStateAction from '../../../stores/app/appStateAction';
import protocolStateAction from '../../../stores/protocol/protocolStateAction';
import { StampedeButton, StampedeTable } from '../../FmlxUi';
import BaseContent from '../../base/BaseContent';
import FmlxIcon from '../../icon/FmlxIcon';
import PaginationButton from '../../pagination/PaginationButton';
import '../explorer/Explorer.scss';
import ExplorerCheckBox from '../explorer/ExplorerCheckBox';
import ExplorerNoMatch from '../explorer/ExplorerNoMatch';
import ExplorerTableHeader from '../explorer/ExplorerTableHeader';
import IExplorerState from '../explorer/IExplorerState';
import sectionList from '../sectionList';
import PcrProfileItemAction from './PcrProfileItemAction';
import './ProtocolExplorer.scss';
import ProtocolExplorerHeaderView from './ProtocolExplorerHeaderView';

const defaultParams = () => {
  return {
    order: 'State',
    orderDesc: false,
    page: 0,
    limit: 10,
    totalData: 0,
    searchTerm: '',
    items: [],
  };
};

class ProtocolExplorer extends BaseContent<any, IExplorerState<ProtocolModel>> {
  @resolve(ProtocolService)
  private service: ProtocolService;
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
  get section() { return SectionEnum.ProtocolExplorer; }
  get selectedItems() {
    return this.state.selectedItems;
  }
  get footerContent(): any {
    return null;
  }
  get headerContent() {
    return (
      <ProtocolExplorerHeaderView
        showForm={this.showCreateForm}
        refreshItems={this.loadItems}
        searchItems={this.searchItems}
        selectedItems={this.state.selectedItems}
        showSearchInput={!this.state.isRecordsEmpty}
      />
    );
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
      this.loading.start('Opening protocol...');
    }
    this.setState({ getParams }, () => {
      this.service.getProtocols(getParams)
        .then(this.handleItemsLoaded)
        .catch(this.dialog.alertError)
        .finally(this.loading.stop);
    });
  }
  handleItemsLoaded = (response: IRecordResult<ProtocolModel>) => {
    const { getParams } = this.state;
    getParams.page = response.page;
    getParams.limit = response.limit;
    getParams.order = response.order;
    getParams.orderDesc = response.orderDesc;
    getParams.totalData = response.totalData;

    const { searchTerm, items } = response;
    const isRecordsEmpty = (!searchTerm || searchTerm.trim() === '') && response.totalData <= 0;
    const isNoRecordsMatch = searchTerm !== undefined && searchTerm !== null && searchTerm?.trim() !== '' && response.totalData === 0;

    this.setState({ items, getParams, itemsLoaded: true, isNoRecordsMatch, selectedItems: [], isRecordsEmpty });
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
  delete = (item: ProtocolModel) => {
    if (item.state === ProtocolFileState.Active) {
      this.alertCannotDelete(item);
      return;
    }
    const confirmContent = ConfirmContents.delete(item.name);
    this.dialog.showModal('Delete Protocol', confirmContent, 'YES, DELETE', 'md', NotifTypeEnum.Error, NotifTypeEnum.Error)
      .then(() => {
        this.service.delete(item.name)
          .then(() => {
            this.dialog.alertSuccess('1 protocols successfully removed!');
            this.loadItems(0);
          })
          .catch(this.handleCommonError);
      });
  }
  handleCommonError = (e: any) => {
    let msg = e;
    if (e instanceof ConflictError) {
      msg = e.message;
      this.loadItems();
    }
    this.dialog.alertError(msg);
  }
  alertCannotDelete = (item) => {
    const confirmContent = ConfirmContents.deleteNotAllowed(item.name);
    this.dialog.showModalInfo('Delete Protocol', confirmContent, 'GOT IT');
  }
  // download = (item: PcrProfileModel) => this.service.download(item.name);
  activateConfirm = (item: ProtocolModel) => {
    if (item.state === 'Active') {
      return;
    }
    const confirmContent = ConfirmContents.activate(item.name);
    this.dialog.showModal('Activate Protocol', confirmContent, 'YES, ACTIVATE')
      .then(() => this.activate(item));
  }
  activate = (item: ProtocolModel) => {
    this.service.activate(item.name)
      .then(() => {
        this.loadItems();
        this.dialog.alertInfo(`${item.name} successfully activated!`);
      })
      .catch(this.handleCommonError);
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
  switchItemChecked = (selectedItem: ProtocolModel) => {
    const { selectedItems } = this.state;
    const indexOf = selectedItems.indexOf(selectedItem);
    if (indexOf >= 0) {
      selectedItems.splice(indexOf, 1);
    } else {
      selectedItems.push(selectedItem);
    }
    this.setState({ selectedItems });
  }
  showCreateForm = () => {
    this.props.setActiveMenu(SectionEnum.ProtocolSetting);
  }
  showEditForm = (model: ProtocolModel) => {
    this.props.setEditProtocolName(model.name);
    this.props.setActiveMenu(SectionEnum.ProtocolSetting);
  }
  render() {
    const { itemsLoaded, items, getParams, isRecordsEmpty, isNoRecordsMatch } = this.state;
    const Container = this.commonTemplate;
    const allItemsSelected = this.selectedItems.length === items.length;
    const someItemsSelected = this.selectedItems.length > 0;
    const headerChecked = allItemsSelected || someItemsSelected;

    if (!itemsLoaded) {
      return <Container><p>Loading data..</p></Container>;
    }
    if (isRecordsEmpty) {
      return (
        <Container noPadding>
          <div className="explorer-content">
            <div className="pcr-profile-no-content">
              <div className="pt-5">
                <EmptyProfiles />
                <h5 className="pt-5 mt-5">Start create a new profile by clicking button CREATE PROFILE on the right corner.</h5>
              </div>
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
                <ExplorerTableHeader label="Protocol Name" name="Name" getParams={getParams} applyOrder={this.orderItems} />
                <ExplorerTableHeader label="State" name="State" getParams={getParams} applyOrder={this.orderItems} />
                <ExplorerTableHeader label="Note" name="Note" getParams={getParams} applyOrder={this.orderItems} />
                <ExplorerTableHeader label="Date Modified" name="Updated" getParams={getParams} applyOrder={this.orderItems} />
                <th>Action</th>
              </tr>
            </thead>
          </table>
          <div className="table-explorer-list-wrapper">
            <table className="table-explorer-list">
              <tbody>
                {items.map((item) => {
                  const created = new Date(item.updated);
                  const isActive = item.state === 'Active';
                  const key = `sequence-template-${item.name}`;
                  const isSelected = this.selectedItems.indexOf(item) >= 0;
                  return (
                    <tr key={key} className={isSelected ? 'table-explorer-row table-explorer-row-selected' : 'table-explorer-row'}>
                      <td className="table-explorer-checkbox-cell">
                        <ExplorerCheckBox
                          checked={isSelected}
                          onClick={() => this.switchItemChecked(item)}
                        />
                      </td>
                      <td><span className="table-explorer-item-name">{item.name}</span></td>
                      <td>
                        <ActivationButton
                          item={item}
                          isActive={isActive}
                          activate={this.activateConfirm}
                        />
                      </td>
                      <td><span>{item.note}</span></td>
                      <td><span>{created.toLocaleString('en-US', config.SETTING.DATE_OPTS)}</span></td>
                      <td>
                        <PcrProfileItemAction
                          delete={() => this.delete(item)}
                          edit={() => this.showEditForm(item)}
                          model={item}
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

const ConfirmContentTemplate: React.FC<{ par1: string, par2: string }> = function ConfirmContentTemplate({ par1, par2 }) {
  return (
    <div className="pt-3">
      <p>{par1}</p>
      <p className="pt-2">{par2}</p>
    </div>
  );
};

const ConfirmContents = {
  delete: (name: string) => {
    const par1 = 'Selected protocols will be removed from the device';
    const par2 = `Are you sure to delete ${name}?`;
    return <ConfirmContentTemplate par1={par1} par2={par2} />;
  },
  deleteNotAllowed: (name: string) => {
    const par1 = `Cannot delete ${name}.`;
    const par2 = 'Please switch the active protocol to other prior to deletion.';
    return <ConfirmContentTemplate par1={par1} par2={par2} />;
  },
  activate: (name: string) => {
    const par1 = 'Activated Protocol will be used on the regular run.';
    const par2 = `Are you sure to activate ${name}?`;
    return <ConfirmContentTemplate par1={par1} par2={par2} />;
  },
};

const ActivationButton: React.FC<{
  item: ProtocolModel,
  activate: (item: ProtocolModel) => any,
  isActive: boolean,
}> = function ActivationButton({ item, activate, isActive }) {
  const iconColor = isActive ? '#008F40' : '#C2C2C2';
  const iconName = isActive ? 'CheckboxCheckedCircle' : 'CheckboxUncheckedCircle';
  const label = isActive ? 'Active' : 'Not Active';
  return (
    <div className="sequence-list-action">
      <StampedeButton
        onlyIcon
        icon={<FmlxIcon name={iconName} fontSize="sm" customColor={iconColor} />}
        size="sm"
        onClick={() => activate(item)}
        disabled={isActive}
      />
      <span className="sequence-list-state-label ms-2">{label}</span>
    </div>
  );
};

const mapDispatchToProps = (dispatch) => {
  return {
    setActiveMenu: (section: SectionEnum) => {
      const found = sectionList.getSection(section);
      if (found) {
        dispatch(appStateAction.setActiveMenu(found));
      }
    },
    setEditProtocolName: (name?: string) => {
      dispatch(protocolStateAction.setEditProtocolName(name));
    },
  };
};

export default connect(null, mapDispatchToProps)(ProtocolExplorer);
