import React from 'react';
import { StampedeCheckBox } from '../../FmlxUi';

const ExplorerCheckBox: React.FC<{
  checked: boolean,
  indeterminate?: boolean,
  onClick: () => any
}> = function ExplorerCheckBox({ checked, indeterminate, onClick }) {
  return (
    <div>
      <span>
        <StampedeCheckBox
          checked={checked}
          indeterminate={indeterminate}
          onChange={onClick}
        />
        {/* <FmlxUiButton
          onlyIcon
          icon={<FmlxIcon fontSize="sm" name={checked ? checkedIcon : 'CheckboxUnchecked'} customColor={color} />}
          size="sm"
          onClick={onClick}
        /> */}
      </span>
    </div>
  );
};

ExplorerCheckBox.defaultProps = {
  indeterminate: false,
};

export default ExplorerCheckBox;
