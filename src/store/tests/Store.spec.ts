import { LocalStore } from "../Store";
import { testStoreState } from "./store.fixtures";
import { configureStore } from "../configureStore";

beforeEach(() => {
  localStorage.clear();
});

const configureSaveState = () => {
  const store = configureStore();
  LocalStore.saveState(store);
  return store;
};

describe("Store.ts tests", () => {
  describe("Testing loadState() function", () => {
    test("Should load state from localStorage if exists", () => {
      localStorage.setItem("state", JSON.stringify(testStoreState));
      const state = LocalStore.loadState();
      expect(state).toEqual(testStoreState);
    });

    test("Should return empty object when no state in localStorage", () => {
      const state = LocalStore.loadState();
      expect(state).toEqual({});
    });
  });

  describe("testing saveState(store: Store) function", () => {
    test("should not save state if state not change", () => {
      configureSaveState();
      const savedState: LocalStore.State = JSON.parse(
        localStorage.getItem("state")
      );
      expect(savedState).toBe(null);
    });

    test("should save state on state change", () => {
      const store = configureSaveState();
      store.dispatch(LocalStore.User.login(testStoreState.user));
      const savedState = JSON.parse(localStorage.getItem("state"));
      expect(savedState.user).toEqual(testStoreState.user);
    });
  });
});
