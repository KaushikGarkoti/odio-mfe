import {
  UPDATE_USER,
  DELETE_USER,
  ADD_USER,
  FILTER_USER,
  GET_USERS,
  RESET_FILTER,
  USER_NOT_FOUND,
  SET_USER_LOADER,
} from "../type";

const initialUserState = {
  loader: false,
  usersList: [
    {
      caller: "",
      designation: "",
      email: "",
      employeeId: "",
      firstName: "",
      id: "",
      lastName: "",
      manager: "",
      managerId: "",
      role: "",
      coe:""
    },
  ],
  users: [],
  filteredUserData: [],
};

const manageUserReducer = (state = initialUserState, action) => {
  if (action.type) {
    switch (action.type) {
      case SET_USER_LOADER:
        return {
          ...state,
          usersList: [],
          loader: true
        };
      case UPDATE_USER:
        return {
          ...state,
        };
      case DELETE_USER:
        return { ...state };
      case ADD_USER:
        return { ...state };
      case GET_USERS:
        return {
          ...state,
          usersList: action.payload,
          users: action.payload,
          loader: false,
        };
      case FILTER_USER: {
        let newList = [];
        let newData = [];
        state.usersList = state.users;
        if (action.payload.userEmployeeId) {
          newData = newData + `employeeId:${action.payload.userEmployeeId}` + "&";
          var len = action.payload.userEmployeeId.length;
          newList = state.usersList.filter(
            (t) =>
              t.employeeId.slice(0, len).toLowerCase() ==
              action.payload.userEmployeeId.toLowerCase()
          );
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.user) {
          var name = action.payload.user.value;
          newList = state.usersList.filter(
            (t) => t.lastName?t.firstName.includes(name.split(" ")[0])&&t.lastName.includes(name.split(" ")[1]):t.firstName.includes(name)
          );
          newData = newData + `${newList[0]?.lastName?`firstName=${name.split(" ")[0]},lastName=${name.split(" ")[1]}`:`firstName=${name},lastName=""`}` + "&";
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.manager != "") {
          newData = newData + `managerId=${action.payload.managerId}` + "&";
          newList = state.usersList.filter(
            (t) => t.manager === action.payload.manager
          );
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.role != "") {
          newData = newData + `role=${action.payload.role}` + "&";
          newList = state.usersList.filter(
            (t) => t.role === action.payload.role
          );
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.coe != "") {
          newData = newData + `coeId=${action.payload.userCoeId}` + "&";
          //let newCoeList = state.usersList.clientCoes.find((e)=> e.name === action.payload.coe)
          //const filterByTags = [{name: action.payload.coe} ];
          newList = state.usersList.filter((item) => {
            return (item.clientCoes.find((e)=>e.name ===action.payload.coe));
          })
          /* const filterByTags = [{name: action.payload.coe} ];
          const filterByTagSet = new Set(filterByTags);

          newList = state.usersList.filter((o) => 
            o.clientCoes.find((tag) => filterByTagSet.has(tag))
          ); */
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.designation != "") {
          newData = newData + `designation=${action.payload.designation}` + "&";
          newList = state.usersList.filter(
            (t) => t.designation === action.payload.designation
          );
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        if (action.payload.caller != "") {
          if (action.payload.caller === "Caller") {
            newData = newData + `isCaller=${true}` + "&";
            newList = state.usersList.filter((t) => t.caller === true);
          } else {
            newData = newData + `isCaller=${false}` + "&";
            newList = state.usersList.filter((t) => t.caller === false);
          }
          state.usersList = newList;
          state.filteredUserData = newData;
        }
        // if (
        //   action.payload.caller == "" &&
        //   action.payload.designation == "" &&
        //   action.payload.role == "" &&
        //   !action.payload.user &&
        //   !action.payload.employeeId &&
        //   action.payload.manager != ""
        // ) {
        //   newList = state.users;
        // }
        if (action.payload.userEmployeeId === "" && action.payload.user === ""
        && action.payload.manager === ""
        && action.payload.role === ""
        && action.payload.coe === ""
        && action.payload.designation === ""
        && action.payload.caller === "" ){
         newList = state.users
       }
        return {
          ...state,
          usersList: newList,
          filteredUserData: newData,
        };
      }
      case RESET_FILTER:
        return {
          ...state,
          usersList: state.users ,
          filteredUserData:""
        };
      case USER_NOT_FOUND:
        return {
          loader: false,
        };
      default:
        return state;
    }
  }
};

export default manageUserReducer;
