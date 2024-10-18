import { SectionEnum } from '../../enums/SectionEnum';
import ISection from '../../interfaces/ISection';

const ALL_ITEMS: ISection[] = [
  {
    label: 'User',
    titleLabel: 'User',
    code: SectionEnum.User,
    icon: 'Users',
  },
  {
    label: 'Dashboard',
    titleLabel: 'Dashboard',
    code: SectionEnum.Dashboard,
    icon: 'Dashboard',
  },
  {
    label: 'Manual',
    titleLabel: 'Manual',
    code: SectionEnum.ManualControl,
    icon: 'ManualProfile',
  },
  {
    label: 'Explorer',
    titleLabel: 'Explorer',
    code: SectionEnum.ProtocolExplorer,
    icon: 'Explorer',
  },
  {
    label: 'Settings',
    titleLabel: 'Settings',
    code: SectionEnum.ProtocolSetting,
    icon: 'Editor',
  },
  {
    label: 'Reports',
    titleLabel: 'Reports',
    code: SectionEnum.ReportExplorer,
    icon: 'Report',
  },

  // IGNORE FROM SIDEBAR
  {
    label: 'Stampede',
    titleLabel: 'Stampede',
    code: SectionEnum.Stampede,
    icon: 'Stampede',
    ignoredSidebar: true,
  },
];

const items: ISection[] = ALL_ITEMS;

const notImplemented: ISection = {
  label: 'Not Implemented',
  code: SectionEnum.NotImplemented,
  icon: 'Archive',
};
const getSection = (code: SectionEnum) : ISection | undefined => {
  return ALL_ITEMS.find((item) => item.code === code);
};

const sectionList = {
  items,
  notImplemented,
  getSection,
};

export default sectionList;
