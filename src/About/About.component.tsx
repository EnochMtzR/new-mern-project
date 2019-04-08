import * as React from "react";

require("./About.component.scss");

let clicks = 0;

const click = () => {
  clicks++;
  if (clicks === 3) {
    const easterEgg = document.getElementById("EasterEgg");

    easterEgg.style.display = "grid";
    clicks = 0;
  }
};

const easterEggClicked = () => {
  const easterEgg = document.getElementById("EasterEgg");

  easterEgg.style.display = "none";
};

export const About: React.SFC = () => (
  <div className="About-Page">
    <div id="EasterEgg" className="EasterEgg" onClick={easterEggClicked}>
      <div className="container">
        <img
          className="CodeName_img"
          src={require("../common/images/Anthoid_Abutilon_isoType.svg")}
        />
        <span className="CodeName">Anthoid Abutilon V1.0 Beta</span>
      </div>
    </div>
    <div className="logo">
      <img
        className="image"
        src={require("../common/images/InHotel_Logo.svg")}
      />
    </div>
    <h1 className="Title" onClick={click}>
      <span className="SystemName">InHotel</span>
      <span className="CodeName">Anthoid Abutilon V1.0 Beta</span>
    </h1>
    <div className="Bottom">
      <p className="developed_by">Developed By:</p>
      <div className="inhys_logo_container">
        <span className="icon icon-Integra_Logo" />
      </div>
    </div>
  </div>
);
