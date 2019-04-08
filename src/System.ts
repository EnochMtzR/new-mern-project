import { Services as _Services } from "./Services/Services";
import { LocalStore as _Store } from "./store/Store";
import * as locale from "./locales/data.json";
import * as moment from "moment";

/**Holds all InHotel's code necesary to talk to **_Services_** or to affect the **_Store_**
 * As well as some global **_Interfaces_** and **_functions_**.
 */
export namespace System {
  export import Services = _Services;
  export import Store = _Store;

  export const getLocaleText = (id: string, language: string) => {
    const localeData: locale.LocaleData = locale;
    return localeData[language][id];
  };

  export enum ReservationStatus {
    NOT_GUARANTEED = "1",
    GUARANTEED = "2",
    IN_HOUSE = "4",
    DEPARTURE = "5"
  }

  export interface Room {
    id: string;
    type: string;
  }

  export interface Availability {
    date: moment.Moment;
    availability: number;
  }

  export class RoomBlock {
    id: string;
    startDate: moment.Moment;
    endDate: moment.Moment;
    roomId: string;
  }

  export class Reservation extends RoomBlock {
    status: string;
    hasASignedRoom: boolean;
    guest: string;
    agency: string;
    notes: string;

    set arrivalDate(value: moment.Moment) {
      this.startDate = value;
    }

    get arrivalDate() {
      return this.startDate;
    }

    set departureDate(value: moment.Moment) {
      this.endDate = value;
    }

    get departureDate() {
      return this.endDate;
    }
  }

  export class OutOfService extends RoomBlock {
    description: string;
  }

  export interface RoomAvailabilityResponse {
    roomTypes: string[];
    rooms: Room[];
    availability: Availability[];
    reservations: Reservation[];
    OutOfService: OutOfService[];
  }

  export const cleanTooltipAndContextMenu = () => {
    let state = JSON.parse(localStorage.getItem("state")) as System.Store.State;
    if (state) {
      state.config.contextMenu = undefined;
      state.config.toolTip = "";

      localStorage.setItem("state", JSON.stringify(state));
    }
  };
}

declare global {
  interface String {
    /** Capitalizes the first letters of each word, except conjunctions and prepositions */
    toTitleCase(): string;
  }

  interface Math {
    /**
     * Calculates the **percentage** based on the **value** and **total** given.
     *
     * **_Note: the base factor (which defaults to 100) is the whole that the total represents._**
     *
     * ex. `total=5 represents the 100%; value=1 represents ?%`
     *
     * `total=157 represents 360° value=2 represents ?°`
     *
     */
    percentageFromValue(
      value: number,
      total: number,
      baseFactor?: number
    ): number;

    /**
     * Calculates the **percentage** based on the **value** and **total** given.
     *
     * **_Note: the base factor (which defaults to 100) is the whole that the total represents._**
     *
     * ex. `total=5 represents the 100%; percentage=10% represents ?`
     *
     * `total=157 represents 360° value=90° represents ?`
     *
     */
    valueFromPercentage(
      percentage: number,
      total: number,
      baseFactor?: number
    ): number;
  }
}

Math.percentageFromValue = function(
  value: number,
  total: number,
  baseFactor = 100
) {
  return (value * baseFactor) / total;
};

Math.valueFromPercentage = function(
  percentage: number,
  total: number,
  baseFactor = 100
) {
  return (percentage * total) / baseFactor;
};

String.prototype.toTitleCase = function() {
  var i, j, str, lowers, uppers;
  str = this.replace(/([^\W_]+[^\s-]*) */g, function(txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });

  // Certain minor words should be left lowercase unless
  // they are the first or last words in the string
  lowers = [
    "A",
    "An",
    "The",
    "And",
    "But",
    "Or",
    "For",
    "Nor",
    "As",
    "At",
    "By",
    "For",
    "From",
    "In",
    "Into",
    "Near",
    "Of",
    "On",
    "Onto",
    "To",
    "With"
  ];
  for (i = 0, j = lowers.length; i < j; i++)
    str = str.replace(new RegExp("\\s" + lowers[i] + "\\s", "g"), function(
      txt: string
    ) {
      return txt.toLowerCase();
    });

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ["Id", "Tv"];
  for (i = 0, j = uppers.length; i < j; i++)
    str = str.replace(
      new RegExp("\\b" + uppers[i] + "\\b", "g"),
      uppers[i].toUpperCase()
    );

  return str;
};

document.oncontextmenu = () => false;
