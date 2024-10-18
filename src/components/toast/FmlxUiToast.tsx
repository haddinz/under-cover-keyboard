import React from 'react';
import { FmlxToast } from 'fmlx-common-ui';

type FmlxToastPropTypes = {
  ref: any,
  title?: string,
  buttonLabel?: string,
  open?: boolean,
  content?: string,
  variant?: 'info' | 'success' | 'warning' | 'error',
  placement?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right',
  useActionButton?: boolean,
  hideAction?: boolean,
  onClick?: () => any,
  id?: string,
};

const FmlxUiToast: React.FC<FmlxToastPropTypes> = function ({
  title,
  buttonLabel,
  open,
  content,
  variant,
  placement,
  useActionButton,
  hideAction,
  onClick,
  id,
  ref,
}) {
  return (
    <FmlxToast
      ref={ref}
      title={title}
      buttonLabel={buttonLabel}
      open={open}
      content={content}
      variant={variant}
      placement={placement}
      useActionButton={useActionButton}
      hideAction={hideAction}
      onClick={onClick}
      id={id}
    />
  );
};

FmlxUiToast.defaultProps = {
  title: '',
  buttonLabel: 'Label',
  open: false,
  content: '',
  variant: 'info',
  placement: 'top-center',
  useActionButton: false,
  hideAction: false,
  onClick: () => {},
  id: 'fmlx-toast',
};

export default FmlxUiToast;
