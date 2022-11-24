import { useEffect } from "react";
import { Navigate } from "react-router";
import Cookies from "universal-cookie";

const cookies = new Cookies();

const LogOut = ({ loggedIn }) => {
  useEffect(() => {
    const cookieOpt = { path: "/", sameSite: "strict" };
    cookies.remove("token", cookieOpt);
    cookies.remove("user", cookieOpt);

    loggedIn.setToken("");
  }, [loggedIn]);

  return (
    <Navigate to="/" replace={true} state={{ message: "Log Out successful" }} />
  );
};
export default LogOut;
