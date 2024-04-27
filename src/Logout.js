import { useEffect } from "react";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";

const cookies = new Cookies();

const LogOut = ({ loggedIn }) => {
  const navigate = useNavigate();
  const cookieOpt = { path: "/", sameSite: "strict" };
  cookies.remove("access_token", cookieOpt);
  cookies.remove("refresh_token", cookieOpt);
  cookies.remove("email", cookieOpt);
  cookies.remove("name", cookieOpt);

  useEffect(() => {
    loggedIn?.setToken("");
    navigate("/signin", {
      replace: true,
      state: { message: "Log Out Successful" },
    });
  }, [loggedIn, navigate]);
};

export default LogOut;
