import { useInjection } from 'inversify-react';
import React, { useEffect, useRef, useState } from 'react';
import UIEventService from '../../../../../services/UIEventService';

const activeClass = 'analytical-report-sub-content-option-active';
const disabledClass = 'analytical-report-sub-content-option-disabled';

const SubContentTitle: React.FC<{
  title: string,
  additionalDropdown: any,
  exportOptions: Record<string, () => any>,
  optionDisabled?: boolean,
}> = function SubContentTitle({ title, additionalDropdown, exportOptions, optionDisabled }) {
  const evtService = useInjection(UIEventService);
  const exportOptionWrapper = useRef() as React.MutableRefObject<HTMLDivElement>;
  const [openExpOption, setExportOption] = useState(false);
  const toggleExportOption = () => {
    setExportOption(!openExpOption);
  };
  const onDocClick = (e: MouseEvent) => {
    const { target } = e;
    if (!exportOptionWrapper.current) {
      return;
    }
    if (!exportOptionWrapper.current.contains(target as any)) {
      setExportOption(false);
    }
  };
  const onLoad = () => {
    evtService.onDocumentClick.add(`analytical-title-${title}`, onDocClick);
  };
  const onUnLoad = () => {
    evtService.onDocumentClick.remove(`analytical-title-${title}`);
  };
  useEffect(() => {
    onLoad();
    return () => onUnLoad();
  }, []);
  return (
    <div className="row disable-select">
      <div className="col-md-6 analytical-report-sub-content-title">{title}</div>
      <div className="col-md-6">
        <div className="analytical-report-sub-content-option flex-common-x-end">
          {additionalDropdown !== null && additionalDropdown !== undefined ? additionalDropdown : null}
          <div ref={exportOptionWrapper} className="pos-relative">
            <div
              onClick={optionDisabled ? undefined : toggleExportOption}
              className={[
                'analytical-report-sub-content-option-export flex-common',
                openExpOption ? activeClass : '',
                optionDisabled ? disabledClass : '',
              ].join(' ')}
            >
              <b>···</b>
            </div>
            {
              !optionDisabled && openExpOption &&
              (
                <div className="analytical-report-sub-content-option-dropdown">
                  {Object.keys(exportOptions).map((label) => {
                    const onClick = exportOptions[label];
                    return (
                      <div
                        key={`export-option-item-${title}-${label}`}
                        onClick={() => onClick()}
                        className="px-3 analytical-report-sub-content-option-dropdown-item flex-common"
                      >
                        {label}
                      </div>
                    );
                  })}
                  {/* <div className="px-3 analytical-report-sub-content-option-dropdown-item flex-common">
                    Export Graph
                  </div>
                  <div className="px-3 analytical-report-sub-content-option-dropdown-item flex-common">
                    Export Max Peak
                  </div>
                  <div className="px-3 analytical-report-sub-content-option-dropdown-item flex-common">
                    Export Average Peak
                  </div> */}
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

SubContentTitle.defaultProps = {
  optionDisabled: false,
};

export default SubContentTitle;
