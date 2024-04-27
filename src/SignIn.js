import axios from "axios";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Form from "./component/Form";
import { API_URL } from "./utils";

const cookies = new Cookies();

const SignIn = ({ loggedIn }) => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const location = new useLocation();
  const [msg, setMsg] = useState(location?.state?.message || "");
  const [spinner, setSpinner] = useState(false);

  if (loggedIn.token !== "")
    return (
      <Navigate
        to="/"
        replace={true}
        state={{ message: "Already Logged In" }}
      />
    );

  const handleSubmit = (e) => {
    setMsg("");
    // prevent the form from refreshing the whole page
    e.preventDefault();

    if (email === "") {
      setMsg(`Email blank`);
      return;
    }

    if (password === "") {
      setMsg(`Password blank`);
      return;
    } else if (password.length < 6) {
      setMsg(`Password less than 6 characters`);
      return;
    }

    const configuration = {
      method: "post",
      url: `${API_URL}/auth/login`,
      data: { email: email, password },
    };

    const cookieOpt = {
      path: "/",
      secure: true,
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };

    setMsg("Trying to sign in..");
    setSpinner(true);
    axios(configuration)
      .then((result) => {
        console.log(result.data.data);
        // set the cookie
        const token = result.data.data.accessToken;
        const refreshToken = result.data.data.refreshToken;
        const name = result.data.data.name;
        cookies.set("access_token", token, cookieOpt);
        cookies.set("refresh_token", refreshToken, cookieOpt);
        cookies.set("email", email, cookieOpt);
        cookies.set("name", name, cookieOpt);

        loggedIn.setToken(token);

        setMsg(`Sign In was successful. Redirecting to HomePage in 2 seconds.`);
        setSpinner(false);

        navigate("/", {
          replace: true,
          state: { message: "Welcome " + name.toUpperCase() },
        });
      })
      .catch((error) => {
        setSpinner(false);
        setMsg("Sign In Failed");
        console.log(error.response);
      });
  };

  return (
    <Form
      info={{
        header: "Sign In",
        submit: "Sign In",
        b1: "Don't have an account ?",
        b2: "Sign Up",
        blink: "/signup",
      }}
      msg={msg}
      setMsg={setMsg}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      spinner={spinner}
    />
  );
};
export default SignIn;
