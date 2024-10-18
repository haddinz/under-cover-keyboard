import React from 'react';
import { Provider } from 'inversify-react';
import * as ReactDOM from 'react-dom';
import * as reactRedux from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension/index';
import thunk from 'redux-thunk';
import App from './App';
import './index.scss';
import { dependencyContainer } from './inversify.config';
import registerServiceWorker from './registerServiceWorker';
import rootStore from './stores';

const store = process.env.NODE_ENV === 'production' ?
  createStore(rootStore, applyMiddleware(thunk)) :
  createStore(rootStore, composeWithDevTools(applyMiddleware(thunk)));

ReactDOM.render(
  <reactRedux.Provider store={store}>
    <Provider container={dependencyContainer}>
      <App />
    </Provider>
  </reactRedux.Provider>,
  document.getElementById('root'));

registerServiceWorker();
