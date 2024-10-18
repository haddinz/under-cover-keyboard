import { combineReducers } from 'redux';
import appState from './app/appState';
import IState from '../interfaces/IState';
import protocolState from './protocol/protocolState';

type IRootState = {
  [key in keyof IState]: any;
}

const rootState: IRootState = {
  appState,
  protocolState,
};

export default combineReducers(rootState as any);
