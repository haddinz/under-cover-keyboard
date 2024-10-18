import React from 'react';
import PcrSection from '../../../../models/pcrProfile/PcrSection';
import FmlxIcon from '../../../icon/FmlxIcon';
import { StampedeButton, StampedeTooltip } from '../../../FmlxUi';

const SectionAction: React.FC<{
  sectionArr: PcrSection[],
  section: PcrSection,
  move(s: PcrSection, right: boolean): any,
  addSection(s: PcrSection): any,
  removeSection(s: PcrSection): any,
  readOnly: boolean,
}> = function ({ sectionArr, section, addSection, removeSection, move, readOnly }) {
  const canRemove = !section.isDefault;
  const canAdd = section.isDefault;
  const leftMoveEnabled = sectionArr[0] !== section;
  const rightMoveEnabled = sectionArr[sectionArr.length - 1] !== section;
  const [showAction, setShowAction] = React.useState(false);
  const onMouseOver = () => {
    setShowAction(true);
  };
  const onMouseOut = () => {
    setShowAction(false);
  };
  return (
    <div>
      <div className="protocol-editor-section-header-order">
        {!readOnly && (
          <>
            <StampedeButton
              icon={<FmlxIcon name="ChevronLeft" fontSize="xs" />}
              onClick={() => move(section, false)}
              onlyIcon
              size="xs"
              disabled={!leftMoveEnabled}
            />
            <StampedeButton
              icon={<FmlxIcon name="ChevronRight" fontSize="xs" />}
              onClick={() => move(section, true)}
              onlyIcon
              size="xs"
              disabled={!rightMoveEnabled}
            />
          </>
        )}
      </div>
      {!readOnly && (
        <div
          className="protocol-editor-section-header-action px-1"
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          onFocus={onMouseOver}
          onBlur={onMouseOut}
        >
          <div style={{ visibility: showAction ? 'visible' : 'hidden' }}>
            {canAdd && (
              <StampedeTooltip title="Add this section">
                <div>
                  <StampedeButton
                    icon={<FmlxIcon name="AddCircle" fontSize="xs" customColor="#313131" />}
                    onClick={() => addSection(section)}
                    onlyIcon
                  />
                </div>
              </StampedeTooltip>
            )}
            {canRemove && (
              <StampedeTooltip title="Remove this section">
                <div>
                  <StampedeButton
                    icon={<FmlxIcon name="CancelCircle" fontSize="xs" customColor="#FF5252" />}
                    onClick={() => removeSection(section)}
                    onlyIcon
                  />
                </div>
              </StampedeTooltip>
            )}
          </div>
        </div>
      )}
      <div className="px-5">
        {section.label}
      </div>
    </div>
  );
};
export default SectionAction;
