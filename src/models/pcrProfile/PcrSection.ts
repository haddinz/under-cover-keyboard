import PcrSectionType from './PcrSectionType';

let ViewID = 1;

export default abstract class PcrSection {
  public keyOrder: number;
  public numberOfCycle: number;
  public isDefault: boolean;
  public enabled = true;
  private viewID: number;
  constructor(public label: string, public readonly type: PcrSectionType) {
    this.updateViewID();
  }

  public get id() { return this.viewID; }
  abstract tooltipString(): string;
  abstract isValid(): boolean;

  /**
   * This method must be called after instance creation/cloning for rendering purpose
   */
  protected updateViewID() {
    this.viewID = ViewID;
    if (ViewID > 9999999) {
      ViewID = 1;
    }
    ViewID += 1;
  }
}
