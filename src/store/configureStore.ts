import { createStore, combineReducers, Store } from "redux";
import { LocalStore } from "./Store";

/**Creates and configures InHotel's store for it's first time use,
 *  and returns a store object with the new store.
 *
 * @param loadedState {object} the state wished to be loaded into InHotel's store {[_.State_]('./Store.ts')}
 * @returns {Store}**Store**
 */
export const configureStore: (loadedState?: LocalStore.State) => Store = (
  loadedState: LocalStore.State = undefined
) => {
  const store = createStore(
    combineReducers({
      user: LocalStore.User.reducer,
      config: LocalStore.Config.reducer
    }),
    loadedState,
    /* istanbul ignore next */
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ &&
      (window as any).__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};
