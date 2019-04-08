import { Store } from "redux";
import { User as _User } from "./User/User";
import { Config as _Config } from "./Config/Config";

/**Hold's all InHotel's code (**i.e.** _store_, _states_, _functions_, _interfaces_, _constants_, _enums_, _etc ..._)
 * necessary to alter the application's **_state_**, **_current user_** and **_configuration_**.
 *
 */
export namespace LocalStore {
  export import User = _User;
  export import Config = _Config;

  /**Hold's InHotel's current state:
   *
   * {
   *
   * _**user:**_ {[_User.State_]('./User/User.ts')} &mdash; holds the user's current state.
   *
   * _**config:**_ {[_User.State_]('./User/User.ts')} &mdash; holds InHotel's current configuration.
   *
   * }
   */
  export interface State {
    user: User.State;
    config: Config.State;
  }

  /**InHotel's default state:
   *
   * {
   *
   * _**user:**_ `User.defaultState` &mdash; See [_User's default state_]('User/User.ts').
   *
   * _**config:**_ `Config.defaultState` &mdash; See [_Configuration's default state_]('Config/Config.ts').
   *
   * }
   */
  export const defaultState: State = {
    user: User.defaultState,
    config: Config.defaultState
  };

  /**Loads InHotel's state into local storage for consistency.
   * @returns {object}{[_State_]('./Store.ts')}
   */
  export const loadState: () => State = () => {
    const state = localStorage.getItem("state");
    return JSON.parse(state) || {};
  };

  /**Saves InHotel's current state into localStorage for consistency.
   *
   * @param store InHotel's current store
   */
  export const saveState = (store: Store) => {
    store.subscribe(() => {
      localStorage.setItem("state", JSON.stringify(store.getState()));
    });
  };
}
