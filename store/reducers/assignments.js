import {
  DELETE_ASSIGNMENT,
  CREATE_ASSIGNMENT,
  UPDATE_ASSIGNMENT,
  SET_ASSIGNMENTS
} from '../actions/assignments';
import Assignment from '../../models/assignment';

const initialState = {
  userAssignments: []
};

export default (state = initialState, action) => {
  switch (action.type) {
    case SET_ASSIGNMENTS:
      return {
        userAssignments: action.userAssignments
      };
    case CREATE_ASSIGNMENT:
      const newAssignment = new Assignment(
        action.assignmentData.id,
        action.assignmentData.ownerId,
        action.assignmentData.title,
        action.assignmentData.description,
        action.assignmentData.dueDate
      );
      return {
        ...state,
        userAssignments: state.userAssignments.concat(newAssignment)
      };
    case UPDATE_ASSIGNMENT:
      const assignmentIndex = state.userAssignments.findIndex(
        ass => ass.id === action.aid
      );
      const updatedAssignment = new Assignment(
        action.aid,
        state.userAssignments[assignmentIndex].ownerId,
        action.assignmentData.title,
        action.assignmentData.description,
        action.assignmentData.dueDate
      );
      const updatedUserAssignments = [...state.userAssignments];
      updatedUserAssignments[assignmentIndex] = updatedAssignment;
      return {
        ...state,
        userAssignments: updatedUserAssignments
      };
    case DELETE_ASSIGNMENT:
      return {
        ...state,
        userAssignments: state.userAssignments.filter(
          assignment => assignment.id !== action.aid
        )
      };
  }
  return state;
};
