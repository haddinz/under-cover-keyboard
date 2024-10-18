import IAppState from './app/IAppState'; 
import IProtocolState from './protocol/IProtocolState';

interface IState {
  appState: IAppState,
  protocolState: IProtocolState,
}

export default IState;
