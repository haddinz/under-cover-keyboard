import HotStartSection from './HotStartSection';
import MeltCurveSection from './MeltCurveSection';
import MotorMovement from './MotorMovement';
import PcrSection from './PcrSection';
import PcrStep from './PcrStep';
import PrimerMixingSection from './PrimerMixingSection';
import ThermoCycleSection from './ThermoCycleSection';

type PcrKeySectionType<S1 extends string, S2 extends string> = `${S1}.${S2}`;
type PcrProfileField = keyof PcrSection | keyof PrimerMixingSection |
                       keyof HotStartSection | keyof ThermoCycleSection |
                       keyof MeltCurveSection |
                       PcrKeySectionType<'step1', keyof PcrStep> |
                       PcrKeySectionType<'step2', keyof PcrStep> |
                       PcrKeySectionType<'step1.motorMovement', keyof MotorMovement> |
                       PcrKeySectionType<'step2.motorMovement', keyof MotorMovement>;
export default PcrProfileField;