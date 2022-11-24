import { Fragment, useState } from "react";
import { Route, Routes } from "react-router-dom";
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
      .then((_) => {
        console.log("Good token");
      })
      .catch((error) => {
        console.log("Bad token");
        setToken("");
        cookies.remove("token");
        cookies.remove("user");
        console.log(error.response);
      });

  const t = { token, setToken };
  return (
    <Fragment>
      <Header />
      <Navbar loggedIn={t} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signin" element={<SignIn loggedIn={t} />} />
        <Route path="/signup" element={<SignUp loggedIn={t} />} />
        <Route path="/logout" element={<LogOut loggedIn={t} />} />
        <Route path="/todos" element={<Todos loggedIn={t} />} />
      </Routes>
    </Fragment>
  );
}

export default App;
