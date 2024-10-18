import React from 'react';
import './DashboardTab.scss';

const DashboardTab: React.FC<{ children: any }> = function DashboardTab({ children }) {
  return (
    <div className="dashboard-tab">
      {children}
    </div>
  );
};

type DashboardTabItemProps = { setActive(id: number), label: string, id: number, activeId: number }
export const DashboardTabItem: React.FC<DashboardTabItemProps> = function DashboardTabItem(props: DashboardTabItemProps) {
  const isActive = props.activeId === props.id;
  const setActive = () => props.setActive(props.id);
  return (
    <li>
      <button type="button" className={`dashboard-tab-item px-3 ${isActive ? 'dashboard-tab-item-active' : 'dashboard-tab-item-inactive'}`} onClick={setActive}>
        {props.label}
      </button>
    </li>
  );
};

export const DashboardTabList: React.FC<{ children: any }> = function DashboardTabList({ children }) {
  return (
    <ul className="dashboard-tab-list">
      {children}
    </ul>
  );
};

export const DashboardTabContent: React.FC<{ id: number, activeId: number, children: any }> = function DashboardTabContent({ id, activeId, children }) {
  if (id !== activeId) {
    return null;
  }
  return (
    <div className="dashboard-tab-content">
      {children}
    </div>
  );
};

export default DashboardTab;
