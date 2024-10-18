import { useInjection } from 'inversify-react';
import React, { useEffect, useState } from 'react';
import NotifTypeEnum from '../../enums/NotifTypeEnum';
import { invokeLater } from '../../helper/EventHelper';
import ModalButtonProperty from '../../models/ModalButtonProperty';
import DialogService from '../../services/DialogService';
import { StampedeButton, StampedeModal } from '../FmlxUi';
import './ModalContainer.scss';

const DefaultOnClicks = {
  primary: () => {},
  secondary: () => {},
};
const OnClicks = {
  primary: DefaultOnClicks.primary,
  secondary: DefaultOnClicks.secondary,
};
type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

const ModalContainer: React.FC = function ModalContainer() {
  const service = useInjection(DialogService);

  const [size, setSize] = useState<ModalSize>('md');
  const [content, setContent] = useState<any>('');
  const [title, setTitle] = useState('Info');
  const [open, setOpen] = useState(false);
  const [buttonProps, setButtonProps] = useState(new ModalButtonProperty());
  const [customFooter, setCustomFooter] = useState<any>(null);

  const close = () => {
    OnClicks.primary = DefaultOnClicks.primary;
    OnClicks.secondary = DefaultOnClicks.secondary;
    setOpen(false);
  };
  const onSetOpen = (val: boolean) => {
    if (!val) {
      if (buttonProps.close?.onClick) {
        buttonProps.close?.onClick();
      }
    }
    setOpen(val);
  };
  const show = (
    requestTitle: string,
    requestContent: any,
    requestButtonProps: ModalButtonProperty,
    requestSize: ModalSize = 'md',
    footer = null,
  ) => {
    OnClicks.primary = () => {
      if (requestButtonProps.primary.onClick) {
        requestButtonProps.primary.onClick();
      }
      if (requestButtonProps.primary.closeOnClick) {
        close();
      }
    };
    OnClicks.secondary = () => {
      if (requestButtonProps.secondary.onClick) {
        requestButtonProps.secondary.onClick();
      }
      if (requestButtonProps.secondary.closeOnClick) {
        close();
      }
    };
    setButtonProps(requestButtonProps);
    setOpen(true);
    setTitle(requestTitle);
    setContent(requestContent);
    setSize(requestSize);
    setCustomFooter(footer);
    if (requestButtonProps.primary?.type !== NotifTypeEnum.Error) {
      invokeLater(focusOnPrimaryButton, 300);
    }
  };

  const focusOnPrimaryButton = () => {
    const btnWrapper = document.getElementById('modal-btn-wrapper');
    if (!btnWrapper) {
      return;
    }
    const primaryBtnWrappers = btnWrapper.getElementsByClassName('fmlx-button primary');
    if (!primaryBtnWrappers || primaryBtnWrappers.length === 0) {
      return;
    }
    const primaryBtnWrapper = primaryBtnWrappers[0];
    const btns = primaryBtnWrapper.getElementsByTagName('button');
    if (btns?.length > 0 && btns[0] instanceof HTMLButtonElement) {
      btns[0].focus();
    }
  };

  const getButtonType = (mode: NotifTypeEnum) => {
    switch (mode) {
      case NotifTypeEnum.Info:
        return 'primary';
      case NotifTypeEnum.Error:
        return 'danger';
      default:
        break;
    }
    return 'basic';
  };

  const componentDidMount = () => {
    service.onShowModal = show;
    service.onHideModal = () => onSetOpen(false);
  };
  useEffect(() => {
    componentDidMount();
    return () => {};
  }, []);

  const { secondary, primary } = buttonProps;
  return (
    <StampedeModal
      title={title}
      open={open}
      size={size}
      onCloseClick={() => setOpen(false)}
      disableBlur
      primaryButton={undefined}
      secondaryButton={undefined}
      tertiaryButton={undefined}
      customFooter={
        customFooter ??
        (
          <div className="modal-custom-footer d-block py-4 pe-4">
            <div id="modal-btn-wrapper">
              {
                buttonProps.secondary.show &&
                (
                  <StampedeButton
                    type={getButtonType(secondary.type)}
                    variant={secondary.variant}
                    label={secondary.label}
                    onClick={OnClicks.secondary}
                  />
                )
              }
              {
                buttonProps.primary.show &&
                (
                  <StampedeButton
                    type={getButtonType(primary.type)}
                    variant={primary.variant}
                    label={primary.label}
                    onClick={OnClicks.primary}
                  />
                )
              }
            </div>
          </div>
        )
      }
    >
      {content}
    </StampedeModal>
  );
};

export default ModalContainer;
