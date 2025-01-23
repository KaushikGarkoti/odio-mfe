import React, { createContext, useContext, useReducer } from "react";

const DataStateContext = createContext();
const DataDispatchContext = createContext();

const dataReducer = (state, action) => {
  switch (action.type) {
    case "ADD_GROUP_IDS":
      return { ...state, groupIds: [...state.groupIds, ...action.payload] };
    case "CLEAR_GROUP_IDS":
      return { ...state, groupIds: [] };
    default:
      return state;
  }
};

const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, { groupIds: [] });

  return (
    <DataStateContext.Provider value={state}>
      <DataDispatchContext.Provider value={dispatch}>
        {children}
      </DataDispatchContext.Provider>
    </DataStateContext.Provider>
  );
};

const useDataState = () => {
  const context = useContext(DataStateContext);
  if (context === undefined) {
    throw new Error("useDataState must be used within a DataProvider");
  }
  return context;
};

const useDataDispatch = () => {
  const context = useContext(DataDispatchContext);
  if (context === undefined) {
    throw new Error("useDataDispatch must be used within a DataProvider");
  }
  return context;
};

export { DataProvider, useDataState, useDataDispatch };
