import React from 'react';
import { StampedeButton } from '../../FmlxUi';
import FmlxIcon from '../../icon/FmlxIcon';
import './Explorer.scss';

const ExplorerAction: React.FC<{
  delete?: () => any,
  download: () => any,
  deleteEnabled?: boolean,
}> = function ExplorerAction({ delete: deleteRecord, download, deleteEnabled }) {
  return (
    <div className="flex-common">
      <div className="sequence-list-action">
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Download" fontSize="sm" customColor="#414141" />}
          onClick={download}
          size="sm"
        />
        {deleteEnabled && (
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Trash" fontSize="sm" customColor="#DB0000" />}
          size="sm"
          onClick={deleteRecord}
        />
        )}
      </div>
    </div>
  );
};

ExplorerAction.defaultProps = {
  deleteEnabled: true,
  delete: () => {},
};

export default ExplorerAction;
