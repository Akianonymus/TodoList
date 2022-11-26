import { Fragment, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Navbar from "./NavBar";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LogOut from "./Logout";
import Todos from "./Todos";
import Cookies from "universal-cookie";
import axios from "axios";
import API_URL from "./utils.js";

const cookies = new Cookies();
const cookie = cookies.get("token") || "";

function App() {
  const [token, setToken] = useState(cookie);

  const configuration = {
    method: "get",
    url: `${API_URL}/auth`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  if (token !== "")
    axios(configuration)
      .then((_) => {})
      .catch((error) => {
        switch (error.code) {
          case "ERR_NETWORK":
            console.log(error.message);
            break;
          case "ERR_BAD_REQUEST":
            const res = error?.response;
            switch (res.status) {
              case 401:
                setToken("");
                cookies.remove("token");
                cookies.remove("user");
                break;
              default:
                console.log(error.message);
                console.log(res.statusText);
                break;
            }
            break;
          default:
            console.log(error);
            break;
        }
      });

  const t = { token, setToken };
  return (
    <Fragment>
      <Header />
      <Navbar loggedIn={t} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace={true} />} />
        <Route path="/signin" element={<SignIn loggedIn={t} />} />
        <Route path="/signup" element={<SignUp loggedIn={t} />} />
        <Route path="/logout" element={<LogOut loggedIn={t} />} />
        <Route path="/todos" element={<Todos loggedIn={t} />} />
      </Routes>
    </Fragment>
  );
}

export default App;
