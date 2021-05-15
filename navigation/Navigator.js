import React from 'react';
import {
  createStackNavigator,
  createDrawerNavigator,
  createSwitchNavigator,
  createAppContainer,
  DrawerItems
} from 'react-navigation';
import { Platform, SafeAreaView, Button, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch } from 'react-redux';

import SettingsScreen from '../screens/SettingsScreen';
import UserAssignmentsScreen from '../screens/UserAssignmentsScreen';
import EditAssignmentScreen from '../screens/EditAssignmentScreen';
import AuthScreen from '../screens/AuthScreen';
import StartupScreen from '../screens/StartupScreen';
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';

const navOptions = {
  headerStyle: {
    backgroundColor: Platform.OS === 'android' ? Colors.first : ''
  },
  headerTitleStyle: {
    fontFamily: 'open-sans-bold'
  },
  headerBackTitleStyle: {
    fontFamily: 'open-sans'
  },
  headerTintColor: Platform.OS === 'android' ? 'white' : Colors.first
};

const SettingsNavigator = createStackNavigator(
  {
    Setup: SettingsScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-settings' : 'ios-settings'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: navOptions
  }
);

const AddAssignment = createStackNavigator(
  {
    UserAssignments: UserAssignmentsScreen,
    EditAssignment: EditAssignmentScreen
  },
  {
    navigationOptions: {
      drawerIcon: drawerConfig => (
        <Ionicons
          name={Platform.OS === 'android' ? 'md-list' : 'ios-list'}
          size={23}
          color={drawerConfig.tintColor}
        />
      )
    },
    defaultNavigationOptions: navOptions
  }
);

const Navigator = createDrawerNavigator(
  {
    Assignments: AddAssignment,
    Settings: SettingsNavigator,
  },
  {
    contentOptions: {
      activeTintColor: Colors.first
    },
    contentComponent: props => {
      const dispatch = useDispatch();
      return (
        <View style={{ flex: 1, paddingTop: 20 }}>
          <SafeAreaView forceInset={{ top: 'always', horizontal: 'never' }}>
            <DrawerItems {...props} />
            <Button
              title="Logout"
              color={Colors.first}
              onPress={() => {
                dispatch(authActions.logout());
              }}
            />
          </SafeAreaView>
        </View>
      );
    }
  }
);

const AuthenticateNavigator = createStackNavigator(
  {
    Auth: AuthScreen
  },
  {
    defaultNavigationOptions: navOptions
  }
);

const MainNavigator = createSwitchNavigator({
  Startup: StartupScreen,
  Auth: AuthenticateNavigator,
  Main: Navigator
});

export default createAppContainer(MainNavigator);
