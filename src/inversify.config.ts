import { Container } from 'inversify';
import 'reflect-metadata';
import RestClient from './api/RestClient';
import BrowserDataService from './services/BrowserDataService';
import CPanelService from './services/CPanelService';
import DeviceSettingsService from './services/DeviceSettingsService';
import DialogService from './services/DialogService';
import LoadingService from './services/LoadingService';
import ProtocolService from './services/ProtocolService';
import PostProcessService from './services/PostProcessService';
import SequenceService from './services/SequenceService';
import RunTestApi from './services/RunTestApi';
import SignalrApiClient from './services/SignalrApiClient';
import UIEventService from './services/UIEventService';
import CPanelServiceImpl from './services/impl/CPanelServiceImpl';
import DeviceSettingsServiceImpl from './services/impl/DeviceSettingsServiceImpl';
import ProtocolServiceImpl from './services/impl/ProtocolServiceImpl';
import PostProcessServiceImpl from './services/impl/PostProcessServiceImpl';
import SequenceServiceImpl from './services/impl/SequenceServiceImpl';
import RunTestApiImpl from './services/impl/RunTestApiImpl';
import CpanelUpdateWorker from './services/workers/cpanelUpdate/CpanelUpdateWorker';
import LocalCpanelUpdateWorker from './services/workers/cpanelUpdate/LocalCpanelUpdateWorker';
import DeviceIndicator from './services/DeviceIndicator';
import DeviceIndicatorImpl from './services/impl/DeviceIndicatorImpl';

const dependencyContainer:Container = new Container();

dependencyContainer.bind(SignalrApiClient).toSelf().inSingletonScope();
dependencyContainer.bind(DialogService).toSelf().inSingletonScope();
dependencyContainer.bind(BrowserDataService).toSelf().inSingletonScope();
dependencyContainer.bind(UIEventService).toSelf().inSingletonScope();
dependencyContainer.bind(RestClient).toSelf().inSingletonScope();
dependencyContainer.bind(LoadingService).toSelf().inSingletonScope();

dependencyContainer.bind(CPanelService).to(CPanelServiceImpl).inSingletonScope();
dependencyContainer.bind(RunTestApi).to(RunTestApiImpl).inSingletonScope();
dependencyContainer.bind(SequenceService).to(SequenceServiceImpl).inSingletonScope();
dependencyContainer.bind(DeviceSettingsService).to(DeviceSettingsServiceImpl).inSingletonScope();
dependencyContainer.bind(PostProcessService).to(PostProcessServiceImpl).inSingletonScope();
dependencyContainer.bind(ProtocolService).to(ProtocolServiceImpl).inSingletonScope();
dependencyContainer.bind(CpanelUpdateWorker).to(LocalCpanelUpdateWorker).inSingletonScope();
dependencyContainer.bind(DeviceIndicator).to(DeviceIndicatorImpl).inSingletonScope();

export { dependencyContainer };
