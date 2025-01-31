import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import loginReducer from "./login/reducer";
import companySettingsReducer from "./settings/company_settings/reducer";
import manageCOEReducer from "./settings/manage_coe/reducer";
import manageMomentReducer from "./settings/manage_moments/reducer";
import manageUserReducer from "./settings/manage_users/reducer";
import manageTeamReducer from "./accounts/reducer";
import manageTeamsTabReducer from "./team/reducer";
import manageSalesCallListReducer from "./salesCallListing/reducer";
import insightsReducer from "./insights/reducer";
import callListReducer from "./callList/reducer"
import meetingsReducer from "./meeting/reducer";
import liveAssistReducer from "./liveAssist/reducer";
import nonLiveReducer from "./nonLiveCall/reducer";
import knowledgeBaseReducer from "./knowledgeBase/reducer";
import commonReducer from "./commons/reducer";
import wordCloudReducer from "./wordCloud/reducer";

const createRootReducer = (history) =>
  combineReducers({
    login: loginReducer,
    company_settings: companySettingsReducer,
    manage_moments: manageMomentReducer,
    manage_coe: manageCOEReducer,
    manage_users: manageUserReducer,
    manage_teams: manageTeamReducer,
    manage_team: manageTeamsTabReducer,
    manage_conversations:manageSalesCallListReducer,
    insights: insightsReducer,
    callList: callListReducer,
    meetings: meetingsReducer,
    live_assist: liveAssistReducer,
    non_live: nonLiveReducer,
    commonReducer: commonReducer,
    router: connectRouter(history),
    knowledgeBase: knowledgeBaseReducer,
    wordCloud: wordCloudReducer
  });

export default createRootReducer;