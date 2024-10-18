import { SectionEnum } from '../../enums/SectionEnum';
import SelfDiagnoseResult from '../../models/SelfDiagnoseResult';
import ISection from '../ISection';

interface IAppState {
  activeMenu: ISection,
  selfDiagnoseResult?: SelfDiagnoseResult | null,
  navigationConfirmation?: Promise<boolean>,
  navigationAttempt?: { from: SectionEnum, to: SectionEnum },
}

export default IAppState;
