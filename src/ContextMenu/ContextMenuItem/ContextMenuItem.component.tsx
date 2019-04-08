import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import {
  MenuEntry,
  Separator
} from "../../store/Config/contextMenu/ContextMenu";

interface ComponentProperties {
  contextMenuItem: MenuEntry | Separator;
}

require("./ContextMenuItem.component.scss");

export class ContextMenuItem extends React.Component<ComponentProperties> {
  onMouseDown = (event: MouseEvent) => {
    event.stopPropagation();
  };

  componentDidMount() {
    const itemElements = document.getElementsByClassName("context_menu_item");

    Array.from(itemElements).map(element => {
      element.addEventListener("mousedown", this.onMouseDown);
    });
  }

  render() {
    return (
      <div
        // onMouseDown={this.onMouseDown}
        className={`context_menu_item ${
          this.props.contextMenuItem.displayText ? "menu_entry" : "separator"
        }`}
      >
        {this.props.contextMenuItem.displayText !== "" ? (
          <div className="context_menu_item-content">
            <p>{this.props.contextMenuItem.displayText}</p>
            <p className="hotkey">{this.props.contextMenuItem.hotkey}</p>
          </div>
        ) : (
          <hr />
        )}
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  //Add desired dispatch functions here.
});

export default connect(
  null,
  mapDispatchToProps
)(ContextMenuItem);
