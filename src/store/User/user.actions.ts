import { User } from "./User";

/**logs in the _user_ provided.
 *
 * @param user {Object} The user to login {_[User.State]('./User.ts')_}
 * @returns {Object}{[_LoginActionObject_]('./actions/User.Actions.ts')}
 */
export const login = (user: User.State) => {
  localStorage.setItem("x-auth", user.token);
  return {
    type: User.Actions.Types.login,
    user: user
  } as User.Actions.LoginActionObject;
};

/**logs out the current _user_.
 *
 * @returns {Object}{[_LogoutActionObject_]('./actions/User.Actions.ts')}
 */
export const logout = () =>
  ({
    type: User.Actions.Types.logout
  } as User.Actions.LogoutActionObject);

/**Edits the current _user_'s state
 *
 * @param changes {Object} The changes to be applied {_[User.State]('./User.ts')_}
 * @returns {Object}{[_EditActionObject_]('./actions/User.Actions.ts')}
 */
export const edit: (changes: User.State) => User.Actions.EditActionObject = (
  changes: User.State
) => ({
  type: User.Actions.Types.editUser,
  changes: changes
});
