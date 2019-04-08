import { Config } from "../Config/Config";
import { configureStore } from "../configureStore";

describe("Testing config.actions.ts", () => {
  describe("Testing changeLanguage() Action", () => {
    test("should return changeLanguage action object", () => {
      const returnedAction = Config.changeLanguage(Config.languages.english);
      expect(returnedAction).toEqual({
        type: Config.Actions.Types.changeLanguage,
        language: Config.languages.english
      });
    });
  });
});
