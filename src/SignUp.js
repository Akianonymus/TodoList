import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { API_URL } from "./utils";
import Form from "./component/Form";

const SignUp = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [spinner, setSpinner] = useState(false);

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
      url: `${API_URL}/auth/register`,
      data: { email: email, password },
    };

    setMsg("Trying to Sign Up..");
    setSpinner(true);
    axios(configuration)
      .then((result) => {
        setSpinner(false);

        navigate("/signin", {
          replace: true,
          state: { message: "Sign Up was successful." },
        });
      })
      .catch((error) => {
        setSpinner(false);
        setMsg("SignUp Failed");
        console.log(error.response);
      });
  };

  return (
    <Form
      info={{
        header: "Sign Up",
        submit: "Sign Up",
        b1: "Already have an account ?",
        b2: "Sign In",
        blink: "/signin",
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

export default SignUp;
