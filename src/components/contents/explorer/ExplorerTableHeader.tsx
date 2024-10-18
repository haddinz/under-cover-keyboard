import React from 'react';
import IGetParamsTable from '../../../interfaces/IGetParamsTable';
import ExplorerSortBtn from './ExplorerSortBtn';

const ExplorerTableHeader: React.FC<{
  getParams: IGetParamsTable<any>, label: string, name: string, applyOrder(key: string, asc: boolean): any,
}> = function ExplorerTableHeader({ label, name, getParams, applyOrder }) {
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
              onClick={applyOrder}
            />
            <ExplorerSortBtn
              name={name}
              active={activeDesc}
              desc
              onClick={applyOrder}
            />
          </div>
        </div>
      </div>
    </th>
  );
};

export default ExplorerTableHeader;
