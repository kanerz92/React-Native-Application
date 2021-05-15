import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TouchableNativeFeedback,
  Platform
} from 'react-native';

import Template from '../components/Template';

const AssignmentItem = props => {
  let TouchableCmp = TouchableOpacity;

  if (Platform.OS === 'android' && Platform.Version >= 21) {
    TouchableCmp = TouchableNativeFeedback;
  }

  return (
    <Template style={styles.assignment}>
      <View style={styles.touched}>
        <TouchableCmp onPress={props.onSelect} useForeground>
          <View>
            <View style={styles.details}>
              <Text style={styles.title}>{props.title}</Text>
              <Text style={styles.description}>Due Date: {props.dueDate}</Text>
              <Text style={styles.description}>Description: {props.description}</Text>
            </View>
            <View style={styles.actions}>
              {props.children}
            </View>
          </View>
        </TouchableCmp>
      </View>
    </Template>
  );
};

const styles = StyleSheet.create({
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '23%',
    paddingHorizontal: 20
  },
  assignment: {
    height: 180,
    margin: 20
  },
  details: {
    alignItems: 'center',
    height: '30%',
    padding: 10
  }, 
  description: {
    fontFamily: 'open-sans',
    fontSize: 14
  },
  title: {
    fontFamily: 'open-sans-bold',
    fontSize: 18,
    marginVertical: 2
  },
  touched: {
    borderRadius: 10,
    overflow: 'hidden'
  }  
});

export default AssignmentItem;
