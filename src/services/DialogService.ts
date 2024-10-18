import React, { CSSProperties } from 'react';
import { injectable } from 'inversify';
import NotifTypeEnum from '../enums/NotifTypeEnum';
import ModalButtonProperty from '../models/ModalButtonProperty';
import PositionFormat from '../components/tooltip/PositionFormat';

@injectable()
export default class DialogService {
  // Toast
  public onShowAlert: ((message: string, varient: NotifTypeEnum) => any) | undefined;
  public onHideAlert: (() => any) | undefined;

  // ToolTip
  public onShowTooltip: ((refElementId: string | HTMLElement, content: any, className: string, adjustStyle: (s: CSSProperties, rect: DOMRect) => void, posFormat?: PositionFormat) => any) | undefined;
  public onHideTooltip: (() => any) | undefined;

  // Modal
  public onShowModal: (
    title: string,
    content: any,
    buttonProps: ModalButtonProperty,
    size: 'sm' | 'md' | 'lg' | 'xl',
    customFooter: any,
  ) => any | undefined;
  public onHideModal: () => any | undefined;

  private alert = (message: string, variant: NotifTypeEnum) => {
    if (!this.onShowAlert) {
      return;
    }
    this.onShowAlert(message, variant);
  }
  alertInfo = (message:string) => { this.alert(message, NotifTypeEnum.Info); }
  alertSuccess = (message:string) => { this.alert(message, NotifTypeEnum.Success); }
  alertWarning = (message:string) => { this.alert(message, NotifTypeEnum.Warn); }
  alertError = (payload: string | any) => {
    if (!payload) {
      this.alert('Unexpected Error', NotifTypeEnum.Error);
      return;
    }
    let content: any;
    if (typeof payload === 'string') {
      content = payload;
    } else if (payload.title) {
      content = payload.title;
    } else {
      content = payload.message ?? payload.Message ?? payload.errorMsg;
    }
    this.alert(content?.toString() ?? 'Unexpected Error', NotifTypeEnum.Error);
  }
  hideAlert = () => {
    if (this.onHideAlert) {
      this.onHideAlert();
    }
  }
  hideModal = () => {
    if (this.onHideModal) {
      this.onHideModal();
    }
  }
  showModalInfo = (title: string, content: any, primaryLabel: string) => {
    const buttonProp = new ModalButtonProperty();
    buttonProp.primary.label = primaryLabel;
    buttonProp.secondary.show = false;
    if (this.onShowModal) {
      this.onShowModal(title, content, buttonProp, 'md', null);
    }
  }
  showModalNoFooter = (
    title: string,
    content: any,
    onCancel: (() => any) | null = null,
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
  ) => {
    const footer = React.createElement('area', {});
    const noneType = NotifTypeEnum.None;
    return this.showModal(title, content, null, size, noneType, noneType, footer, onCancel);
  }
  showModal = (
    title: string,
    content: any,
    primaryLabel: string | null,
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
    primaryType = NotifTypeEnum.Info,
    secondaryType = NotifTypeEnum.Info,
    customFooter: any = null,
    onCancel: (() => any) | null = null,
  ) => {
    return new Promise<null>((resolve, reject) => {
      const primaryOnClick = () => resolve(null);
      const cancel = () => reject.bind(null, { canceled: true });
      const buttonProp = new ModalButtonProperty();

      if (primaryLabel) {
        // primary
        buttonProp.primary.label = primaryLabel;
        buttonProp.primary.type = primaryType;
        buttonProp.primary.onClick = primaryOnClick;

        // secondary
        buttonProp.secondary.type = secondaryType;
        buttonProp.secondary.variant = 'outline';
        buttonProp.secondary.onClick = cancel;
      }

      // close btn
      buttonProp.close.onClick = () => {
        if (onCancel) {
          onCancel();
        }
        cancel();
      };

      if (this.onShowModal) {
        this.onShowModal(title, content, buttonProp, size, customFooter);
      }
    });
  }
  showConfirm = (
    title: string,
    content: any,
    primaryLabel = 'YES',
    secondaryLabel = 'NO',
    size: 'sm' | 'md' | 'lg' | 'xl' = 'md',
    primaryType = NotifTypeEnum.Info,
    secondaryType = NotifTypeEnum.Info,
    customFooter: any = null,
  ) => {
    return new Promise<boolean>((resolve, reject) => {
      const primaryOnClick = () => resolve(true);
      const secondaryOnClick = () => resolve(false);
      const cancel = () => reject.bind(null, { canceled: true });

      const buttonProp = new ModalButtonProperty();

      // primary
      buttonProp.primary.label = primaryLabel;
      buttonProp.primary.type = primaryType;
      buttonProp.primary.onClick = primaryOnClick;

      // secondary
      buttonProp.secondary.label = secondaryLabel;
      buttonProp.secondary.type = secondaryType;
      buttonProp.secondary.onClick = secondaryOnClick;

      // close btn
      buttonProp.close.onClick = cancel;

      if (this.onShowModal) {
        this.onShowModal(title, content, buttonProp, size, customFooter);
      }
    });
  }

  showToolTip = (
    refElement: string | HTMLElement,
    content: any,
    className: string,
    formatStyle: (s: CSSProperties, rect: DOMRect) => void,
    posFormat?: PositionFormat,
  ) => {
    if (this.onShowTooltip) {
      this.onShowTooltip(refElement, content, className, formatStyle, posFormat);
    }
  }
  hideToopTip = () => {
    if (this.onHideTooltip) {
      this.onHideTooltip();
    }
  }
}
