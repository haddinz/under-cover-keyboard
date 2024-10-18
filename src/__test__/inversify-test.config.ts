import { Container } from 'inversify';
import 'reflect-metadata';
import config from '../config';
import MockCPanelService from '../mocks/services/MockCPanelService';
import BrowserDataService from '../services/BrowserDataService';
import CPanelService from '../services/CPanelService';
import DialogService from '../services/DialogService';
import LoadingService from '../services/LoadingService';
import CpanelUpdateWorker from '../services/workers/cpanelUpdate/CpanelUpdateWorker';
import LocalCpanelUpdateWorker from '../services/workers/cpanelUpdate/LocalCpanelUpdateWorker';

const dependencyContainerTest:Container = new Container();

dependencyContainerTest.bind(DialogService).toSelf().inSingletonScope();
dependencyContainerTest.bind(BrowserDataService).toSelf().inSingletonScope();
dependencyContainerTest.bind(LoadingService).toSelf().inSingletonScope();

dependencyContainerTest.bind(CPanelService).to(MockCPanelService).inSingletonScope();

dependencyContainerTest.bind(CpanelUpdateWorker).to(LocalCpanelUpdateWorker).inSingletonScope();

export { dependencyContainerTest };

