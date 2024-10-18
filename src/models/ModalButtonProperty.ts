import NotifTypeEnum from '../enums/NotifTypeEnum';

export default class ModalButtonProperty {
  primary: ButtonProperty;
  secondary: ButtonProperty;
  close: ButtonProperty;

  constructor() {
    this.primary = new ButtonProperty('YES');
    this.secondary = new ButtonProperty('CANCEL');
    this.close = new ButtonProperty('X');
  }
}

class ButtonProperty {
  label: string;
  show = true;
  closeOnClick = true;
  type: NotifTypeEnum = NotifTypeEnum.Info;
  variant: 'contain' | 'outline' | 'plain' | 'action-button' = 'contain';
  onClick?: () => any;

  constructor(label: string, onClick?: () => any | undefined) {
    this.label = label;
    this.onClick = onClick;
  }
}
