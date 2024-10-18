import { ProtocolFileState } from '../../enums/ProtocolFileState';
import ArrayHelper from '../../helper/ArrayHelper';
import NumberHelper from '../../helper/NumberHelper';
import StringHelper from '../../helper/StringHelper';
import ExtractionSection from '../pcrProfile/ExtractionSection';
import HotStartSection from '../pcrProfile/HotStartSection';
import MeltCurveSection from '../pcrProfile/MeltCurveSection';
import PcrSection from '../pcrProfile/PcrSection';
import PcrSectionKey from '../pcrProfile/PcrSectionKey';
import PcrSectionType from '../pcrProfile/PcrSectionType';
import PrimerMixingSection from '../pcrProfile/PrimerMixingSection';
import ThermoCycleSection from '../pcrProfile/ThermoCycleSection';

const InvalidCharacters = ['<', '>', ':', '"', '/', '\\', '|', '?', '*'];

export default class ProtocolModel {
  identifier: string;
  name: string;
  note: string;
  created: string;
  updated: string;
  // Map object needs special parsing when converting to JSON string
  sections: Map<PcrSectionKey, PcrSection>;
  state: ProtocolFileState;
  assayType: string;

  private constructor() {
    this.sections = new Map();
  }

  public getEnabledSectionsCount = () => {
    return this.sectionArray.filter((s) => s.enabled).length;
  }

  public get sectionArray() {
    return Array.from(this.sections).map((element) => element[1]);
  }
  public get sectionEntries() {
    return Array.from(this.sections.entries());
  }
  public get hasPcr() {
    return this.sectionExist(PcrSectionType.Pcr);
  }
  public get hasMeltCurve() {
    return this.sectionExist(PcrSectionType.MeltCurve);
  }

  sectionExist = (type: PcrSectionType) => {
    return this.sectionArray.filter((s) => s.enabled && s.type === type).length > 0;
  }

  public isValid() {
    const nameOk = this.name && this.name.trim() !== '' && this.isNameValid();
    const sections = this.sectionArray;
    const allSectionValid = sections.filter((s) => {
      const isValid = s.isValid();
      console.info('IS VALID', s.label, isValid);
      return isValid;
    }).length === sections.length;
    return nameOk && allSectionValid;
  }

  private isNameValid() {
    const nameValid = !ArrayHelper.containsAny<string>(this.name.split(''), InvalidCharacters);
    return nameValid;
  }

  public removePcrSetting(setting: ThermoCycleSection) {
    const sections = this.sectionArray;
    for (let i = 0; i < sections.length; i += 1) {
      if (sections[i] === setting) {
        sections.splice(i, 1);
        break;
      }
    }
    this.updateSectionMap(sections);
  }

  getLastSectionByType = (type: PcrSectionType) => {
    const sections = this.sectionArray;
    const filters = sections.filter((s) => s.type === type);
    if (filters.length === 0) {
      return null;
    }
    return filters[filters.length - 1];
  }

  public removeSection(section: PcrSection) {
    for (const entry of Array.from(this.sections.entries())) {
      const [key, value] = entry;
      if (value === section) {
        this.sections.delete(key);
        break;
      }
    }
  }

  public copySection(section: PcrSection) {
    let newSection: PcrSection | undefined;
    let key: PcrSectionKey | undefined;
    if (section instanceof ThermoCycleSection) {
      newSection = section.clone();
      key = 'pcr';
    } else if (section instanceof PrimerMixingSection) {
      newSection = section.clone();
      key = 'primerMixing';
    } else if (section instanceof HotStartSection) {
      newSection = section.clone();
      key = 'hotStart';
    } else if (section instanceof MeltCurveSection) {
      newSection = section.clone();
      key = 'meltCurve';
    } else if (section instanceof ExtractionSection) {
      newSection = section.clone();
      key = 'extraction';
    }
    if (!newSection || !key) {
      console.warn('Cannot add section', section.type);
      return;
    }
    const sectionArr = this.sectionArray;
    const label = this.getLabelIndexed(newSection, sectionArr);
    newSection.label = label;
    newSection.isDefault = false;
    ArrayHelper.insert(sectionArr, newSection, sectionArr.indexOf(section) + 1);
    this.updateSectionMap(sectionArr);
  }

