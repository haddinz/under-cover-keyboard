import React from 'react';
import { IconButton, SvgIcon } from '@mui/material';
import BrokenImageOutlinedIcon from '@mui/icons-material/BrokenImageOutlined';
import Icons from '../../_assets/icons';
import './FmlxIcon.scss';

const FmlxIcon: React.FC<{
  name: keyof typeof Icons,
  id?: string,
  customColor?: string,
  fontSize?: 'xs' | 'sm' | 'md' | 'lg'
}> = function FmlxIcon({ id, name, customColor, fontSize }) {
  return <IconEl name={name} id={id} customColor={customColor} size={fontSize} />
};

const IconEl: React.FC<{
  name: keyof typeof Icons,
  id?: string,
  customColor?: string,
  size?: string,

}> = function IconEl({ id, name, customColor, size }) {
  const Icon = Icons[name] ?? BrokenImageOutlinedIcon;
  if (size) {
    return (
      <SvgIcon className={`${size}`}>
        <Icon
          id={`${id}-${name}`}
          className="fmlx-icon"
          fill={customColor}
        />
      </SvgIcon>
    );
  }
  return (
    <SvgIcon className={`${size}`}>
      <Icon
        id={`${id}-${name}`}
        className="fmlx-icon"
        fill={customColor}
      />
    </SvgIcon>
  );
};

IconEl.defaultProps = {
  id: 'fmlx-icon',
  customColor: '',
  size: '',
};
FmlxIcon.defaultProps = {
  id: 'fmlx-icon',
  customColor: '',
  fontSize: 'md',
};

// FmlxIcon.Type = Type;
// FmlxIcon.Variant = Variant;

export default FmlxIcon;
