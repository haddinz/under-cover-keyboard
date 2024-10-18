import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';
import Loadable from 'react-loadable';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router';
import axios from 'axios';
import { SectionEnum } from '../../enums/SectionEnum';
import { scrollTop } from '../../helper/EventHelper';
import IState from '../../interfaces/IState';
import ServiceResponse from '../../models/ServiceResponse';
import BrowserDataService from '../../services/BrowserDataService';
import CPanelService from '../../services/CPanelService';
import LoadingService from '../../services/LoadingService';
import appStateAction from '../../stores/app/appStateAction';
import Header from '../layout/Header';
import SideBar from '../layout/SideBar';
import './ControlPanelApp.scss';
import LoadingContentElement from './LoadingContentElement';
import ISection from '../../interfaces/ISection';
import FixedFooter from '../layout/FixedFooter';
import SignalrApiClient from '../../services/SignalrApiClient';
import { NetworkEventName } from '../../enums/networkConfigEnum';

const ReportDetailView = Loadable({
  loader: () => import('./reportDetail/ReportDetailView'),
  loading: LoadingContentElement,
});
const ManualControl = Loadable({
  loader: () => import('./manualControl/ManualControl'),
  loading: LoadingContentElement,
});
const Dashboard = Loadable({
  loader: () => import('./dashboard/Dashboard'),
  loading: LoadingContentElement,
});
const PcrProfileExplorer = Loadable({
  loader: () => import('./protocol/ProtocolEplorer'),
  loading: LoadingContentElement,
});
const ReportExplorer = Loadable({
  loader: () => import('./history/ReportExplorer'),
  loading: LoadingContentElement,
});
const ReportDetailPatient = Loadable({
  loader: () => import('./reportDetail/ReportDetailPatient'),
  loading: LoadingContentElement,
});
const ProtocolEditor = Loadable({
  loader: () => import('./protocolEditor/ProtocolEditor'),
  loading: LoadingContentElement,
});

const VIEW_NAME = 'cpanel-app';
const ROUTE_PREFIX = '/app/';

const ControlPanelApp: React.FC = function ControlPanelApp() {
  return (
    <Routes>
      <Route
        path="*"
        element={<ControlPanelMain />}
      />
      <Route
        path={`${ROUTE_PREFIX}report-detail/:reportId`}
        element={<ReportDetailView />}
      />
      <Route
        path={`${ROUTE_PREFIX}report-detail-patient/:reportId`}
        element={<ReportDetailPatient />}
      />
    </Routes>
  );
};

const ControlPanelMain: React.FC = function ControlPanelMain() {
  const dispatch = useDispatch();
  const [serviceConencted, setServiceConnected] = useState(false);
  // Device connected but backend not connected
  const [onlyBackendError, setBackendError] = useState(false);

  const service = useInjection(CPanelService);
  const dataService = useInjection(BrowserDataService);
  const loading = useInjection(LoadingService);
  const apiClient = useInjection(SignalrApiClient);

  const loadNotifications = async () => {
    const notif = await service.GetSelfDiagnoseResult();
    dispatch(appStateAction.setNotifications(notif.content));
  };

  const handleNetworkEvents = () => {
    apiClient.on('NetworkEvent', (network) => {
      const url = `http://${network.payload.newHostname}:${window.location.port}/app/stampede-device`;

      const pingUrlStampedeDevice = async () => {
        try {
          const response = await axios.get(url);

          if (response.data) {
            window.location.href = `http://${network.payload.newHostname}:${window.location.port}`;
          }
        } catch (error) {
          console.error('Ping Error:', error);
        }

        setTimeout(pingUrlStampedeDevice, 2000);
      };

      if (network.name === NetworkEventName.HOSTNAME_CHANGED) {
        pingUrlStampedeDevice();
      }
    });
  };

  const componentDidMount = () => {
    loading.start('Connecting');
    service.subscribeOnConnect(VIEW_NAME, onServiceConnected);
    service.subscribeOnDisconnect(VIEW_NAME, onServiceDisconnected);
    service.start();
    setDefaultActiveMenu();
  };

  const componentWillUnmount = () => {
    service.unsubscribeOnConnect(VIEW_NAME);
    service.unsubscribeOnDisconnect(VIEW_NAME);
    // updateWorker.stop();
    service.close();
  };

  const onServiceConnected = () => {
    loading.stop();
    handleNetworkEvents();
    setBackendError(false);
    setServiceConnected(true);
    loadNotifications();
    // updateWorker.start();
    service.GetHostName()
      .then(changeTitle);
  };

  const changeTitle = (response: ServiceResponse<string>) => {
    dataService.hostName = response.content;
    if (window.location.hostname === 'localhost') {
      document.title = `LOCAL - ${dataService.hostName}`;
    } else {
      document.title = dataService.hostName;
    }
  };
  const isServiceUnavailableOrBadGateway = (connectionError: Error) => {
    try {
      // HACK: error object from signalr currently does not provide http status attribute
      const is502 = connectionError.message.includes('502'); // bad gateway
      const is503 = connectionError.message.includes('503'); // service unavailable
      return is502 || is503;
    } catch (e) {
      return false;
    }
  };
  const onServiceDisconnected = (e: Error) => {
    loading.start('Connecting');
    const cswNotActive = isServiceUnavailableOrBadGateway(e);
    setBackendError(cswNotActive);
    setServiceConnected(false);
  };
  const setDefaultActiveMenu = () => {
    const section = dataService.activeMenu;
    dispatch(appStateAction.setActiveMenu(section));
    scrollTop();
  };
  useEffect(() => {
    componentDidMount();
    return () => {
      componentWillUnmount();
    };
  }, []);

  if (onlyBackendError) {
    return (
      <div style={{ height: '100vh' }}>
        <h3 className="text-center text-danger">Failed to connect: Backend not active</h3>
      </div>
    );
  }

  if (!serviceConencted) {
    return null;
  }

  return (
    <>
      <div className="main-content-container">
        <Content />
      </div>
      <FixedFooter />
      <SideBar />
    </>
  );
};

const Content: React.FC = function Content() {
  const selectedSection: ISection = useSelector((state: IState) => state.appState.activeMenu);
  switch (selectedSection.code) {
    case SectionEnum.ManualControl:
      return <ManualControl />;
    case SectionEnum.Dashboard:
      return <Dashboard />;
    case SectionEnum.ProtocolExplorer:
      return <PcrProfileExplorer />;
    case SectionEnum.ReportExplorer:
      return <ReportExplorer />;
    case SectionEnum.ProtocolSetting:
      return <ProtocolEditor />;
    // case SectionEnum.Sequence:
    //   return <SeqExplorer />;
    default:
      break;
  }
  return (
    <>
      <Header section={SectionEnum.NotImplemented} content={null} />
      <main className="main-content mt-2 px-2 py-2 text-secondary bg-light not-impelemented-content">
        <h6>View not implemented</h6>
      </main>
    </>
  );
};

export default ControlPanelApp;
