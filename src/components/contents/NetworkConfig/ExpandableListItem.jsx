import React from 'react';
import PropTypes from 'prop-types';
import './NetworkConfiguration';
import { FmlxButton, FmlxIcon as CommonFmlxIcon, FmlxIcon } from 'fmlx-common-ui';
import { ExpandableItemType } from '../../../enums/networkConfigEnum';
import WiFiStrengthIcon from '../../component/WiFiStrength/WiFiStrengthIcon';

function ExpandableListItem({
  label,
  children,
  type,
  onForget,
  icon,
  onChevronRight,
  onSelect,
  wifiStrength,
  disabledChevronRight,
  isPasswordRequired,
  selectedItem,
}) {
  const toggleExpansion = (event) => {
    if (event.target.tagName === 'INPUT' || event.target.tagName === 'BUTTON') {
      return;
    }

    if (type === ExpandableItemType.EXPANABLE) {
      onSelect(selectedItem);
    }
  };

  return (
    <div
      className={`expandable-list-item ${selectedItem ? 'expanded' : ''}`}
      onClick={type === ExpandableItemType.EXPANABLE ? toggleExpansion : null}
      onKeyDown={null}
      role={type === ExpandableItemType.EXPANABLE ? 'button' : null}
      // eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
    >
      <div className="list-item-header">
        <div
          className={`clickable-area ${type === ExpandableItemType.NON_EXPANABLE ? 'disabled' : ''}`}
        >
          <span className="list-item-icon">
            {type === ExpandableItemType.NON_EXPANABLE
              ? icon
              : (
                <WiFiStrengthIcon strength={wifiStrength} isPasswordRequired={isPasswordRequired} />
              ) }
          </span>
          <span className="list-item-label">{label}</span>
        </div>

        {type === ExpandableItemType.NON_EXPANABLE && (
          <div className="list-with-chevron-button">
            <FmlxButton
              label="FORGET"
              onClick={onForget}
              variant={FmlxButton.Variant.OUTLINE}

            />
            <FmlxButton
              type={FmlxButton.Type.BASIC}
              variant={FmlxButton.Variant.PLAIN}
              onlyIcon
              icon={<CommonFmlxIcon name="ChevronRight" />}
              withTooltip={false}
              onClick={onChevronRight}
              disabled={disabledChevronRight}
            />
          </div>
        )}
      </div>

      {selectedItem && (
        // eslint-disable-next-line react/jsx-no-useless-fragment
        <>
          { children }
        </>

      )}

    </div>
  );
}

ExpandableListItem.defaultProps = {
  label: '',
  children: null,
  type: '',
  onForget: () => {},
  icon: null,
  onChevronRight: () => {},
  onSelect: null,
  wifiStrength: null,
  isPasswordRequired: false,
  disabledChevronRight: false,
  selectedItem: false,
};

ExpandableListItem.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  type: PropTypes.string,
  onForget: PropTypes.func,
  icon: PropTypes.node,
  onChevronRight: PropTypes.func,
  onSelect: PropTypes.func,
  wifiStrength: PropTypes.number,
  isPasswordRequired: PropTypes.bool,
  disabledChevronRight: PropTypes.bool,
  selectedItem: PropTypes.bool,
};

export default ExpandableListItem;
