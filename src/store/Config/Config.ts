import { Actions as _Actions } from "./actions/Config.Actions";
import * as Languages from "./languages/languages";
import * as ContextMenuInterfaces from "./contextMenu/ContextMenu";
import * as ActionFunctions from "./Config.actions";
import * as ReducerFunctions from "./Config.reducer";

/**Holds all necessary code to change InHotel's configuration:
 * _**configuration action types**_, _**configuration action functions**_,
 * _**languages**_, _**current configuration state**_ and _**default configuration state**_.
 * @namespace
 */
export namespace Config {
  export import Actions = _Actions;
  export import languages = Languages.Languages;
  export import ContextMenu = ContextMenuInterfaces.ContextMenu;
  export import MenuEntry = ContextMenuInterfaces.MenuEntry;
  export import Separator = ContextMenuInterfaces.Separator;
  export import changeLanguage = ActionFunctions.changeLanguage;
  export import showToolTip = ActionFunctions.showToolTip;
  export import hideToolTip = ActionFunctions.hideToolTip;
  export import showContextMenu = ActionFunctions.showContextMenu;
  export import hideContextMenu = ActionFunctions.hideContextMenu;
  export import reducer = ReducerFunctions.reducer;

  /**Definition of InHotel's configuration state
   *
   * {
   *
   * _**language:**_ - _{String}_
   *
   * _**showToolTip:**_ - _{Boolean}_
   *
   * }
   */
  export interface State {
    language: string;
    toolTip: string;
    contextMenu: ContextMenu;
  }

  /**The default state for InHotel's configuration.
   *
   * {
   *
   * _**language:**_ `"es"`
   *
   * _**showToolTip:**_ `false`
   *
   * }
   */
  export const defaultState: State = {
    language: languages.spanish,
    toolTip: "",
    contextMenu: undefined
  };

  /**Defines what a generic _action object_ can contain:
   *
   * {
   *
   * **Type:** `"@@INIT"||"CHANGE_LANGUAGE"||"SHOW_TOOL_TIP"||
   * "HIDE_TOOL_TIP"||"SHOW_CONTEXT_MENU"||"HIDE_CONTEXT_MENU"`
   *
   * **language?:** _{string}_
   *
   * }
   */
  export type Action =
    | Actions.Init
    | Actions.ChangeLanguageActionObject
    | Actions.ShowToolTipActionObject
    | Actions.HideToolTipActionObject
    | Actions.ShowContextMenuActionObject
    | Actions.HideContextMenuActionObject;
}
