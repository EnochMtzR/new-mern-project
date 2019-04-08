import { configureStore } from "../configureStore";
import { LocalStore } from "../Store";
import { testStoreState } from "./store.fixtures";

describe("configureStore Tests", () => {
  test("Should create empty store with default state when no state provided", () => {
    const state = configureStore().getState();
    expect(state).toEqual(LocalStore.defaultState);
  });

  test("Should create store with state as provided", () => {
    const StoreState = configureStore(testStoreState).getState();
    expect(StoreState).not.toEqual(LocalStore.defaultState);
    expect(StoreState).toEqual(testStoreState);
  });
});
