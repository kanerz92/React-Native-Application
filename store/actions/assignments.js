import Assignment from '../../models/assignment';

export const DELETE_ASSIGNMENT = 'DELETE_ASSIGNMENT';
export const CREATE_ASSIGNMENT = 'CREATE_ASSIGNMENT';
export const UPDATE_ASSIGNMENT = 'UPDATE_ASSIGNMENT';
export const SET_ASSIGNMENTS = 'SET_ASSIGNMENTS';

export const fetchAssignments = () => {
  return async (dispatch, getState) => {
    const userId = getState().auth.userId;
    try {
      const response = await fetch(
        'https://rn-app-scheduler.firebaseio.com/assignments.json'
      );

      if (!response.ok) {
        throw new Error('Error: Something went wrong');
      }

      const resData = await response.json();
      const loadedAssignments = [];

      for (const key in resData) {
        loadedAssignments.push(
          new Assignment(
            key,
            resData[key].ownerId,
            resData[key].title,
            resData[key].description,
            resData[key].dueDate
          )
        );
      }

      dispatch({
        type: SET_ASSIGNMENTS,
        assignments: loadedAssignments,
        userAssignments: loadedAssignments.filter(ass => ass.ownerId === userId)
      });
    } catch (err) {
      throw err;
    }
  };
};

export const deleteAssignment = assignmentId => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-app-scheduler.firebaseio.com/assignments/${assignmentId}.json?auth=${token}`,
      {
        method: 'DELETE'
      }
    );

    if (!response.ok) {
      throw new Error('Error: Something went wrong');
    }
    dispatch({ type: DELETE_ASSIGNMENT, aid: assignmentId });
  };
};

export const createAssignment = (title, description, dueDate) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const userId = getState().auth.userId;
    const response = await fetch(
      `https://rn-app-scheduler.firebaseio.com/assignments.json?auth=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          dueDate,
          ownerId: userId
        })
      }
    );

    const resData = await response.json();

    dispatch({
      type: CREATE_ASSIGNMENT,
      assignmentData: {
        id: resData.name,
        title,
        description,
        dueDate,
        ownerId: userId
      }
    });
  };
};

export const updateAssignment = (id, title, description, dueDate) => {
  return async (dispatch, getState) => {
    const token = getState().auth.token;
    const response = await fetch(
      `https://rn-app-scheduler.firebaseio.com/assignments/${id}.json?auth=${token}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description,
          dueDate
        })
      }
    );

    if (!response.ok) {
      throw new Error('Error: Something went wrong');
    }

    dispatch({
      type: UPDATE_ASSIGNMENT,
      aid: id,
      assignmentData: {
        title,
        description,
        dueDate
      }
    });
  };
};
