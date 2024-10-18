import sectionList from '../../components/contents/sectionList';
import IAppState from '../../interfaces/app/IAppState';
import appTypeEnum from './appTypeEnum';

const initData: IAppState = {
  activeMenu: sectionList.items[0],
  selfDiagnoseResult: { hasError: false, elementDiagnoseResults: [] },
  navigationAttempt: undefined,
  navigationConfirmation: undefined,
};

const init = Object.assign({}, initData);

const appState = (state, action: any) => {
  if (!state) {
    state = init;
  }
  const newState: IAppState = Object.assign({}, state);
  switch (action.type) {
    case appTypeEnum.setActiveMenu:
      newState.activeMenu = action.section;
      return newState;

    case appTypeEnum.setNavigationAttempt:
      newState.navigationAttempt = action.data;
      return newState;

    case appTypeEnum.setNavigationConfirmation:
      newState.navigationConfirmation = action.data;
      return newState;

    case appTypeEnum.setNotifications:
      newState.selfDiagnoseResult = action.data ?? [];
      return newState;
      
    default:
      return state;
  }
};

export default appState;
