import PcrProfileField from '../../../models/pcrProfile/PcrProfileFields';
import PcrSectionKey from '../../../models/pcrProfile/PcrSectionKey';

type SectionFieldChange = (section: PcrSectionKey, path: PcrProfileField, val: any) => any;
export default SectionFieldChange;
