import icons from '../_assets/icons';
import { SectionEnum } from '../enums/SectionEnum';

export default interface ISection {
    label: string;
    titleLabel?: string;
    code: SectionEnum;
    icon: keyof typeof icons;
    ignoredSidebar?: boolean;
}