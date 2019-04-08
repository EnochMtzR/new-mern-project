import { User } from "./User";

/**Takes InHotel's user's _current state_ and the _action_ provided
 * and applies the given action to alter InHotel's user's State
 *
 * @param state {Object} The current user's _state_ {[_User.State_]('./User.ts')}
 * @param action {Object} The _action_ to be performed {[_User.Action_]('./User.ts')}
 * @returns {Object} **New State** {[_User.State_]('./User.ts')}
 */
export const reducer = (state = User.defaultState, action: User.Action) => {
  switch (action.type) {
    case User.Actions.Types.login:
      return action.user;
    case User.Actions.Types.editUser:
      return { ...action.changes, id: state.id };
    case User.Actions.Types.logout:
      return User.defaultState;
    default:
      return state;
  }
};
