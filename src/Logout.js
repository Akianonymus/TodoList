import { Navigate } from "react-router";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const LogOut = ({ loggedIn }) => {
  const cookieOpt = { path: "/", sameSite: "strict" };
  cookies.remove("access_token");
  cookies.remove("user", cookieOpt);

  loggedIn.setToken("");
  return (
    <Navigate to="/" replace={true} state={{ message: "Log Out Successful" }} />
  );
};

export default LogOut;
