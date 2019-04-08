import { User } from "../User";

/**Holds all _Actions Types definitions_ (i.e. @types and @interfaces) for all
 * actions that can be performed on InHotel's user state.
 *
 * This Includes:
 *
 * _**Types**_ -
 * Holds all _Action Types_ that can be applied to InHotel's user state
 * >e.g. `login, logout ...`
 *
 * _**Action Objects**_ -
 * Holds the _definition_ for the objects returned by each _Action Function._
 *
 * _**. . .**_
 * @namespace
 */
export namespace Actions {
  /**Holds all _Action Types_ that can be applied to InHotel's user state
   * >e.g. `login, logout ...`
   * @readonly
   * @enum \{String}
   */
  export enum Types {
    /**This type of action returns the application's language to default state.
     *
     * @equates `"@@INIT"`
     */
    init = "@@INIT",

    /**This type of action logs the user in.
     *
     * @equates `"LOGIN"`
     */
    login = "LOGIN",

    /**This type of action edits the user's current state.
     *>e.g. _changes the name_, _adds a new hotel to the user's hotels' list_, ...
     * @equates `"EDIT_USER"`
     */
    editUser = "EDIT_USER",

    /**This type of action logs the user out.
     *
     * @equates `"LOGOUT"`
     */
    logout = "LOGOUT"
  }

  /**Defines how the _**Init**_ action must be composed.
   */
  export interface Init {
    type: "@@INIT";
  }

  /**Defines how the _**LoginActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"LOGIN"` &mdash; Always `"LOGIN"` for this action object.
   *
   *  _**user:**_ {_[User.State]('../User.ts')_} &mdash; The user to login.
   *
   * }
   *
   */
  export interface LoginActionObject {
    type: "LOGIN";
    /**User to Login
     *
     * @type {object} {_[User.State]('../User.ts')_}
     */
    user: User.State;
  }

  /**Defines how the _**EditActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"EDIT_USER"` &mdash; Always `"EDIT_USER"` for this object.
   *
   *  _**changes:**_ {_[User.State]('../User.ts')_} &mdash; An object with the desired changes.
   *
   * }
   *
   */
  export interface EditActionObject {
    type: "EDIT_USER";
    /**Changes to be applied to the user's state.
     * @type {object} {_[User.State]('../User.ts')_}
     */
    changes: User.State;
  }

  /**Defines how the _**LogoutActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"LOGOUT"` &mdash; Always `"LOGOUT"` for this object.
   *
   * }
   *
   */
  export interface LogoutActionObject {
    type: "LOGOUT";
  }
}
