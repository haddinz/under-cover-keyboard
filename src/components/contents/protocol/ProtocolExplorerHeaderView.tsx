import React from 'react';
import { resolve } from 'inversify-react';
import NotifTypeEnum from '../../../enums/NotifTypeEnum';
import ConflictError from '../../../models/errors/ConflictError';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import DialogService from '../../../services/DialogService';
import ProtocolService from '../../../services/ProtocolService';
import { StampedeButton } from '../../FmlxUi';
import ControlledComponent from '../../base/ControlledComponent';
import FmlxIcon from '../../icon/FmlxIcon';
import SearchInput from '../../searchInput/SearchInput';
import '../explorer/Explorer.scss';

type State = {
}

type Props = {
  refreshItems(): any;
  searchItems(val: string): any;
  showForm(): any;
  selectedItems: ProtocolModel[];
  showSearchInput: boolean;
}

export default class ProtocolExplorerHeaderView extends ControlledComponent<Props, State> {
  @resolve(ProtocolService)
  private service: ProtocolService;
  @resolve(DialogService)
  private dialog: DialogService;

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  deleteAll = async () => {
    const { selectedItems } = this.props;
    if (selectedItems.length === 0) {
      return;
    }
    const content = multipleDeletionDialogContent(selectedItems.length);
    this.dialog.showModal('Delete Protocol', content, 'YES, DELETE', 'md', NotifTypeEnum.Error)
      .then(() => {
        this.service.deleteAll(selectedItems)
          .then(() => {
            this.dialog.alertSuccess(`${selectedItems.length} protocols successfully removed!`);
            this.props.refreshItems();
          })
          .catch(this.handleCommonError);
      });
  }
  handleCommonError = (e: any) => {
    let msg = e;
    if (e instanceof ConflictError) {
      msg = e.message;
      this.props.refreshItems();
    }
    this.dialog.alertError(msg);
  }
  showCreateForm = () => {
    this.props.showForm();
  }
  render() {
    const { selectedItems, showSearchInput, searchItems } = this.props;
    const buttonActive = selectedItems.length > 0;
    return (
      <div className="explorer-header-container">
        {showSearchInput && <div style={{ width: 260 }}><SearchInput placeHolder="Search" onSearch={searchItems} /></div> }
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Trash" fontSize="md" customColor={buttonActive ? '#DB0000' : '#C2C2C2'} />}
          onClick={this.deleteAll}
          disabled={!buttonActive}
        />
        <StampedeButton
          label="CREATE"
          withIcon="start"
          icon={<FmlxIcon name="Add" customColor="white" />}
          onClick={this.showCreateForm}
        />
      </div>
    );
  }
}
const multipleDeletionDialogContent = (count: number) => {
  return (
    <div className="pt-3">
      <p>Selected protocols will be removed from the device.</p>
      <p className="pt-2">Are you sure to delete {count} selected protocols?</p>
    </div>
  );
};