  private getLabelIndexed(section: PcrSection, arr: PcrSection[]) {
    const sameTypeNotDefault = arr.filter((s) => !s.isDefault && s.type === section.type);
    if (sameTypeNotDefault.length === 0) {
      return `${section.label} (1)`;
    }
    // get max index
    const numbers = sameTypeNotDefault.map((s) => {
      const { label } = s;
      
      // example label pattern: "Section Label (index)"
      const split = label.replaceAll(/[()]/g, '').split(' ');
      return parseInt(split[split.length - 1], 10);
    });
    return `${section.label} (${Math.max(...numbers) + 1})`;
  }

  public moveSection(setting: PcrSection, right: boolean) {
    const sections = this.sectionArray;
    ArrayHelper.swapElement(sections, setting, right);
    this.updateSectionMap(sections);
  }

  private updateSectionMap(sectionsArray: PcrSection[]) {
    this.sections.clear();
    let pcrIndex = 0;
    let primerMixingIndex = 0;
    let meltCurveIndex = 0;
    let extractionIndex = 0;
    let hotStartIndex = 0;
    for (let i = 0; i < sectionsArray.length; i += 1) {
      const element = sectionsArray[i];
      element.keyOrder = i;
      if (element instanceof ThermoCycleSection) {
        this.sections.set(`pcr${pcrIndex}`, element);
        pcrIndex += 1;
      } else if (element instanceof PrimerMixingSection) {
        this.sections.set(`primerMixing${primerMixingIndex}`, element);
        primerMixingIndex += 1;
      } else if (element instanceof HotStartSection) {
        this.sections.set(`hotStart${hotStartIndex}`, element);
        hotStartIndex += 1;
      } else if (element instanceof MeltCurveSection) {
        this.sections.set(`meltCurve${meltCurveIndex}`, element);
        meltCurveIndex += 1;
      } else if (element instanceof ExtractionSection) {
        this.sections.set(`extraction${extractionIndex}`, element);
        extractionIndex += 1;
      }
    }
  }
  public get pcrCycleNum() {
    const getCycleNum = (s: PcrSection) => {
      if (s instanceof ThermoCycleSection) {
        return s.numberOfCycle;
      }
      return 0;
    };
    const nums = this.sectionArray.filter((s) => s.enabled).map(getCycleNum);
    return NumberHelper.sum(...nums);
  }
  public get meltCurveCycleNum() {
    const getCycleNum = (s: PcrSection) => {
      if (s instanceof MeltCurveSection) {
        return s.numberOfCycle;
      }
      return 0;
    };
    const nums = this.sectionArray.filter((s) => s.enabled).map(getCycleNum);
    return Math.ceil(NumberHelper.sum(...nums));
  }
  public get totalCycleNum() {
    return this.pcrCycleNum + this.meltCurveCycleNum;
  }

  public toPlainJson() {
    const json = JSON.parse(JSON.stringify(this));
    json.sections = {};
    this.sections?.forEach((val, key) => {
      const camelCaseKey = StringHelper.lowerCaseFirstLetter(key);
      json.sections[camelCaseKey] = JSON.parse(JSON.stringify(val));
    });
    return json;
  }

  // Static Methods

  public static default() {
    return new ProtocolModel();
  }

  /**
   *
   * @param json JSON object, not string
   * @returns Parsed Pcr Profile
   */
  public static fromJson(json: any) {
    const { sections } = json;
    // sections will be parsed
    json.sections = undefined;
    const model: ProtocolModel = Object.assign(new ProtocolModel(), json);
    model.sections = new Map();

    if (sections) {
      for (const key in sections) {
        if (!Object.prototype.hasOwnProperty.call(sections, key)) {
          continue;
        }
        const element = JSON.parse(JSON.stringify(sections[key]));
        const { type } = element;
        let section: PcrSection | undefined;

        switch (type) {
          case PcrSectionType.PrimerMixing:
            section = Object.assign(new PrimerMixingSection(element.label), element);
            break;
          case PcrSectionType.HotStart:
            section = Object.assign(new HotStartSection(element.label), element);
            break;
          case PcrSectionType.Pcr:
            section = Object.assign(new ThermoCycleSection(element.label), element);
            break;
          case PcrSectionType.MeltCurve:
            section = Object.assign(new MeltCurveSection(element.label), element);
            break;
          case PcrSectionType.Extraction:
            section = Object.assign(new ExtractionSection(element.label), element);
            break;
          default:
            break;
        }
        if (section) {
          model.sections.set(key as any, section);
        }
      }
    }
    return model;
  }

  static clone(originalModel: ProtocolModel): ProtocolModel {
    const string = JSON.stringify(originalModel.toPlainJson());
    return ProtocolModel.fromJson(JSON.parse(string));
  }
}
