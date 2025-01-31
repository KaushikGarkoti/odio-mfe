const initialState = {
    groupIds: [],
  };
  
  const wordCloudReducer = (state = initialState, action) => {
    switch (action.type) {
      case "ADD_GROUP_IDS":
        return { ...state, groupIds: [...state.groupIds, ...action.payload] };
      case "CLEAR_GROUP_IDS":
        return { ...state, groupIds: [] };
      default:
        return state;
    }
  };
  
  export default wordCloudReducer;
  