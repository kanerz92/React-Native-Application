import React, { useState, useEffect, useCallback } from 'react';
import {
  Alert, 
  View,
  Text,
  FlatList,
  Button,
  Platform,
  ActivityIndicator,
  StyleSheet 
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';

import CustomButton from '../components/CustomButton';
import AssignmentItem from '../components/AssignmentItem';
import Colors from '../constants/Colors';
import * as assignmentsActions from '../store/actions/assignments';

const UserAssignmentsScreen = props => {
  const userAssignments = useSelector(state => state.assignments.userAssignments);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const loadAssignments = useCallback(async () => {
    setError(null);
    setRefreshing(true);
    try {
      await dispatch(assignmentsActions.fetchAssignments());
    } catch (err) {
      setError(err.message);
    }
    setRefreshing(false);
  }, [dispatch, setLoading, setError]);

  useEffect(() => {
    const willFocusSub = props.navigation.addListener(
      'willFocus',
      loadAssignments
    );

    return () => {
      willFocusSub.remove();
    };
  }, [loadAssignments]);

  useEffect(() => {
    setLoading(true);
    loadAssignments().then(() => {
      setLoading(false);
    });
  }, [dispatch, loadAssignments]);

  if (error) {
    return (
      <View style={styles.center}>
        <Text>An error occurred!</Text>
        <Button
          title="Try again"
          onPress={loadAssignments}
          color={Colors.first}
        />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.first} />
      </View>
    );
  }

  if (!loading && userAssignments.length === 0) {
    return (
      <View style={styles.center}>
        <Text>No assignments added. Lucky you!</Text>
      </View>
    );
  }
  
  const editAssignment = id => {
    props.navigation.navigate('EditAssignment', { assignmentId: id });
  };

  const deleter = id => {
    Alert.alert('Are you sure?', 'Do you really want to delete this item?', [
      { text: 'No', style: 'default' },
      {
        text: 'Yes',
        style: 'destructive',
        onPress: () => {
          dispatch(assignmentsActions.deleteAssignment(id));
        }
      }
    ]);
  };

  return (
    <FlatList
    onRefresh={loadAssignments}
      refreshing={refreshing}
      data={userAssignments}
      keyExtractor={item => item.id}
      renderItem={itemData => (
        <AssignmentItem
          title={itemData.item.title}
          dueDate={itemData.item.dueDate}
          description={itemData.item.description}
          onSelect={() => {
            editAssignment(itemData.item.id);
          }}
        >          
          <Button            
            color={Colors.first}
            title="Edit"
            onPress={() => {
              editAssignment(itemData.item.id);
            }}
          />
          <Button
            color={Colors.first}
            title="Delete"
            onPress={deleter.bind(this, itemData.item.id)}
          />          
        </AssignmentItem>
      )}
    />
  );
};

UserAssignmentsScreen.navigationOptions = navData => {
  return {
    headerTitle: 'Your Assignments',
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
    ),
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomButton}>
        <Item
          title="Add"
          iconName={Platform.OS === 'android' ? 'md-add' : 'ios-add'}
          onPress={() => {
            navData.navigation.navigate('EditAssignment');
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
  }
});

export default UserAssignmentsScreen;
