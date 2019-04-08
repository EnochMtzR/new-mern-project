import * as React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { System } from "../System";

//Components import
import { ToolTip } from "../ToolTip/ToolTip.component";
import { ContextMenu } from "../ContextMenu/ContextMenu.component";
import { NotFound } from "../not-found-page/NotFound.page";
import * as locale from "../locales/data.json";
import { Dispatch } from "redux";

interface StateProps {
  user: System.Store.User.State;
  config: System.Store.Config.State;
}

interface ComponentState {
  isHeaderVisible: boolean;
  isHeaderSticky: boolean;
  wasHeaderUnsticked: boolean;
  localeData: locale.LocaleData;
}

const defaultState: ComponentState = {
  isHeaderVisible: false,
  isHeaderSticky: false,
  wasHeaderUnsticked: false,
  localeData: locale
};

require("./AppRouter.scss");

export class AppRouter extends React.Component<StateProps, ComponentState> {
  state = defaultState;

  constructor(props: StateProps) {
    super(props);
  }

  render() {
    return (
      <IntlProvider
        locale={this.props.config.language}
        messages={this.state.localeData[this.props.config.language]}
        key={this.props.config.language}
      >
        <BrowserRouter>
          <div className={this.props.user.id ? "router" : ""}>
            <Switch>
              <Route component={NotFound} />
            </Switch>
          </div>
        </BrowserRouter>
      </IntlProvider>
    );
  }
}

export const mapStateToProps = (state: System.Store.State) => ({
  user: state.user,
  config: state.config
});

export const mapDispatchToProps = (dispatch: Dispatch) => ({});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AppRouter);
