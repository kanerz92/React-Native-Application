import React from 'react';
import {
  View,
  Text,
  Platform,
  StyleSheet
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomButton from '../components/CustomButton';

const SettingsScreen = props => {
  

  return (
    <View style={styles.center}>
	<Text style={styles.text}>Not implemented yet</Text>
	</View>
  );
};

SettingsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Settings',
    headerLeft: (
      <HeaderButtons HeaderButtonComponent={CustomButton}>
        <Item
          title="Menu"
          iconName={Platform.OS === 'android' ? 'md-menu' : 'ios-menu'}
          onPress={() => {
            navData.navigation.toggleDrawer();
          }}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontFamily: 'open-sans-bold'
  }
});

export default SettingsScreen;
