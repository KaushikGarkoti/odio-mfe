import React from "react";
import ReactDOM from "react-dom";
import store, {history, persistor} from './redux-container/store'
import { Provider } from 'react-redux'
import { ConnectedRouter } from 'connected-react-router';
import { PersistGate } from 'redux-persist/integration/react';
import './assets/css/bootstrap.min.css'
import './assets/css/bootstrap-extended.css'
import "./index.css";
import './assets/css/icons.css'
import './assets/css/app.css'
import Dashboards from "./components/Dashboard/DashboardSales/SalesDashboard/Dashboards";
const App = () => (
    <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Dashboards />
            </ConnectedRouter>
            </PersistGate>

  </Provider>
);

ReactDOM.render(<App />, document.getElementById('app'))