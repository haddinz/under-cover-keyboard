import 'reflect-metadata';
import { injectable } from 'inversify';
import CustomEventHandler from '../helper/CustomEventHandler';

@injectable()
export default class UIEventService {
  private readonly _onDocumentClick: CustomEventHandler<MouseEvent> = new CustomEventHandler();
  private readonly _onResize: CustomEventHandler<UIEvent> = new CustomEventHandler();
  public get onDocumentClick() { return this._onDocumentClick.source; }
  public get onResize() { return this._onResize.source; }
  initialize = () => {
    document.onclick = this.handleDocumentOnClick;
    window.onresize = this.handleOnResize;
  }
  private handleDocumentOnClick = (e: MouseEvent) => {
    this._onDocumentClick.invoke(e);
  }
  private handleOnResize = (e: UIEvent) => {
    this._onResize.invoke(e);
  }
}
