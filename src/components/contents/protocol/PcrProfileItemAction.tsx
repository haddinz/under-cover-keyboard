import { useInjection } from 'inversify-react';
import React, { CSSProperties } from 'react';
import ProtocolModel from '../../../models/protocol/ProtocolModel';
import DialogService from '../../../services/DialogService';
import { StampedeButton } from '../../FmlxUi';
import FmlxIcon from '../../icon/FmlxIcon';
import PositionFormat from '../../tooltip/PositionFormat';

const formatTooltipStyle = (style: CSSProperties, rect: DOMRect) => {
  style.width = 200;
  style.right = `calc(100vw - ${rect.x}px)`;
};

const tooltipPosFormat: PositionFormat = {
  bottom: (elRect: DOMRect, tooltipRect: DOMRect) => {
    return `calc(100vh - ${elRect.y}px - ${(tooltipRect.height / 2)}px - ${elRect.height / 2}px)`;
  },
};

const emptyFunc = () => {};

const PcrProfileItemAction: React.FC<{
  model: ProtocolModel,
  delete: () => any,
  edit: () => any,
}> = function PcrProfileItemAction({ model, delete: deleteRecord, edit }) {
  const dialog = useInjection(DialogService);
  const id = `pcr-profile-item-info-${model.name.replaceAll(' ', '-')}`;
  const onMouseOver = () => {
    const content = model.sectionArray.map((s) => {
      const fullTooltip = s.tooltipString();
      const split = fullTooltip.split('=');
      return <div key={s.id}><strong>{split[0]}</strong>={split[1]}</div>;
    });
    dialog.showToolTip(id, content, 'pcr-profile-tooltip bg-dark', formatTooltipStyle, tooltipPosFormat);
  };
  const onMouseOut = dialog.hideToopTip;
  return (
    <div className="flex-common">
      <div className="sequence-list-action">
        <div
          className="pcr-profile-item-info px-1 py-1"
          onFocus={emptyFunc}
          onBlur={emptyFunc}
          onMouseOver={onMouseOver}
          onMouseOut={onMouseOut}
          id={id}
        >
          <FmlxIcon name="InfoCircle" fontSize="sm" customColor="rgba(0, 89, 204, 1)" />
        </div>
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Edit" fontSize="xs" customColor="#414141" />}
          onClick={edit}
          size="sm"
        />
        <StampedeButton
          onlyIcon
          icon={<FmlxIcon name="Trash" fontSize="xs" customColor="#DB0000" />}
          size="sm"
          onClick={deleteRecord}
        />
      </div>
    </div>
  );
};

export default PcrProfileItemAction;
