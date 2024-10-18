import React, { useRef, useState } from 'react';
import { blankFunction, invokeLater } from '../../helper/EventHelper';
import './ToolTipComponent.scss';

const ToolTipComponent: React.FC<{
  tooltip: any,
  children: any,
  disabled: boolean,
  position? : 'start' | 'end',
}> = function ToolTipComponent({ tooltip, children, disabled, position }) {
  const ref = useRef<HTMLDivElement>();
  const [showTooltip, setShowtooltip] = useState(false);
  const diplayTooltip = () => {
    if (disabled) {
      return;
    }
    setShowtooltip(true);
    invokeLater(adjustPosition, 200);
  };
  const hideTooltip = () => {
    if (disabled) {
      return;
    }
    setShowtooltip(false);
  };
  const adjustPosition = () => {
    if (!ref.current) {
      return;
    }
    if (position === 'start') {
      ref.current.style.left = '0';
      ref.current.style.opacity = '100';
      return;
    }
    if (position === 'end') {
      //
      return;
    }
    const left = ref.current.clientWidth / 2;
    ref.current.style.left = `calc(50% - ${left}px)`;
    ref.current.style.opacity = '100';
  };
  return (
    <div
      className="tooltip-wrapper"
      onMouseOver={diplayTooltip}
      onFocus={blankFunction}
      onBlur={blankFunction}
      onMouseOut={hideTooltip}
    >
      {children}
      {showTooltip && !disabled &&
      (
        <div ref={ref as any} className="tooltip-content">
          <div>
            {typeof tooltip === 'string' ? <div className="tooltip-label-wrapper flex-common px-2"><span className="tooltip-label no-wrap ">{tooltip}</span></div> : tooltip}
          </div>
        </div>
      )}
    </div>
  );
};

ToolTipComponent.defaultProps = {
  position: undefined,
};

export default ToolTipComponent;
