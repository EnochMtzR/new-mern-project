import * as React from "react";
import * as ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { addLocaleData } from "react-intl";
import * as en from "react-intl/locale-data/en";
import * as es from "react-intl/locale-data/es";

import AppRouter from "./routers/AppRouter";
import { configureStore } from "./store/configureStore";
import { System } from "./System";

require("normalize.css");
require("./styles/styles.scss");

System.cleanTooltipAndContextMenu();

const store = configureStore(System.Store.loadState());
System.Store.saveState(store);
addLocaleData([...en, ...es]);

const App = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);

ReactDOM.render(App, document.getElementById("app"));
