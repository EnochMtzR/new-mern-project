import { Config } from "./Config";

/**Takes the current InHotel's configuration's _state_
 * and the _action_ provided and applies the given action to alter
 * InHotel's configuration's state.
 *
 * @param state   The current configuration's _state_ {[_Config.State_]('./Config.ts')}.
 * @param action  The _action_ wished to be performed {[_Config.Action_]('./Config.ts')}.
 * @returns New configuration's _**State**_ {[_Config.State_]('./Config.ts')}
 */
export const reducer = (state = Config.defaultState, action: Config.Action) => {
  switch (action.type) {
    case Config.Actions.Types.changeLanguage:
      return { ...state, language: action.language };
    case Config.Actions.Types.showToolTip:
      return { ...state, toolTip: action.message };
    case Config.Actions.Types.hideToolTip:
      return { ...state, toolTip: "" };
    case Config.Actions.Types.showContextMenu:
      return { ...state, contextMenu: action.contextMenu };
    case Config.Actions.Types.hideContextMenu:
      return { ...state, contextMenu: undefined };
    default:
      return state;
  }
};
