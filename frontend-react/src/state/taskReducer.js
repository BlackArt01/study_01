export const initialState = {
  tasks: [],
  loading: false,
  error: null,
  editingTask: null
};

export function taskReducer(state, action) {
  switch (action.type) {
    case 'LOADING_START':
      return { ...state, loading: true, error: null };

    case 'LOADING_END':
      return { ...state, loading: false };

    case 'SET_TASKS':
      return { ...state, tasks: action.tasks };

    case 'ERROR':
      return { ...state, error: action.error };

    case 'EDIT_START':
      return { ...state, editingTask: action.task };

    case 'EDIT_END':
      return { ...state, editingTask: null };

    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}
