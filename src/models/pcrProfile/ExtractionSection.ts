import PcrSection from './PcrSection';
import PcrSectionType from './PcrSectionType';

export default class ExtractionSection extends PcrSection {
  type = PcrSectionType.Extraction;
  constructor(label: string) {
    super(label, PcrSectionType.Extraction);
  }
  clone = (): ExtractionSection => {
    const json = JSON.stringify(this);
    const obj = JSON.parse(json);
    const result = Object.assign(new ExtractionSection(obj.label), obj);
    result.updateViewID();
    return result;
  }
  tooltipString(): string {
    return this.enabled ? `Extraction = (${this.numberOfCycle}X)` : 'Extraction = -';
  }
  isValid(): boolean {
    return true;
  }
}
