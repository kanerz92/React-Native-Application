import React, { useState } from 'react';
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { AppLoading } from 'expo';
import * as Font from 'expo-font';
import Thunk from 'redux-thunk';

import assignmentsReducer from './store/reducers/assignments';
import authReducer from './store/reducers/auth';
import NavigationContainer from './navigation/NavigationContainer';

const rooter = combineReducers({
  assignments: assignmentsReducer,
  auth: authReducer
});

const store = createStore(rooter, applyMiddleware(Thunk));

const getFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  });
};

export default function App() {
  const [fontLoad, setFontLoad] = useState(false);

  if (!fontLoad) {
    return (
      <AppLoading
        startAsync={getFonts}
        onFinish={() => {
          setFontLoad(true);
        }}
      />
    );
  }
  return (
    <Provider store={store}>
      <NavigationContainer />
    </Provider>
  );
}
