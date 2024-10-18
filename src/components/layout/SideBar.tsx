import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useInjection } from 'inversify-react';
import { FmlxIcon } from 'fmlx-common-ui';
import ISection from '../../interfaces/ISection';
import IState from '../../interfaces/IState';
import sectionList from '../contents/sectionList';
// import FmlxIcon from '../icon/FmlxIcon';
import './SideBar.scss';
import appStateAction from '../../stores/app/appStateAction';
import BrowserDataService from '../../services/BrowserDataService';
import { invokeLater, scrollTop } from '../../helper/EventHelper';
import { SectionEnum } from '../../enums/SectionEnum';
import UIEventService from '../../services/UIEventService';
import NotificationMessage from '../../models/NotificationMessage';
import DateHelper from '../../helper/DateHelper';
import NetworkConfiguration from '../contents/NetworkConfig/NetworkConfiguration';

const SideBar: React.FC = function SideBar() {
  const { selfDiagnoseResult, activeMenu, navigationConfirmation } = useSelector((s: IState) => s.appState);
  const notifications = useMemo(() => {
    const notif: NotificationMessage[] = [];
    if (!selfDiagnoseResult?.hasError) return notif;
    selfDiagnoseResult.elementDiagnoseResults.forEach((el) => {
      if (el.errorCode) {
        notif.push({
          title: `${el.errorCode} - ${el.name} Error`,
          date: el.date,
          description: el.errorMessage,
        });
      }
    });
    return notif;
  }, [selfDiagnoseResult]);

  const [selected, setSelected] = useState(activeMenu);
  const [showNotif, setShowNotif] = useState(false);
  const [showNetworkConfig, setShowNetworkConfig] = useState(false);

  const dataService = useInjection(BrowserDataService);
  const dispatch = useDispatch();
  const setSelectedSection = (section: ISection) => {
    if (activeMenu.code !== SectionEnum.ProtocolSetting) {
      dispatch(appStateAction.setActiveMenu(section));
      dataService.activeMenu = section;
      scrollTop();
      return;
    }
    dispatch(appStateAction.setNavigationAttempt({ from: activeMenu.code, to: section.code }));
    setSelected(section);
  };
  const doNavigate = (section: ISection) => {
    dispatch(appStateAction.setActiveMenu(section));
    dispatch(appStateAction.setNavigationAttempt(undefined));
    dataService.activeMenu = section;
    scrollTop();
  };
  React.useEffect(() => {
    if (!navigationConfirmation) {
      return;
    }
    navigationConfirmation.then((ok) => {
      if (ok) {
        doNavigate(selected);
      } else {
        setSelected(activeMenu);
      }
    });
    dispatch(appStateAction.setNavigationAttempt(undefined));
  }, [navigationConfirmation]);

  const toggkeNotif = () => {
    if (notifications.length <= 0) {
      return;
    }
    invokeLater(() => {
      setShowNotif(!showNotif);
    }, 100);
  };

  const selectedSection = activeMenu;
  const sections = useMemo(() => sectionList.items.filter((s) => s.ignoredSidebar !== true), []);

  return (
    <>
      {showNotif && <NotificationList notifications={notifications} close={() => setShowNotif(false)} />}
      <NetworkConfiguration show={showNetworkConfig} onClose={() => { setShowNetworkConfig(false); }} />
      <div className="app-sidebar" data-testid="app-sidebar">
        <aside className="app-sidebar-section-container">
          <section>
            <button type="button" className="app-sidebar-section-item" onClick={toggkeNotif}>
              {notifications.length > 0 && <div className="app-sidebar-top-notif" />}
              <FmlxIcon name="Bell" customColor="#C2C2C2" />
            </button>
          </section>
          {sections.map((section) => {
            const isActive = section.code === selectedSection.code;
            const className = isActive ? 'app-sidebar-section-item app-sidebar-section-item-active' : 'app-sidebar-section-item';
            const iconColor = isActive ? '#1B1B1B' : '#C2C2C2';
            return (
              <section key={`section-${section.code}`} data-testid={`section-${section.code}`}>
                <button
                  type="button"
                  className={`${className}`}
                  onClick={() => setSelectedSection(section)}
                >
                  <div className="text-center" style={{ color: iconColor }}>
                    <FmlxIcon name={section.icon} customColor={iconColor} />
                    <div className="app-sidebar-menu-label mt-1">{section.label}</div>
                  </div>
                </button>
              </section>
            );
          })}
          <section>
            <button
              type="button"
              className="app-sidebar-section-item"
              onClick={() => { setShowNetworkConfig(true); }}
            >
              <div className="text-center">
                <FmlxIcon name="WiFi" customColor="#C2C2C2" />
                <div className="app-sidebar-menu-label mt-1" style={{ color: '#C2C2C2' }}>{SectionEnum.Network}</div>
              </div>
            </button>
          </section>
        </aside>
        <div
          className="app-sidebar-section-item-help app-sidebar-section-item"
          onClick={() => setSelectedSection(sectionList.notImplemented)}
        >
          <div className="text-center">
            <FmlxIcon name="HelpCircle" customColor="#C2C2C2" />
            <div className="app-sidebar-menu-label mt-1">Help</div>
          </div>
        </div>
      </div>
    </>
  );
};

const NotificationList: React.FC<{ notifications: NotificationMessage[], close(): any }> = function ({ notifications, close }) {
  const ref: React.MutableRefObject<HTMLDivElement> = useRef() as React.MutableRefObject<HTMLDivElement>;
  const uiEvtService = useInjection(UIEventService);
  const handleDocClick = (e: MouseEvent) => {
    if (!ref.current) {
      return;
    }
    const { clientX, clientY } = e;
    const rect = ref.current.getBoundingClientRect();
    if (!intersectRectangle(rect, clientX, clientY)) {
      close();
    }
  };
  useEffect(() => {
    uiEvtService.onDocumentClick.add('notif-list', handleDocClick);
    return () => uiEvtService.onDocumentClick.remove('notif-list');
  });

  return (
    <div ref={ref} className="notification-center">
      <div className="notification-center-list px-2 py-2">
        {notifications.map((notif) => {
          const date = new Date(notif.date);
          const dateStr = `${date.toLocaleDateString('en-US')} - ${date.toLocaleTimeString('en-US')}`;
          return (
            <div className="notification-center-item px-3 py-2 mb-2">
              <div className="notification-center-item-date mb-2">{dateStr}</div>
              <div className="notification-center-item-title mb-3">
                <FmlxIcon name="Cancel" customColor="#FF5252" />
                <span className="ms-2">{notif.title}</span>
              </div>
              <div className="notification-center-body">{notif.description}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const intersectRectangle = (rect: DOMRect, x: number, y: number) => {
  return (
    x >= rect.x && x <= (rect.x + rect.width) &&
    y >= rect.y && y <= (rect.y + rect.height)
  );
};

export default SideBar;
