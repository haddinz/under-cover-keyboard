import { useInjection } from 'inversify-react';
import React, { useEffect, useRef, useState } from 'react';
import NotifTypeEnum from '../../enums/NotifTypeEnum';
import DialogService from '../../services/DialogService';
import FmlxUiToast from './FmlxUiToast';

const autoHideDuration = 5000;

const ToastContainer: React.FC = function ToastContainer() {
  const ref = useRef();
  const service = useInjection<DialogService>(DialogService);
  const [open, setOpen] = useState(false);
  const [notifType, setNotifType] = useState(NotifTypeEnum.Info);
  const [content, setContent] = useState('Information');

  const getVariant = () => {
    switch (notifType) {
      case NotifTypeEnum.Info: return 'info';
      case NotifTypeEnum.Success: return 'success';
      case NotifTypeEnum.Warn: return 'warning';
      case NotifTypeEnum.Error: return 'error';
      default:
        break;
    }
    return 'info';
  };
  const show = (message: string, type: NotifTypeEnum) => {
    setOpen(true);
    setContent(message);
    setNotifType(type);
    setTimeout(() => {
      if (open) {
        setOpen(false);
      }
    }, autoHideDuration);
  };
  const componentDidMount = () => {
    service.onShowAlert = show;
    service.onHideAlert = () => setOpen(false);
  };
  useEffect(() => {
    componentDidMount();
    if (open) {
      const timeout = setTimeout(() => {
        setOpen(false);
        clearTimeout(timeout);
      }, autoHideDuration);
      return () => clearTimeout(timeout);
    }
    return () => {};
  }, [open]);
  
  return (
    <FmlxUiToast
      ref={ref}
      content={content}
      onClick={() => setOpen(false)}
      open={open}
      variant={getVariant()}
    />
  );
};

export default ToastContainer;
