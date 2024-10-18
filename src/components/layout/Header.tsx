import React from 'react';
import { SectionEnum } from '../../enums/SectionEnum';
import sectionList from '../contents/sectionList';
import FmlxIcon from '../icon/FmlxIcon';
import './Header.scss';

const DEFAULT_TITLE = 'Control Panel';

type Props = {
  section: SectionEnum;
  content: any | undefined;
  customTitle?: any;
}

const Header: React.FC<Props> = function Header(props: Props) {
  const _section = sectionList.getSection(props.section);
  return (
    <header className="header row pt-1">
      <div className="col-sm-4">
        <div className="header-title">
          <div className="header-title-icon">
            <span className="me-2"><FmlxIcon fontSize="lg" name="Stampede" /></span>
            {props.customTitle ? props.customTitle : <span>{_section?.titleLabel ?? _section?.label ?? DEFAULT_TITLE}</span>}
          </div>
        </div>
      </div>
      <div className="col-sm-8 header-content">
        {props.content}
      </div>
    </header>

  );
};

Header.defaultProps = {
  customTitle: undefined,
};

export default Header;
