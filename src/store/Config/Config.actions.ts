import { Config } from "./Config";
import { ContextMenu } from "./contextMenu/ContextMenu";

/**Action Function to change InHotel's language.
 *
 * @param language The desired language to change to.
 * @returns [_**ChangeLanguageActionObject**__]('./actions/Config.Actions.ts')
 */
export const changeLanguage = (language: string) =>
  ({
    type: Config.Actions.Types.changeLanguage,
    language: language
  } as Config.Actions.ChangeLanguageActionObject);

/**Action Function to show Tooltips on the App.
 *
 * @param message The desired message to show on the App.
 * @returns [_**ShowToolTipActionObject**__]('./actions/Config.Actions.ts')
 */
export const showToolTip = (message: string) =>
  ({
    type: Config.Actions.Types.showToolTip,
    message: message
  } as Config.Actions.ShowToolTipActionObject);

/**Action Function to hide Tooltips on the App.
 *
 * @returns [_**HideToolTipActionObject**__]('./actions/Config.Actions.ts')
 */
export const hideToolTip = () =>
  ({
    type: Config.Actions.Types.hideToolTip
  } as Config.Actions.HideToolTipActionObject);

/**Action Function to show the ContextMenu on the App.
 *
 * @param contextMenu The desired contextMenu object to show on the App.
 * @returns [_**ShowContextMenuActionObject**__]('./actions/Config.Actions.ts')
 */
export const showContextMenu = (contextMenu: ContextMenu) =>
  ({
    type: Config.Actions.Types.showContextMenu,
    contextMenu: contextMenu
  } as Config.Actions.ShowContextMenuActionObject);

/**Action Function to hide ContextMenu on the App.
 *
 * @returns [_**HideContextMenuActionObject**__]('./actions/Config.Actions.ts')
 */
export const hideContextMenu = () =>
  ({
    type: Config.Actions.Types.hideContextMenu
  } as Config.Actions.HideContextMenuActionObject);
