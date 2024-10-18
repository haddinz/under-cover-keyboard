import { useInjection } from 'inversify-react';
import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import 'reflect-metadata';
import './App.scss';
import ControlPanelApp from './components/contents/ControlPanelApp';
import ModalContainer from './components/dialog/ModalContainer';
import LoadingContainer from './components/loading/LoadingContainer';
import ToastContainer from './components/toast/ToastContainer';
import ToolTipContainer from './components/tooltip/ToolTipContainer';
import config from './config';
import UIEventService from './services/UIEventService';

import 'bootstrap/dist/css/bootstrap.min.css';
import ExternalScreen from './components/externalScreen/ExternalScreen';

const App: React.FC = function App() {
  const htmlEventService = useInjection(UIEventService);
  const onLoad = () => {
    htmlEventService.initialize();
    document.title = config.TITLE;
  };
  useEffect(() => {
    onLoad();
    return () => {};
  }, []);

  return (
    <BrowserRouter basename="/">
      <div className="container-app" data-testid="container-app">
        {/* <LoadingContainer />
        <ModalContainer />
        <ToastContainer />
        <ControlPanelApp /> */}
        <ExternalScreen />
      </div>
      <ToolTipContainer />
    </BrowserRouter>
  );
};
export default App;
