/** Specifies how a _MenuEntry_ from a _ContextMenu_ is composed:
 *
 * _**displayText:**_ - _{String}_ &mdash; The text to be displayed on the context menu.
 *
 * _**hotkey:**_ - _{String}_ &mdash; The hotkey text to be displayed besides the _displayText_.
 *
 * _**action:**_ - _() => any_ &mdash; The function to execute when the user clicks on that menu entry.
 */
interface IMenuEntry {
  displayText: string;
  hotkey: string;
  action: (...args: any[]) => any;
}

/** Creates a _MenuEntry_ object for a _ContextMenu_:
 *
 * _**displayText:**_ - _{String}_ &mdash; The text to be displayed on the context menu.
 *
 * _**hotkey:**_ - _{String}_ &mdash; The hotkey text to be displayed besides the _displayText_.
 *
 * _**action:**_ - _() => any_ &mdash; The function to execute when the user clicks on that menu entry.
 */
export class MenuEntry implements IMenuEntry {
  displayText: string;
  hotkey: string;
  action: (...args: any[]) => any;

  constructor(menuEntry: IMenuEntry = {} as MenuEntry) {
    this.displayText = menuEntry.displayText || "";
    this.hotkey = menuEntry.hotkey || "";
    this.action = menuEntry.action || undefined;
  }

  getType() {
    return MenuEntry;
  }
}

/** Specifies a separator in a context menu */
export class Separator extends MenuEntry {
  constructor() {
    super();
  }

  getType() {
    return Separator;
  }
}

/** Holds all _ContextMenu_ data */
export interface ContextMenuData {
  [itemName: string]: MenuEntry | Separator;
}

/** Holds a _ContextMenu_ state */
export interface ContextMenu {
  xPos: number;
  yPos: number;
  data: ContextMenuData;
}
