import { ContextMenu } from "../contextMenu/ContextMenu";

/**Holds all _Actions Types definitions_ (i.e. @types and @interfaces) for all
 * actions that can be performed on InHotel's configuration state.
 *
 * This Includes:
 *
 * _**Types**_ -
 * Holds all _Action Types_ that can be applied to InHotel's configuration state
 * >e.g. `changeLanguage...`
 *
 * _**Action Objects**_ -
 * Holds the _definition_ for the objects returned by each _Action Function._
 *
 * _**. . .**_
 * @namespace
 */
export namespace Actions {
  /**Holds all _Action Types_ that can be applied to InHotel's configuration state
   * >e.g. `changeLanguage...`
   * @readonly
   * @enum \{String}
   */
  export enum Types {
    /**This type of action changes the application's language.
     *
     * @equates `"CHANGE_LANGUAGE"`
     */
    changeLanguage = "CHANGE_LANGUAGE",
    /**This type of action changes the application's language.
     *
     * @equates `"CHANGE_LANGUAGE"`
     */
    showToolTip = "SHOW_TOOL_TIP",
    /**This type of action returns the application's configuration to default state.
     *
     * @equates `"@@INIT"`
     */
    hideToolTip = "HIDE_TOOL_TIP",
    /**This type of action returns the application's configuration to default state.
     *
     * @equates `"@@INIT"`
     */
    showContextMenu = "SHOW_CONTEXT_MENU",
    /**This type of action returns the application's configuration to default state.
     *
     * @equates `"@@INIT"`
     */
    hideContextMenu = "HIDE_CONTEXT_MENU",
    /**This type of action returns the application's configuration to default state.
     *
     * @equates `"@@INIT"`
     */
    init = "@@INIT"
  }

  /**Defines how the _**Init**_ action must be composed
   */
  export interface Init {
    type: "@@INIT";
  }

  /**Defines how the _**ChangeLanguageActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"CHANGE_LANGUAGE"` &mdash; Always _"CHANGE&#95;LANGUAGE"_.
   *
   * _**language:**_ {String} &mdash; The language to which to change.
   *
   * }
   * @interface
   */
  export interface ChangeLanguageActionObject {
    type: "CHANGE_LANGUAGE";
    /**Language to which to change
     *
     * @type {String}
     */
    language: string;
  }

  /**Defines how the _**ShowToolTipActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"SHOW_TOOL_TIP"` &mdash; Always _"SHOW&#95;TOOL&#95;TIP"_.
   *
   * _**message:**_ {String} &mdash; The message to show on the tooltip.
   *
   * }
   * @interface
   */
  export interface ShowToolTipActionObject {
    type: "SHOW_TOOL_TIP";
    /**message to show on the toolTip;
     *
     * @type {String}
     */
    message: string;
  }

  /**Defines how the _**HideToolTipActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"HIDE_TOOL_TIP"` &mdash; Always _"HIDE&#95;TOOL&#95;TIP"_.
   *
   * }
   * @interface
   */
  export interface HideToolTipActionObject {
    type: "HIDE_TOOL_TIP";
  }

  /**Defines how the _**ShowContextMenuActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"SHOW_CONTEXT_MENU"` &mdash; Always _"SHOW&#95;CONTEXT&#95;MENU"_.
   *
   * _**contextMenu:**_ {[_**ContextMenu**_]('../contextMenu/ContextMenu.ts')} &mdash; The context menu object to be shown.
   *
   * }
   * @interface
   */
  export interface ShowContextMenuActionObject {
    type: "SHOW_CONTEXT_MENU";
    /**The context menu object to be shown;
     *
     * @type {[_**ContextMenu**_]('../contextMenu/ContextMenu.ts')}
     */
    contextMenu: ContextMenu;
  }

  /**Defines how the _**HideContextMenuActionObject**_ must be composed.
   *
   * {
   *
   *  _**type:**_ `"HIDE_CONTEXT_MENU"` &mdash; Always _"HIDE&#95;CONTEXT&#95;MENU"_.
   *
   * }
   * @interface
   */
  export interface HideContextMenuActionObject {
    type: "HIDE_CONTEXT_MENU";
  }
}
