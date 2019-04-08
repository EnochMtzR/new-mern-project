import { User } from "../User/User";
import { testStoreState } from "./store.fixtures";

describe("Testing user.actions.ts", () => {
  describe("testing loginUser(user: User) Action", () => {
    test("Should return action object", () => {
      const actionReturned = User.login(testStoreState.user);
      expect(actionReturned).toEqual({
        type: User.Actions.Types.login,
        user: testStoreState.user
      });
    });
  });

  describe("testing editUser(editedUser: User) Action", () => {
    test("Should return action object", () => {
      const actionReturned = User.edit(testStoreState.user);
      expect(actionReturned).toEqual({
        type: User.Actions.Types.editUser,
        changes: testStoreState.user
      });
    });
  });

  describe("testing logoutUser() Action", () => {
    test("Should return action object", () => {
      const actionReturned = User.logout();
      expect(actionReturned).toEqual({
        type: User.Actions.Types.logout
      });
    });
  });
});
