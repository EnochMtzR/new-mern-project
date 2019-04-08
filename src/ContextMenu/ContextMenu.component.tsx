import * as React from "react";
import { System } from "../System";

import ContextMenuItem from "./ContextMenuItem/ContextMenuItem.component";

interface ComponentProperties {
  contextMenu: System.Store.Config.ContextMenu;
}

const defaultProperties: ComponentProperties = {
  contextMenu: {
    xPos: 0,
    yPos: 0,
    data: {}
  }
};

require("./ContextMenu.component.scss");

export class ContextMenu extends React.Component<ComponentProperties> {
  showContextMenuObject = () => {
    let contextMenu = [] as JSX.Element[];
    Object.keys(this.props.contextMenu.data).forEach(item => {
      contextMenu.push(
        <ContextMenuItem
          key={item}
          contextMenuItem={this.props.contextMenu.data[item]}
        />
      );
    });

    return contextMenu;
  };

  getPerfectYPosition = (contextMenu: HTMLElement) => {
    if (this.props.contextMenu.yPos - 15 - contextMenu.offsetHeight > 0) {
      return `${this.props.contextMenu.yPos - contextMenu.offsetHeight - 15}px`;
    } else {
      return `${this.props.contextMenu.yPos + 15}px`;
    }
  };

  getPerfectXPosition = (contextMenu: HTMLElement) => {
    if (
      this.props.contextMenu.xPos + contextMenu.offsetWidth <
      window.innerWidth
    ) {
      return `${this.props.contextMenu.xPos}px`;
    } else {
      return `${this.props.contextMenu.xPos - contextMenu.offsetWidth}px`;
    }
  };

  setContextMenuPositionToMouse = () => {
    const contextMenu = document.getElementById("ContextMenu");

    contextMenu.style.top = this.getPerfectYPosition(contextMenu);
    contextMenu.style.left = this.getPerfectXPosition(contextMenu);
  };

  componentDidMount() {
    this.setContextMenuPositionToMouse();
  }

  componentDidUpdate() {
    this.setContextMenuPositionToMouse();
  }

  render() {
    return (
      <div id="ContextMenu" className="context_menu disable-select">
        {this.showContextMenuObject()}
      </div>
    );
  }
}
