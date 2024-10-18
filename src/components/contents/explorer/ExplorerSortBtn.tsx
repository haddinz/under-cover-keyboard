import React from 'react';
import FmlxIcon from '../../icon/FmlxIcon';

const ExplorerSortBtn: React.FC<{
  name: string, active: boolean, desc: boolean, onClick: (name: string, desc: boolean) => any
}> = function ExplorerSortBtn({ name, active, desc, onClick }) {
  const color = active ? 'black' : '#707070';
  const iconName = desc ? 'ArrowDownOutline' : 'ArrowUpOutline';
  return (
    <div className={desc ? 'btn-sort-desc' : 'btn-sort-asc'}>
      <button type="button" onClick={() => onClick(name, desc)}>
        <FmlxIcon name={iconName} customColor={color} fontSize="xs" />
      </button>
    </div>
  );
};

export default ExplorerSortBtn;
