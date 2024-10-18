import DashboardTabMode from '../components/contents/dashboard/DashboardTabMode';
import sectionList from '../components/contents/sectionList';
import { SectionEnum } from '../enums/SectionEnum';
import ISection from '../interfaces/ISection';

export default class ClientStoredData {
  activeMenu = sectionList.items.find((s) => s.code === SectionEnum.Dashboard) as ISection;
  dashboardMode = DashboardTabMode.ModeCamera;
}
