import * as React from "react";

interface ComponentProperties {
  message: string;
}

const defaultProperties = {
  message: ""
};

require("./ToolTip.component.scss");

export class ToolTip extends React.Component<ComponentProperties, {}> {
  followMouse = (ev: MouseEvent) => {
    const toolTip = document.getElementById("ToolTip");
    if (ev.pageY + toolTip.offsetHeight >= window.innerHeight)
      toolTip.style.top = `${ev.pageY - toolTip.offsetHeight - 15}px`;
    else toolTip.style.top = `${ev.pageY + 15}px`;

    if (ev.pageX + toolTip.offsetWidth >= window.innerWidth)
      toolTip.style.left = `${ev.pageX - toolTip.offsetWidth}px`;
    else toolTip.style.left = `${ev.pageX}px`;
  };

  componentDidMount = () => {
    this.captureMouseMove();
  };

  componentWillUnmount = () => {
    removeEventListener("mousemove", this.followMouse);
  };

  captureMouseMove = () => {
    addEventListener("mousemove", this.followMouse);
  };

  render() {
    return (
      <div id="ToolTip" className="tool_tip">
        <p>{this.props.message}</p>
      </div>
    );
  }
}
