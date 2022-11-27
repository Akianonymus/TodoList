import axios from "axios";
import { useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import Form from "./component/Form";
import API_URL from "./utils";

const cookies = new Cookies();

const SignIn = ({ loggedIn }) => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
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

    if (username === "") {
      setMsg(`Username blank`);
      return;
    }

    if (password === "") {
      setMsg(`Password blank`);
      return;
    }

    const configuration = {
      method: "post",
      url: `${API_URL}/signin`,
      data: {
        username,
        password,
      },
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
        // set the cookie
        cookies.set("token", result.data.token, cookieOpt);
        cookies.set("user", username, cookieOpt);

        loggedIn.setToken(result.data.token);

        setMsg(`Sign In was successful. Redirecting to HomePage in 2 seconds.`);
        setSpinner(false);

        navigate("/", {
          replace: true,
          state: { message: "Welcome " + username.toUpperCase() },
        });
      })
      .catch((error) => {
        setSpinner(false);

        const res = error.response;
        switch (res.status) {
          case 401:
            setMsg("Wrong password.");
            break;
          case 404:
            setMsg(
              `Given username doesn't exist [ ${username} ]. Sign In Failed.`
            );
            break;
          default:
            setMsg("Sign In Failed");
            console.log(error.response);
            break;
        }
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
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
      spinner={spinner}
    />
  );
};
export default SignIn;
