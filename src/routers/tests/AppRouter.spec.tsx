import * as React from "react";
import { shallow } from "enzyme";
import { AppRouter, mapStateToProps } from "../AppRouter";
import { System } from "app/System";

const { User, Config, defaultState } = System.Store;

describe("Testing AppRouter.tsx", () => {
  test("Should render component Correctly", () => {
    const wrapper = shallow(
      <AppRouter user={User.defaultState} config={Config.defaultState} />
    );

    expect(wrapper).toMatchSnapshot();
  });

  test("Should return correct state in mapStateToProps()", () => {
    const returnedState = mapStateToProps(defaultState);
    expect(returnedState).toEqual(defaultState);
  });
});
