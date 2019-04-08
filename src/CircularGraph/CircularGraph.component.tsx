import * as React from "react";
import { System } from "../System";
import { Dispatch } from "redux";
import { connect } from "react-redux";

const svgXmlns = "http://www.w3.org/2000/svg";

export enum GraphStyles {
  pie = "pie",
  doughnut = "doughnut"
}

interface SVGSectorData {
  id: number;
  center: {
    x: number;
    y: number;
  };
  innerRadius: number;
  percentage: number;
  radius: number;
  circumference: number;
  fill: string;
  stroke: {
    color: string;
    width: number;
    dashArray: string;
  };
  transform: {
    rotation: number;
    origin: string;
  };
  label: {
    value: number;
    angle: number;
  };
  separator: {
    angle: number;
  };
}

export interface SectorData {
  description: string;
  value: number;
  color: string;
}

interface GraphData {
  total: number;
  radius: number;
  innerRadius: number;
  circumference: number;
  doughnutSize: number;
  processedCircumference: number;
  rotationDisplacement: number;
}

interface ComponentProperties {
  title: string;
  data: SectorData[];
  style: GraphStyles;
  currency?: boolean;
  noSpace?: boolean;
  showToolTip: (message: string) => void;
  hideToolTip: () => void;
}

interface ComponentState {
  showPrevious: boolean;
}

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD"
});

const defaultComponentState: ComponentState = {
  showPrevious: false
};

require("./CircularGraph.component.scss");

export class CircularGraph extends React.Component<
  ComponentProperties,
  ComponentState
