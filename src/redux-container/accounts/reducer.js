import {
  GET_TEAM,
  FILTER_TEAM,
  RESET_FILTER,
  SET_LOADER,
  TEAM_NOT_FOUND,
} from "./type";

const initialTeamState = {
  loader: false,
  teamList: [
    {
      caller: "",
      designation: "",
      email: "",
      employeeId: "",
      firstName: "",
      id: "",
      lastName: "",
      role: "",
      callScore: "",
      pitchScore: "",
    },
  ],
  team: [],
  filteredData: [],
};

const manageTeamReducer = (state = initialTeamState, action) => {
  if (action.type) {
    switch (action.type) {
      case SET_LOADER: {
        return {
          ...state,
          loader: action.payload,
        };
      }
      case TEAM_NOT_FOUND :{
        return {
          ...state,
          loader: false,
        };
      }
      case GET_TEAM:{
        return {
          ...state,
          teamList: action.payload,
          team: action.payload,
          loader: false,
        };
      }
      case FILTER_TEAM: {
        let newTeam = state.team;
        let newData = [];
        state.teamList = state.team;
        if (action.payload.accountEmployeeId) {
          newData = newData + `employeeId:${action.payload.accountEmployeeId}` + "&";
          var len = action.payload.accountEmployeeId.length;
          newTeam = state.teamList.filter(
            (t) =>
              (t.employeeId.length > len
                ? t.employeeId.slice(0, len).toLowerCase()
                : t.employeeId.toLowerCase()) ===
              action.payload.accountEmployeeId.toLowerCase()
          );
          state.teamList = newTeam;
          state.filteredData = newData;
        }
        if (action.payload.employee) {
          var name = action.payload?.employee?.value;
          newTeam = state.teamList.filter(
            (t) => t.lastName?t.firstName.includes(name.split(" ")[0])&&t.lastName.includes(name.split(" ")[1]):t.firstName.includes(name)
          );
          newData = newData + `${newTeam[0].lastName?`firstName=${name.split(" ")[0]},lastName=${name.split(" ")[1]}`:`firstName=${name},lastName=""`}` + "&";
          state.teamList = newTeam;
          
          state.filteredData = newData;
        }
        if (action.payload.role != "") {
          newData = newData + `role=${action.payload.role}` + "&";
          newTeam = state.teamList.filter(
            (t) => t.role === action.payload.role
          );
          state.teamList = newTeam;
          state.filteredData = newData;
        }
        if (action.payload.designation != "") {
          newData = newData + `designation=${action.payload.designation}` + "&";
          newTeam = state.teamList.filter(
            (t) => t.designation === action.payload.designation
          );
          state.teamList = newTeam;
          state.filteredData = newData;
        }
        if (action.payload.caller != "") {
          if (action.payload.caller === "Caller") {
            newData = newData + `isCaller=Yes` + "&";
            newTeam = state.teamList.filter((t) => t.caller === 'Yes');
          } else {
            newData = newData + `isCaller=No` + "&";
            newTeam = state.teamList.filter((t) => t.caller === 'No');
          }
          state.teamList = newTeam;
          state.filteredData = newData;
        }
        return {
          ...state,
          teamList: newTeam,
          filteredData: newData,
        };
      }

      case RESET_FILTER: {
        return {
          ...state,
          teamList: state.team,
        };
      }

      default:
        return state;
    }
  }
};

export default manageTeamReducer;
