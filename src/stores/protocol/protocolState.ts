import IProtocolState from '../../interfaces/protocol/IProtocolState';
import { protocolTypeEnum } from './protocolTypeEnum';

const initData: IProtocolState = {
  editProtocolName: undefined,
};

const init = Object.assign({}, initData);

const protocolState = (state, action: any) => {
  if (!state) {
    state = init;
  }
  const newState: IProtocolState = Object.assign({}, state);
  switch (action.type) {
    case protocolTypeEnum.setEditProtocolName:
      newState.editProtocolName = action.data;
      return newState;

    default:
      return state;
  }
};

export default protocolState;
