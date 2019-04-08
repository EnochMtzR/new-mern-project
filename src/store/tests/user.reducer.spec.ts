import { User } from "../User/User";
import { testStoreState } from "./store.fixtures";

describe("Testing user.reducer.ts", () => {
  describe("testing userReducer(state: State, actions: LoginUserActions)", () => {
    describe(`testing @@INIT Action`, () => {
      test("Should setup default user state on Init", () => {
        const state = User.reducer(undefined, {
          type: User.Actions.Types.init
        });
        expect(state).toEqual(User.defaultState);
      });
    });

    describe(`testing ${User.Actions.Types.login} Action`, () => {
      test(`Should set user on ${User.Actions.Types.login}`, () => {
        const state = User.reducer(undefined, {
          type: User.Actions.Types.login,
          user: testStoreState.user
        });
        expect(state).toEqual(testStoreState.user);
      });
    });

    describe(`testing ${User.Actions.Types.editUser} Action`, () => {
      test(`Should not set id on ${User.Actions.Types.editUser}`, () => {
        const state = User.reducer(undefined, {
          type: User.Actions.Types.editUser,
          changes: testStoreState.user
        });
        expect(state.id).toEqual("");
      });

      test(`Should set all changes on ${User.Actions.Types.editUser}`, () => {
        const state = User.reducer(undefined, {
          type: User.Actions.Types.editUser,
          changes: testStoreState.user
        });
        expect(state).toEqual({ ...testStoreState.user, id: "" });
      });

      describe(`testing ${User.Actions.Types.logout} Action`, () => {
        test(`Should remove user on ${User.Actions.Types.logout}`, () => {
          const state = User.reducer(testStoreState.user, {
            type: User.Actions.Types.logout
          });
          expect(state).toEqual(User.defaultState);
        });
      });
    });
  });
});
