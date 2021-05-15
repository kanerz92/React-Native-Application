import React, { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { NavigationActions } from 'react-navigation';

import Navigator from './Navigator';

const NavigationContainer = props => {
  const navReference = useRef();
  const isAuthenticated = useSelector(state => !!state.auth.token);

  useEffect(() => {
    if (!isAuthenticated) {
      navReference.current.dispatch(
        NavigationActions.navigate({ routeName: 'Auth' })
      );
    }
  }, [isAuthenticated]);

  return <Navigator ref={navReference} />;
};

export default NavigationContainer;
