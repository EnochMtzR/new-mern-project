import { Login as _Login } from "./Login/Login.service";

/**Holds all InHotel's code necessary to talk to any service in the application.
 * It includes: **_Login_**, **_Logout_**, **_Add Users_**, **_Update User Info_**,
 * **_Delete Users_**, **_Send Requests to Local InHotel_**, etc. . .
 */
export namespace Services {
  export import Login = _Login;
}
