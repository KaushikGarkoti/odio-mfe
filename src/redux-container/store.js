import createRootReducer from "../redux-container/combineReducer";
import {createStore, applyMiddleware, compose} from 'redux';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import reduxThunk from 'redux-thunk';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

export const history = createBrowserHistory();

const persistConfig = {
    key: 'root', // key for localStorage
    storage, // storage engine
    whitelist: ['insights', 'callList', 'meetings', 'non_live'], // reducers you want to persist
};


const rootReducer = createRootReducer(history);
const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = createStore(
    // createRootReducer(history),
    persistedReducer,
    composeEnhancers(applyMiddleware(reduxThunk, routerMiddleware(history)))
)

const persistor = persistStore(store);

export default store;
export { persistor };