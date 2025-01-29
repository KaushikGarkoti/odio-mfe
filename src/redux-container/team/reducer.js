import {
  GET_ALL_TEAM,
  FILTER_TEAM_TAB,
  RESET_TEAM_FILTER,
  SET_LOADER,
  TEAM_NOT_FOUND,
  SHORT_TEAM_TAB,
} from "./type";

const teamState = {
  loader: false,
  initialTeam: [
    {
      id: "",
      employeeId: "",
      firstName: "",
      lastName: "",
      mobileNumber: "",
      email: "",
      caller: "",
      callScore: "",
      pitchScore: "",
      designation: "",
      role: "",
      ahtScore: "",
      callCount: "",
    },
  ],
  Team: [],
  filteredTeamData: [],
  shortedTeamData: [],
  teamStats:[]
};

const manageTeamsTabReducer = (state = teamState, action) => {
  if (action.type) {
    switch (action.type) {
      case SET_LOADER: {
        return {
          ...state,
          loader: true
        };
      }
      case TEAM_NOT_FOUND:
        return {
          ...state,
          loader: false,
          initialTeam:[],
          Team:[]
        };
      case GET_ALL_TEAM:
        return {
          ...state,
          initialTeam: action.payload,
          Team: action.payload,
          loader: false,
        };
      case FILTER_TEAM_TAB: {
        let newTeam = [];
        let newData = [];
        let teamData = []
        state.selectedData=action.payload
        state.initialTeam = state.Team;
        if (action.payload.employeeId) {
          newData = newData + `employeeId:${action.payload.employeeId}` + "&";
          var len = action.payload.employeeId.length;
          newTeam = state.initialTeam.filter(
            (t) =>
              (t.employeeId.length > len
                ? t.employeeId.slice(0, len).toLowerCase()
                : t.employeeId.toLowerCase()) ===
              action.payload.employeeId.toLowerCase()
          );
          state.initialTeam = newTeam;
          state.filteredTeamData = newData;
        }
        if (action.payload.teamUser) {
          // var name = action.payload.user.split(" ").join("");
          var name = action.payload.teamUser.value;
          newTeam = state.initialTeam.filter(
            (t) => t.lastName?t.firstName.includes(name.split(" ")[0])&&t.lastName.includes(name.split(" ")[1]):t.firstName.includes(name)
          );

          // const nameComponents = name.split(" ").map(component => component.toLowerCase());
          // const newTeam = state.initialTeam.filter(t => {
          //   // Split team member names into components
          //   const firstNameComponents = t.firstName.split(" ").map(component => component.toLowerCase());
          //   const lastNameComponents = t.lastName ? t.lastName.split(" ").map(component => component.toLowerCase()) : [];
          
          //   // Check if all name components are present in either first name or last name
          //   const isFirstNameMatch = nameComponents.every(component => firstNameComponents.includes(component));
          //   const isLastNameMatch = nameComponents.every(component => lastNameComponents.includes(component));
          
          //   return isFirstNameMatch || isLastNameMatch;
          // });
          
          newData = newData + `${newTeam.length>0&&newTeam[0].lastName?`firstName=${name.split(" ")[0]},lastName=${name.split(" ")[1]}`:`firstName=${name},lastName=""`}` + "&";
          state.initialTeam = newTeam;
          state.filteredTeamData = newData;
        }
        if (action.payload.role != "") {
          newData = newData + `role=${action.payload.role}` + "&";
          newTeam = state.initialTeam.filter(
            (t) => t.role === action.payload.role
          );
          state.initialTeam = newTeam;
          state.filteredTeamData = newData;
        }
        if (action.payload.designation != "") {
          newData = newData + `designation=${action.payload.designation}` + "&";
          newTeam = state.initialTeam.filter(
            (t) => t.designation === action.payload.designation
          );
          state.initialTeam = newTeam;
          state.filteredTeamData = newData;
        }
        if (action.payload.caller != "") {
          if (action.payload.caller === "Caller") {
            newData = newData + `isCaller=true` + "&";
            newTeam = state.initialTeam.filter((t) => t.caller === "Yes");
          } else {
            newData = newData + `isCaller=false` + "&";
            newTeam = state.initialTeam.filter((t) => t.caller === "No");
          }
          state.initialTeam = newTeam;
          state.filteredTeamData = newData;
        }
        if(action.payload.callsFrom&&action.payload.callsTo&&action.payload.call[0]==0&&action.payload.call[1]==100){
          newTeam = state.initialTeam.filter(
            (item)=>(parseFloat(action.payload.callsFrom) <= item.callCount && item.callCount <= parseFloat(action.payload.callsTo))
          )
          teamData = teamData + `&callsCount=${action.payload.callsFrom}&callsCount=${action.payload.callsTo}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if(action.payload.callsFrom!=''&&action.payload.callsTo!=''&&((action.payload.call[0]!=0&&action.payload.call[1]!=100)||(action.payload.call[0]==0&&action.payload.call[1]!=100)||(action.payload.call[0]!=0&&action.payload.call[1]==100))){
          newTeam = state.initialTeam.filter(
            (item)=>(parseFloat(action.payload.callsFrom) <= item.callCount && item.callCount <= parseFloat(action.payload.callsTo)&&(item.callScore!==null?action.payload.call[0] <= parseFloat(item.callScore) && parseFloat(item.callScore) <= action.payload.call[1]:item.callScore==null?action.payload.call[0]==0:""))
          )
          teamData = teamData + `&callsCount=${action.payload.callsFrom}&callsCount=${action.payload.callsTo}&callScoreRange=${action.payload.call[0]}&callScoreRange=${action.payload.call[1]}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if(action.payload.callsFrom!=''&&action.payload.callsTo!=''&&((action.payload.aht[0]!=0&&action.payload.aht[1]!=300)||(action.payload.aht[0]==0&&action.payload.aht[1]!=300)||(action.payload.aht[0]!=0&&action.payload.aht[1]==300))){
          newTeam = state.initialTeam.filter(
            (item)=>(parseFloat(action.payload.callsFrom) <= item.callCount && item.callCount <= parseFloat(action.payload.callsTo) && (item.aht!==null?parseFloat(action.payload.aht[0]*60) <= parseFloat(item.aht) && parseFloat(item.aht) <= parseFloat(action.payload.aht[1]*60):item.aht==null?action.payload.aht[0]==0:""))
          )
          teamData = teamData + `&callsCount=${action.payload.callsFrom}&callsCount=${action.payload.callsTo}&aht=${action.payload.aht[0]}&aht=${action.payload.aht[1]}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if(action.payload.callsFrom!=''&&action.payload.callsTo!=''&&((action.payload.pitch[0]!=0&&action.payload.pitch[1]!=100)||(action.payload.pitch[0]==0&&action.payload.pitch[1]!=100)||(action.payload.pitch[0]!=0&&action.payload.pitch[1]==100))){
          newTeam = state.initialTeam.filter(
            (item)=>(parseFloat(action.payload.callsFrom) <= item.callCount && item.callCount <= parseFloat(action.payload.callsTo)&&(item.pitchScore!==null?action.payload.pitch[0] <= parseFloat(item.pitchScore) && parseFloat(item.pitchScore) <= action.payload.pitch[1]:item.pitchScore==null?action.payload.pitch[0]==0:""))
          )
          teamData = teamData + `&callsCount=${action.payload.callsFrom}&callsCount=${action.payload.callsTo}&aht=${action.payload.call[0]}&aht=${action.payload.call[1]}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if (action.payload.call&&!action.payload.callsFrom&&!action.payload.callsTo) {
          newTeam = state.initialTeam?.filter(
            (item) => (item.callScore!==null?action.payload.call[0] <= parseFloat(item.callScore) && parseFloat(item.callScore) <= action.payload.call[1]:item.callScore==null?action.payload.call[0]==0:"")
          );
          teamData = teamData + `&callScoreRange=${action.payload.call[0]}`+`&callScoreRange=${action.payload.call[1]}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if (action.payload.pitch &&!action.payload.callsFrom&&!action.payload.callsTo) {
          newTeam = state.initialTeam?.filter(
            (item) => {
              if (item.pitchScore === null || item.pitchScore === undefined) {
                return true;
              }
              return action.payload.pitch[0] <= parseInt(item.pitchScore) && parseInt(item.pitchScore) <= action.payload.pitch[1];
            }
          );
          teamData = teamData + `&pitchRange=${action.payload.pitch[0]}&pitchRange=${action.payload.pitch[1]}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        if(action.payload.aht&&!action.payload.callsFrom&&!action.payload.callsTo){
          newTeam = state.initialTeam?.filter(
            (item) => (item.aht!==null?(action.payload.aht[0]*60) <= parseFloat(item.aht) && parseFloat(item.aht) <= (action.payload.aht[1]*60):item.aht==null?action.payload.aht[0]==0:"")
          )
          teamData = teamData + `&aht=${action.payload.aht[0]*60}&aht=${action.payload.aht[1]*60}`
          state.initialTeam = newTeam;
          state.teamStats = teamData;
        }
        return {
          ...state,
          initialTeam: newTeam,
          filteredTeamData: newData,
          teamStats:teamData
        };
      }
      case RESET_TEAM_FILTER: {
        return {
          ...state,
          initialTeam: state.Team,
          // initialTeam: action.payload !== undefined ? state.Team : [],
          selectedData:""
        };
      }
      case SHORT_TEAM_TAB: {
        //state.initialTeam = state.Team
        if(!state.initialTeam){
          state.initialTeam = state.Team
        }

        let newData = [];
        if(action.payload.column ==='callScore' && state.initialTeam.length>0){
          if(action.payload.order==='ASCE'){
            newData = state.initialTeam.sort((a, b)=>{
              if ( a.callScore < b.callScore ){
                  return -1;
                }
                if ( a.callScore > b.callScore ){
                  return 1;
                }
                return 0;
            })
            state.shortedTeamData = newData;
          }else{
            newData = state.initialTeam.sort((a, b)=>{
              if ( a.callScore > b.callScore ){
                  return -1;
                }
                if ( a.callScore > b.callScore ){
                  return 1;
                }
                return 0;
            })
            state.shortedTeamData = newData;
          }
        }
        return {
          ...state,
          shortedTeamData: newData,
        };
      }
      default:
        return state;
    }
  }
};
export default manageTeamsTabReducer;
