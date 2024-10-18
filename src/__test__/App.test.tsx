import { render, screen } from '@testing-library/react';
import * as inversify from 'inversify-react';
import { Provider } from 'react-redux';
import { applyMiddleware, bindActionCreators, createStore } from 'redux';
import thunk from 'redux-thunk';
import App from '../App';
import sectionList from '../components/contents/sectionList';
import { SectionEnum } from '../enums/SectionEnum';
import appStateAction from '../stores/app/appStateAction';
import rootStore from '../stores/index';
import { dependencyContainerTest } from './inversify-test.config';

const store = createStore(rootStore, applyMiddleware(thunk));
const action = bindActionCreators(appStateAction, store.dispatch);

describe('App Test', () => {
  it('Test app', async () => {
    jest.useFakeTimers();
    render((
      <inversify.Provider container={dependencyContainerTest}>
        <Provider store={store}>
          <App />
        </Provider>
      </inversify.Provider>
    ));
    jest.setTimeout(3000);
    jest.runAllTimers();
    
    const section = SectionEnum.ManualControl;
    action.setActiveMenu(sectionList.getSection(section));

    expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('app-footer')).toBeInTheDocument();
    expect(screen.getByTestId(`section-${section}`)).toBeInTheDocument();
    expect(screen.getByTestId('container-app')).toBeInTheDocument();
    
    jest.clearAllTimers();
  });
});
