import { SectionEnum } from '../../enums/SectionEnum';
import ISection from '../../interfaces/ISection';
import SelfDiagnoseResult from '../../models/SelfDiagnoseResult';
import appTypeEnum from './appTypeEnum';

const setActiveMenu = (section: ISection) => ({
  type: appTypeEnum.setActiveMenu, section,
});
const setNavigationAttempt = (data?: { from: SectionEnum, to: SectionEnum }) => ({
  type: appTypeEnum.setNavigationAttempt, data,
});
const setNavigationConfirmation = (data?: Promise<boolean>) => ({
  type: appTypeEnum.setNavigationConfirmation, data,
});
const setNotifications = (data: SelfDiagnoseResult | null) => ({
  type: appTypeEnum.setNotifications, data,
});

const appStateAction = {
  setActiveMenu,
  setNavigationConfirmation,
  setNavigationAttempt,
  setNotifications,
};

export default appStateAction;
