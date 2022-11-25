import axios from "axios";
import { Fragment, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";

import API_URL from "./utils.js";
import Form from "./component/Form";
import Message from "./component/Message";

const cookies = new Cookies();

const SignUp = ({ loggedIn }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");

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
      url: `${API_URL}/signup`,
      data: { username, password },
    };

    const cookieOpt = {
      path: "/",
      secure: true,
      sameSite: "Strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    };

    axios(configuration)
      .then((result) => {
        // set the cookie
        cookies.set("token", result.data.token, cookieOpt);
        cookies.set("user", username, cookieOpt);

        loggedIn.setToken(result.data.token);

        navigate("/", {
          replace: true,
          state: {
            message:
              "Sign Up was successful. Welcome " + username.toUpperCase(),
          },
        });
      })
      .catch((error) => {
        const res = error.response;
        switch (res.status) {
          case 409:
            setMsg("Username " + username + " already exists.");
            break;
          default:
            setMsg("SignUp Failed");
            console.log(error.response);
            break;
        }
      });
  };

  return (
    <Fragment>
      <Message msg={msg} setMsg={setMsg} />
      <Form
        info={{
          header: "Sign Up",
          submit: "Sign Up",
          b1: "Already have an account ?",
          b2: "Sign In",
          blink: "/signin",
        }}
        username={username}
        setUsername={setUsername}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
    </Fragment>
  );
};

export default SignUp;