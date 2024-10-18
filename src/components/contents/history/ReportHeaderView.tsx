import { resolve } from 'inversify-react';
import React from 'react';
import NotifTypeEnum from '../../../enums/NotifTypeEnum';
import DialogService from '../../../services/DialogService';
import PostProcessService from '../../../services/PostProcessService';
import ControlledComponent from '../../base/ControlledComponent';
import { StampedeButton } from '../../FmlxUi';
import FmlxIcon from '../../icon/FmlxIcon';
import '../explorer/Explorer.scss';
import HistoryRecord from '../../../postProcess/HistoryRecord';
import SearchInput from '../../searchInput/SearchInput';

type State = {
}

type Props = {
  refreshItems: (page?: number) => any;
  searchItems: (value: string) => any;
  selectedItems: HistoryRecord[];
  displayedItems: HistoryRecord[];
  showSearchInput: boolean;
}

export default class ReportHeaderView extends ControlledComponent<Props, State> {
  @resolve(PostProcessService)
  private service: PostProcessService;
  @resolve(DialogService)
  private dialog: DialogService;

  constructor(props) {
    super(props);
    this.state = {
    };
  }
  deleteAll = async () => {
    const { selectedItems, displayedItems } = this.props;
    const deleteAllDisplayed = selectedItems.length === displayedItems.length;
    if (selectedItems.length === 0) {
      return;
    }
    const content = multipleDeletionDialogContent(selectedItems.length);
    this.dialog.showModal('Delete Report', content, 'YES, DELETE', 'md', NotifTypeEnum.Error)
      .then(() => {
        this.service.deleteAll(selectedItems.map((item) => item.identifier))
          .then(() => {
            this.dialog.alertSuccess(`${selectedItems.length} reports successfully removed!`);
            this.props.refreshItems(deleteAllDisplayed ? 0 : undefined);
          })
          .catch(this.dialog.alertError);
      });
  }
  downloadAll = () => {
    const { selectedItems } = this.props;
    if (selectedItems.length === 0) {
      return;
    }
    this.service.downloadAll(selectedItems.map((item) => item.identifier));
  }
  openDetail = () => {
    if (this.props.selectedItems.length !== 1) {
      return;
    }
    const report = this.props.selectedItems[0];
    const path = `//${window.location.host}/app/report-detail/${report.identifier}`;
    window.open(path, '_blank');
  }
  render() {
    const { selectedItems, showSearchInput, searchItems } = this.props;
    const buttonActive = selectedItems.length > 0;
    return (
      <div className="explorer-header-container">
        {showSearchInput && <SearchInput placeHolder="Search report here..." onSearch={searchItems} />}
        <StampedeButton
          onlyIcon
          onClick={this.downloadAll}
          disabled={!buttonActive}
          icon={<FmlxIcon name="Download" fontSize="md" customColor={buttonActive ? '#212529' : '#C2C2C2'} />}
        />
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Trash" fontSize="md" customColor={buttonActive ? '#DB0000' : '#C2C2C2'} />}
          onClick={this.deleteAll}
          disabled={!buttonActive}
        />
        <StampedeButton
          id="btn-upload-sequence"
          label="OPEN"
          withIcon="start"
          icon={<FmlxIcon name="Open" customColor="white" />}
          onClick={this.openDetail}
          disabled={selectedItems.length !== 1}
        />
      </div>
    );
  }
}
const multipleDeletionDialogContent = (count: number) => {
  return (
    <div className="pt-3">
      <p>Selected reports will be removed from the device.</p>
      <p className="pt-2">Are you sure to delete {count} selected reports?</p>
    </div>
  );
};
