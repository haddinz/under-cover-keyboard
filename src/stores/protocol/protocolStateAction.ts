import { protocolTypeEnum } from './protocolTypeEnum';

const setEditProtocolName = (data?: string) => ({
  type: protocolTypeEnum.setEditProtocolName, data,
});

const protocolStateAction = {
  setEditProtocolName,
};

export default protocolStateAction;
