import axios from "axios";

interface LoginCredentials {
  userName: string;
  password: string;
}

/**Contains all functions to talk to the Login Service **_"/login"_**.
 *
 */
export namespace Login {
  export interface LoginError {
    error: boolean;
  }

  export interface LoginInternalError {
    internalError: {
      error: any;
    };
  }

  export interface LoginData {
    _id: string;
    inHotelId: string;
    name: string;
    hotels: [
      {
        id: string;
        name: string;
      }
    ];
    accessRights: [string];
    token: string;
  }

  export interface LoginSuccess {
    id: string;
    inHotelId: string;
    name: string;
    hotels: [
      {
        id: string;
        name: string;
      }
    ];
    accessRights: [string];
    token: string;
  }

  export type LoginResponse = LoginError | LoginInternalError | LoginSuccess;

  /**Logs in the user as provided in the **_cedentials_**
   *
   * @param credentials The _userName_ and _password_ of the User to login.
   * @return {LoginResponse} [_**LoginResponse**_]('./Login.service.ts')
   */
  export const login: (
    credentials: LoginCredentials
  ) => Promise<LoginResponse> = async credentials => {
    try {
      const response = await axios.post("/login", credentials);
      if (!response.data.error) {
        const { _id, ...restData } = response.data as LoginData;
        const login = { id: _id, ...restData };
        return <LoginSuccess>login;
      } else {
        return <LoginError>{ error: true };
      }
    } catch (e) {
      return <LoginInternalError>{ internalError: { error: e } };
    }
  };
}
