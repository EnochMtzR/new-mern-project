import { Config } from "../Config/Config";

describe("Testing config.reducer.ts", () => {
  describe("Testing reducer", () => {
    test(`Should return default state on action ${
      Config.Actions.Types
    } `, () => {
      const returnedState = Config.reducer(undefined, {
        type: Config.Actions.Types.init
      });
      expect(returnedState).toEqual(Config.defaultState);
    });

    test(`Should return changed language in state on ${
      Config.Actions.Types.changeLanguage
    }`, () => {
      const returnedState = Config.reducer(undefined, {
        type: Config.Actions.Types.changeLanguage,
        language: Config.languages.english
      });
      expect(returnedState.language).toBe(Config.languages.english);
    });
  });
});
