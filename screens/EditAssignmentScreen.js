import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
  Alert,
  KeyboardAvoidingView,
  ActivityIndicator
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import CustomButton from '../components/CustomButton';
import * as assignmentsActions from '../store/actions/assignments';
import Input from '../components/Input';
import Colors from '../constants/Colors';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_INPUT_UPDATE) {
    const updatedValues = {
      ...state.inputValues,
      [action.input]: action.value
    };
    const updatedValidities = {
      ...state.inputValidities,
      [action.input]: action.isValid
    };
    let updatedFormIsValid = true;
    for (const key in updatedValidities) {
      updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }
    return {
      formIsValid: updatedFormIsValid,
      inputValidities: updatedValidities,
      inputValues: updatedValues
    };
  }
  return state;
};

const EditAssignmentScreen = props => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();

  const assId = props.navigation.getParam('assignmentId');
  const editedAssignment = useSelector(state =>
    state.assignments.userAssignments.find(ass => ass.id === assId)
  );
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(formReducer, {
    inputValues: {
      title: editedAssignment ? editedAssignment.title : '',
      description: editedAssignment ? editedAssignment.description : '',
      dueDate: editedAssignment ? editedAssignment.dueDate : '',
    },
    inputValidities: {
      title: editedAssignment ? true : false,
      description: editedAssignment ? true : false,
      dueDate: editedAssignment ? true : false
    },
    formIsValid: editedAssignment ? true : false
  });

  useEffect(() => {
    if (error) {
      Alert.alert('An error occurred!', error, [{ text: 'Okay' }]);
    }
  }, [error]);

  const submiter = useCallback(async () => {
    if (!formState.formIsValid) {
      Alert.alert('Wrong input!', 'Please check the errors in the form.', [
        { text: 'Okay' }
      ]);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      if (editedAssignment) {
        await dispatch(
          assignmentsActions.updateAssignment(
            assId,
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.dueDate
          )
        );
      } else {
        await dispatch(
          assignmentsActions.createAssignment(
            formState.inputValues.title,
            formState.inputValues.description,
            formState.inputValues.dueDate
          )
        );
      }
      props.navigation.goBack();
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);

  }, [dispatch, assId, formState]);

  useEffect(() => {
    props.navigation.setParams({ submit: submiter });
  }, [submiter]);

  const inputChange = useCallback(
    (inputIdentifier, inputValue, inputValidity) => {
      dispatchFormState({
        type: FORM_INPUT_UPDATE,
        value: inputValue,
        isValid: inputValidity,
        input: inputIdentifier
      });
    },
    [dispatchFormState]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={Colors.first} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={50}
    >
      <ScrollView>
        <View style={styles.inputForm}>
          <Input
            id="title"
            label="Title"
            errorText="Please enter a valid title!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            returnKeyType="next"
            onInputChange={inputChange}
            initialValue={editedAssignment ? editedAssignment.title : ''}
            initiallyValid={!!editedAssignment}
            required
          />    
          <Input
            id="dueDate"
            label="Due Date"
            errorText="Please enter the assignment due date!"
            keyboardType="decimal-pad"
            returnKeyType="next"
            onInputChange={inputChange}
            initialValue={editedAssignment ? editedAssignment.dueDate : ''}
            initiallyValid={!!editedAssignment}
            required
            min={0.1}
          />
          <Input
            id="description"
            label="Description"
            errorText="Please enter a valid description!"
            keyboardType="default"
            autoCapitalize="sentences"
            autoCorrect
            onInputChange={inputChange}
            initialValue={editedAssignment ? editedAssignment.description : ''}
            initiallyValid={!!editedAssignment}
            required
            minLength={5}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

EditAssignmentScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('assignmentId')
      ? 'Edit Assignment'
      : 'Add Assignment',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={CustomButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  inputForm: {
    margin: 20
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export default EditAssignmentScreen;