> {
  state: ComponentState = defaultComponentState;
  graphSVG = {} as SVGSVGElement;
  descriptionDiv = {} as HTMLDivElement;
  graphData = {} as GraphData;
  sectorsData = [] as SectorData[];
  otherData = null as SectorData[];
  sectorBeingAnimated = -1;
  drawn = false;

  componentDidMount() {
    this.cleanSectorsData();
    this.drawGraph();
    this.drawn = true;
    window.addEventListener("resize", this.resize);
  }

  render() {
    return (
      <div className="graph_wrapper">
        {this.props.style === GraphStyles.pie && (
          <div className="graph_title_bar">
            <p className="title">{this.props.title}</p>
            {this.props.currency ? (
              <p className="total">{formatter.format(this.getTotalValue())}</p>
            ) : (
              <p className="total">{this.getTotalValue()}</p>
            )}
          </div>
        )}
        <div className="inGraph">
          <svg
            xmlns={svgXmlns}
            className="graph"
            ref={ref => (this.graphSVG = ref)}
          />
          <div className="descriptionWrapper">
            <div
              className="graph-description"
              ref={ref => (this.descriptionDiv = ref)}
            />
          </div>
        </div>
      </div>
    );
  }

  cleanSectorsData = () => {
    const total = this.getGraphsTotalValue();
    let otherDataTotal = 0;
    let otherData = {} as SectorData;
    this.otherData = new Array();

    this.sectorsData = this.props.data.filter(sectorData => {
      const percentage = Math.percentageFromValue(sectorData.value, total);
      if (percentage < 3) {
        if (percentage !== 0) this.otherData.push(sectorData);
        otherDataTotal += sectorData.value;
        return false;
      } else {
        return true;
      }
    });

    if (otherDataTotal) {
      otherData.color = this.otherData[0].color;
      otherData.description = "Other";
      otherData.value = otherDataTotal;
      this.sectorsData.push(otherData);
    } else {
      this.otherData = null;
    }
  };

  drawGraph = () => {
    this.graphData = this.getGraphData();

    this.sectorsData.map((sectorData, index) => {
      const svgSectorData = this.getSectorData(
        index,
        sectorData,
        this.graphData
      );

      this.createGraphSector(svgSectorData);
      this.createDescriptionElement(
        index,
        sectorData.color,
        sectorData.description
      );
      if (!this.props.noSpace)
        this.createSectorSeparator(
          svgSectorData,
          svgSectorData.separator.angle
        );

      this.graphData.processedCircumference += svgSectorData.circumference;
    });

    if (this.props.style === GraphStyles.doughnut) {
      this.createTitle(this.graphData.total);
    }

    if (window.innerWidth >= 850) {
      this.panSVGLeft(this.graphData.radius);
    }
  };

  getGraphData = () => {
    const viewPortSize = this.getViewPortSize();
    const doughnutSize = viewPortSize * 0.16;
    const innerRadius = this.getStyleRadius(viewPortSize, doughnutSize);
    const circumference = this.getCircumference(innerRadius);
    const radius = this.getGraphRadius(innerRadius, doughnutSize);

    return {
      total: this.getTotalValue(),
      radius: radius,
      innerRadius: innerRadius,
      circumference: circumference,
      doughnutSize: doughnutSize,
      processedCircumference: 0,
      rotationDisplacement: 90
    } as GraphData;
  };

  getSectorData = (
    id: number,
    sectorData: SectorData,
    graphData: GraphData
  ) => {
    const sectorPercentage = Math.percentageFromValue(
      sectorData.value,
      graphData.total
    );
    const sectorCircumference = Math.valueFromPercentage(
      sectorPercentage,
      graphData.circumference
    );
    const labelAngle = this.labelAngle(sectorCircumference, graphData);
    const separatorAngle = this.sectorSeparatorAngle(
      sectorCircumference,
      graphData
    );

    return {
      id: id,
      center: {
        x: 50,
        y: 50
      },
      innerRadius: graphData.innerRadius,
      radius: graphData.radius,
      circumference: sectorCircumference,
      percentage: sectorPercentage,
      fill: "none",
      stroke: {
        color: sectorData.color,
        width: this.getStyleStrokeWidth(
          graphData.innerRadius,
          graphData.doughnutSize
        ),
        dashArray: `${sectorCircumference} ${graphData.circumference}`
      },
      transform: {
        rotation:
          (graphData.processedCircumference * 360) / graphData.circumference -
          graphData.rotationDisplacement,
        origin: "center"
      },
      label: {
        value: sectorData.value,
        angle: labelAngle
      },
      separator: {
        angle: separatorAngle
      }
    } as SVGSectorData;
  };

  labelAngle = (sectorCircumferenceSize: number, graphData: GraphData) =>
    ((graphData.processedCircumference + sectorCircumferenceSize / 2) * 360) /
      graphData.circumference -
    graphData.rotationDisplacement;

  sectorSeparatorAngle = (
    sectorCircumferenceSize: number,
    graphData: GraphData
  ) =>
    ((graphData.processedCircumference + sectorCircumferenceSize) * 360) /
    graphData.circumference;

  mouseOver = (event: MouseEvent) => {
    let sector = event.target as SVGCircleElement;
    let id = Number(sector.id);
    if (isNaN(id)) {
      id = Number(sector.id.split("_")[1]);
      sector = this.graphSVG.getElementById(`${id}`) as SVGCircleElement;
    }
    let description = this.descriptionDiv.getElementsByClassName(
      `square_${id}`
    )[0] as HTMLDivElement;

    description.style.backgroundColor = `${this.darken(
      this.sectorsData[id].color,
      20
    )}`;

    sector.style.stroke = `${this.darken(this.sectorsData[id].color, 20)}`;

    const percentage = this.getPercentageToolTip(id);
    const value = this.sectorsData[id].value;

    if (this.props.currency)
      this.props.showToolTip(
        `${this.getFormattedValue(value)} - ${percentage}% ${
          this.sectorsData[id].description
        }`
      );
    else
      this.props.showToolTip(
        `${percentage}% ${this.sectorsData[id].description}`
      );
  };

  getFormattedValue = (value: number) => {
    if (this.props.currency) return formatter.format(value);
    else return value;
  };

  getPercentageToolTip = (id: number) => {
    const percentage = Math.percentageFromValue(
      this.sectorsData[id].value,
      this.graphData.total
    );
    if (percentage < 3) return percentage.toFixed(2);
    else
      return Math.round(
        Math.percentageFromValue(
          this.sectorsData[id].value,
          this.graphData.total
        )
      );
  };

  mouseLeave = (event: MouseEvent) => {
    let sector = event.target as SVGCircleElement;
    let id = Number(sector.id);
    if (isNaN(id)) {
      id = Number(sector.id.split("_")[1]);
      sector = this.graphSVG.getElementById(`${id}`) as SVGCircleElement;
    }
    let description = this.descriptionDiv.getElementsByClassName(
      `square_${id}`
    )[0] as HTMLDivElement;

    description.style.backgroundColor = `${this.sectorsData[id].color}`;

    sector.style.stroke = `${this.sectorsData[id].color}`;

    this.props.hideToolTip();
  };

  click = (event: MouseEvent) => {
    const sector = event.target as HTMLElement;
    let id = Number(sector.id);
    if (isNaN(id)) {
      id = Number(sector.id.split("_")[1]);
    }

    if (
      this.sectorsData[id].description === "Other" &&
      this.otherData !== null
    ) {
      this.sectorsData = this.otherData;
      this.drawn = false;
      this.sectorBeingAnimated = -1;
      this.resize();
      this.createShowPreviousSVG();
    }
  };

  darken = (color: string, percentage: number) => {
    const HexColor = color.replace("#", "");
    const red = parseInt(HexColor.substr(0, 2), 16);
    const green = parseInt(HexColor.substr(2, 2), 16);
    const blue = parseInt(HexColor.substr(4, 2), 16);
    const newRed = Math.round(red - (percentage * red) / 100);
    const newGreen = Math.round(green - (percentage * green) / 100);
    const newBlue = Math.round(blue - (percentage * blue) / 100);
    const hexRed =
      newRed >= 16 ? `${newRed.toString(16)}` : `0${newRed.toString(16)}`;
    const hexGreen =
      newGreen >= 16 ? `${newGreen.toString(16)}` : `0${newGreen.toString(16)}`;
    const hexBlue =
      newBlue >= 16 ? `${newBlue.toString(16)}` : `0${newBlue.toString(16)}`;

    return `#${hexRed}${hexGreen}${hexBlue}`;
  };

  resize = () => {
    this.graphSVG.innerHTML = "";
    this.graphSVG.removeAttribute("viewBox");
    this.descriptionDiv.innerHTML = "";
    this.drawGraph();
  };

  getGraphsTotalValue = () => {
    let totalValue = 0;
    this.props.data.map(element => {
      totalValue += element.value;
    });

    return totalValue;
  };

  getTotalValue = () => {
    let totalValue = 0;
    this.sectorsData.map(element => {
      totalValue += element.value;
    });

    return totalValue;
  };

  getViewPortSize = () =>
    this.graphSVG.height.baseVal.value < this.graphSVG.clientWidth
      ? this.graphSVG.height.baseVal.value
      : this.graphSVG.clientWidth;

  getStyleRadius = (viewPortSize: number, doughnutSize: number) => {
    const scalePercentage = viewPortSize * 0.4;
    let radius = scalePercentage - doughnutSize / 2;

    if (this.props.style === GraphStyles.doughnut) {
      return radius;
    } else {
      return radius / 2 + doughnutSize / 4;
    }
  };

  getCircumference = (radius: number) => Math.PI * 2 * radius;

  getStyleStrokeWidth = (radius: number, doughnutSize: number) =>
    this.props.style === GraphStyles.doughnut ? doughnutSize : radius * 2;

  createGraphSector = (sectorData: SVGSectorData) => {
    let circle = this.createSVGCircle(sectorData);
    let label = this.createValueLabel(sectorData);

    this.graphSVG.insertBefore(circle, this.graphSVG.children[sectorData.id]);
    if (!this.drawn) this.animateSector(circle, sectorData, 1000);
    if (sectorData.percentage >= 3) this.graphSVG.appendChild(label);
  };

  animateSector = (
    sector: SVGCircleElement,
    sectorData: SVGSectorData,
    timeWholeAnimation: number
  ) => {
    const dashArray = sectorData.stroke.dashArray.split(" ");
    const sectorCircumference = Number(dashArray[0]);
    const graphCircumference = Number(dashArray[1]);
    let animatedCircumference = 0;
    const tick = 5;
    const ticksToFinishAnimation = timeWholeAnimation / tick;
    const growingFactor = graphCircumference / ticksToFinishAnimation;
    let ticks = 0;

    let frame = () => {
      ticks++;
      if (this.sectorBeingAnimated === -1)
        this.sectorBeingAnimated = sectorData.id;

      if (sectorData.id === this.sectorBeingAnimated) {
        if (animatedCircumference + growingFactor > sectorCircumference)
          animatedCircumference = sectorCircumference;
        else animatedCircumference += growingFactor;

        sector.setAttribute(
          "stroke-dasharray",
          `${animatedCircumference} ${graphCircumference}`
        );

        if (animatedCircumference === sectorCircumference) {
          this.sectorBeingAnimated++;
          clearInterval(animation);
        }
      }
    };

    const animation = setInterval(frame, 5);
  };

  createSVGCircle = (sectorData: SVGSectorData) => {
    let circle = document.createElementNS(svgXmlns, "circle");
    const graphCircumference = sectorData.stroke.dashArray.split(" ")[1];

    circle.setAttributeNS(null, "id", `${sectorData.id}`);
    circle.setAttributeNS(null, "cx", `${sectorData.center.x}%`);
    circle.setAttributeNS(null, "cy", `${sectorData.center.y}%`);
    circle.setAttributeNS(null, "r", `${sectorData.innerRadius}`);
    circle.setAttributeNS(null, "fill", `${sectorData.fill}`);
    circle.setAttributeNS(null, "stroke", `${sectorData.stroke.color}`);
    circle.setAttributeNS(null, "stroke-width", `${sectorData.stroke.width}`);
    if (!this.drawn)
      circle.setAttributeNS(
        null,
        "stroke-dasharray",
        `0 ${graphCircumference}`
      );
    else
      circle.setAttributeNS(
        null,
        "stroke-dasharray",
        `${sectorData.stroke.dashArray}`
      );

    circle.setAttributeNS(
      null,
      "transform",
      `rotate(${sectorData.transform.rotation})`
    );
    circle.setAttributeNS(
      null,
      "transform-origin",
      `${sectorData.transform.origin}`
    );
    circle.addEventListener("mouseover", this.mouseOver);
    circle.addEventListener("mouseleave", this.mouseLeave);
    circle.addEventListener("click", this.click);

    return circle;
  };

  createValueLabel = ({ label, ...circleData }: SVGSectorData) => {
    const spacing = this.props.currency ? 25 : 15;
    let x =
      this.graphSVG.clientWidth / 2 +
      (circleData.radius + spacing) * Math.cos(this.toRadians(label.angle));

    let y =
      this.graphSVG.height.baseVal.value / 2 +
      (circleData.radius + spacing) * Math.sin(this.toRadians(label.angle));

    let SVGLabel = document.createElementNS(svgXmlns, "text");
    SVGLabel.setAttributeNS(null, "x", `${x}`);
    SVGLabel.setAttributeNS(null, "y", `${y < 12 ? 12 : y}`);
    SVGLabel.setAttributeNS(null, "fill", `#656565`);
    SVGLabel.setAttributeNS(null, "font-size", `16`);
    SVGLabel.setAttributeNS(null, "font-weight", `bold`);
    SVGLabel.setAttributeNS(null, "text-anchor", `middle`);
    if (this.props.currency)
      SVGLabel.innerHTML = `${formatter.format(label.value)}`;
    else SVGLabel.innerHTML = `${label.value}`;

    return SVGLabel;
  };

  createDescriptionElement = (
    id: number,
    color: string,
    description: string
  ) => {
    //INSERTING DESCRIPTION FIELD
    let descriptionField = document.createElement("div");
    descriptionField.className = "description-field";

    this.descriptionDiv.appendChild(descriptionField);

    let colorDiv = document.createElement("div");
    colorDiv.className = "colorDiv";
    let descriptionDiv = document.createElement("div");
    descriptionDiv.className = "descDiv";

    descriptionField.appendChild(colorDiv);
    descriptionField.appendChild(descriptionDiv);

    //INSERTING COLOR SQUARE
    let colorSquare = document.createElement("div");
    colorSquare.className = `color-square square_${id}`;
    colorSquare.id = `square_${id}`;
    colorSquare.style.backgroundColor = color;
    colorSquare.addEventListener("mouseover", this.mouseOver);
    colorSquare.addEventListener("mouseleave", this.mouseLeave);
    colorSquare.addEventListener("click", this.click);

    colorDiv.appendChild(colorSquare);

    // INSERTING DESCRIPTION
    let descriptionLabel = document.createElement("p");
    descriptionLabel.className = "description";
    descriptionLabel.innerHTML = description;

    descriptionDiv.appendChild(descriptionLabel);
  };

  createSectorSeparator = (sectorData: SVGSectorData, angle: number) => {
    let line = document.createElementNS(svgXmlns, "line");
    line.setAttributeNS(null, "x1", `${sectorData.center.x}%`);
    line.setAttributeNS(null, "y1", `${sectorData.center.y}%`);
    line.setAttributeNS(null, "x2", `${sectorData.center.x}%`);
    line.setAttributeNS(
      null,
      "y2",
      `${
        this.props.style === GraphStyles.doughnut
          ? this.graphSVG.height.baseVal.value / 2 -
            sectorData.stroke.width / 2 -
            sectorData.innerRadius
          : this.graphSVG.height.baseVal.value / 2 - sectorData.stroke.width
      }`
    );
    line.setAttributeNS(null, "stroke", "white");
    line.setAttributeNS(null, "stroke-width", "3");
    line.setAttributeNS(null, "transform", `rotate(${angle})`);
    line.setAttributeNS(
      null,
      "transform-origin",
      `${sectorData.transform.origin}`
    );

    this.graphSVG.appendChild(line);
  };

  createTitle = (total: number) => {
    let titleLabel = document.createElementNS(svgXmlns, "text");
    titleLabel.setAttributeNS(null, "x", "50%");
    titleLabel.setAttributeNS(null, "y", `50%`);
    titleLabel.setAttributeNS(null, "fill", `black`);
    titleLabel.setAttributeNS(null, "font-size", `22`);
    titleLabel.setAttributeNS(null, "font-weight", `bold`);
    titleLabel.setAttributeNS(null, "text-anchor", `middle`);
    titleLabel.innerHTML = `${this.props.title}`;

    let totalLabel = document.createElementNS(svgXmlns, "text");
    totalLabel.setAttributeNS(null, "x", "50%");
    totalLabel.setAttributeNS(
      null,
      "y",
      `${this.graphSVG.height.baseVal.value / 2 + 20}`
    );
    totalLabel.setAttributeNS(null, "text-anchor", `middle`);
    totalLabel.setAttributeNS(null, "fill", `black`);
    totalLabel.setAttributeNS(null, "font-size", `22`);
    totalLabel.setAttributeNS(null, "font-weight", `bold`);
    if (this.props.currency)
      totalLabel.innerHTML = `${formatter.format(total)}`;
    else totalLabel.innerHTML = `${total}`;

    this.graphSVG.appendChild(titleLabel);
    this.graphSVG.appendChild(totalLabel);
  };

  mouseOverReturn = () => {
    const htmlElement = this.graphSVG.getElementById(
      "return"
    ) as SVGPathElement;

    htmlElement.setAttribute("fill", this.darken("#8ac349", 10));
    htmlElement.setAttribute("stroke", this.darken("#8ac349", 10));
  };

  mouseLeaveReturn = () => {
    const htmlElement = this.graphSVG.getElementById(
      "return"
    ) as SVGPathElement;

    htmlElement.setAttribute("fill", "#8ac349");
    htmlElement.setAttribute("stroke", "#8ac349");
  };

  returnToDefault = () => {
    this.cleanSectorsData();
    this.drawn = false;
    this.sectorBeingAnimated = -1;
    this.resize();
  };

  createShowPreviousSVG = () => {
    const rect = document.createElementNS(svgXmlns, "rect");
    const returnSVG = document.createElementNS(svgXmlns, "path");

    returnSVG.setAttribute(
      "d",
      "M248.625,89.25V0l-127.5,127.5l127.5,127.5V140.25c84.15,0,153,68.85,153,153c0,84.15-68.85,153-153,153c-84.15,0-153-68.85-153-153h-51c0,112.2,91.8,204,204,204s204-91.8,204-204S360.825,89.25,248.625,89.25z"
    );
    returnSVG.setAttribute("stroke", "#8ac349");
    returnSVG.setAttribute("fill", "#8ac349");
    returnSVG.setAttribute("transform", "translate(241 10) scale(0.05)");
    returnSVG.setAttribute("id", "return");
    returnSVG.setAttribute("style", "cursor: pointer;");
    returnSVG.addEventListener("mouseover", this.mouseOverReturn);
    returnSVG.addEventListener("mouseleave", this.mouseLeaveReturn);
    returnSVG.addEventListener("click", this.returnToDefault);

    rect.setAttribute("fill", "white");
    rect.setAttribute("x", "243");
    rect.setAttribute("y", "10");
    rect.setAttribute("width", "20");
    rect.setAttribute("height", "25");
    rect.setAttribute("style", "cursor: pointer;");
    rect.addEventListener("mouseover", this.mouseOverReturn);
    rect.addEventListener("mouseleave", this.mouseLeaveReturn);
    rect.addEventListener("click", this.returnToDefault);

    this.graphSVG.appendChild(rect);
    this.graphSVG.appendChild(returnSVG);
  };

  panSVGLeft = (radius: number) => {
    this.graphSVG.setAttribute(
      "viewBox",
      `-${this.graphSVG.clientWidth / 2 - (radius + 15)} 0 ${
        this.graphSVG.clientWidth
      } ${this.graphSVG.height.baseVal.value}`
    );
  };

  getGraphRadius = (innerRadius: number, strokeSize: number) =>
    this.props.style === GraphStyles.doughnut
      ? this.getStyleStrokeWidth(innerRadius, strokeSize) / 2 + innerRadius
      : this.getStyleStrokeWidth(innerRadius, strokeSize);

  toRadians = (degrees: number) => {
    return degrees * (Math.PI / 180);
  };
}

const mapDispatchToProps = (dispatch: Dispatch) => ({
  showToolTip: (message: string) => {
    dispatch(System.Store.Config.showToolTip(message));
  },

  hideToolTip: () => {
    dispatch(System.Store.Config.hideToolTip());
  }
});

export default connect(
  null,
  mapDispatchToProps
)(CircularGraph);
