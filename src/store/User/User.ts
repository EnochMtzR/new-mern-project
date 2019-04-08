import { Actions as _Actions } from "./actions/User.Actions";
import * as ActionFunctions from "./user.actions";
import * as reducerFunctions from "./user.reducer";

/**Holds all necessary code to handle InHotel's Users:
 * _**users action types**_, _**users action functions**_,
 * _**current user state**_ and _**default user state**_.
 * @namespace
 */
export namespace User {
  export import Actions = _Actions;
  export import login = ActionFunctions.login;
  export import edit = ActionFunctions.edit;
  export import logout = ActionFunctions.logout;
  export import reducer = reducerFunctions.reducer;

  /**Definition of InHotel's User's State
   *
   * {
   *
   * _**id:**_ _{String}_
   *
   * _**name:**_ _{String}_
   *
   * _**hotelId:**_ _{String}_
   *
   * _**hotelName:**_ _{String}_
   *
   * _**accessRights:**_ _{String[]}_ &mdash; A list containing all allowed features
   *
   * _**token:**_ _{String}_
   *
   * }
   *
   */

  export interface Hotel {
    id: string;
    name: string;
  }

  export interface State {
    id: string;
    inHotelId: string;
    name: string;
    hotels: Hotel[];
    accessRights: string[];
    token: string;
  }

  /**Definition of InHotel's User's State
   *
   * {
   *
   * _**id:**_ `""`
   *
   * _**name:**_ `""`
   *
   * _**hotelId:**_ `""`
   *
   * _**hotelName:**_ `""`
   *
   * _**accessRights:**_ `[]`
   *
   * _**token:**_ `""`
   *
   * }
   *
   */
  export const defaultState: State = {
    id: "",
    inHotelId: "",
    name: "",
    hotels: [{ id: "", name: "" }],
    accessRights: [],
    token: ""
  };

  /**Defines what a generic _action object_ can contain:
   *
   * {
   *
   * **Type:** `"@@INIT"||"LOGIN"||"EDIT_USER"||"LOGOUT"`
   *
   * **user?:** _{[User.State](./User.ts)}_
   *
   * **changes?:** _{[User.State](./User.ts)}_
   *
   * }
   */
  export type Action =
    | Actions.Init
    | Actions.LoginActionObject
    | Actions.EditActionObject
    | Actions.LogoutActionObject;
}
