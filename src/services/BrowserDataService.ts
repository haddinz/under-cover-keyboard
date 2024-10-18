import { injectable } from 'inversify';
import 'reflect-metadata';
import DashboardTabMode from '../components/contents/dashboard/DashboardTabMode';
import ISection from '../interfaces/ISection';
import ClientStoredData from '../models/ClientStoredData';

const DATA_KEY = 'stampede-clientside-data';

@injectable()
export default class BrowserDataService {
  get activeMenu() {
    return this.getStoredData().activeMenu;
  }
  set activeMenu(menu: ISection) {
    const data = this.getStoredData();
    data.activeMenu = menu;
    this.setStoredData(data);
  }
  get dashboardMode() {
    const { dashboardMode } = this.getStoredData();
    if (dashboardMode >= 0) {
      return dashboardMode;
    }
    return DashboardTabMode.ModeCamera;
  }
  set dashboardMode(mode: DashboardTabMode) {
    const data = this.getStoredData();
    data.dashboardMode = mode;
    this.setStoredData(data);
  }
  public hostName = window.location.hostname;

  reset = () => {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(new ClientStoredData()));
  }

  private setStoredData = (data: ClientStoredData) => {
    sessionStorage.setItem(DATA_KEY, JSON.stringify(data));
  }

  private getStoredData = () : ClientStoredData => {
    const data = sessionStorage.getItem(DATA_KEY);
    if (!data) {
      this.reset();
      return new ClientStoredData();
    }
    return JSON.parse(data);
  }
}
