import axios from "axios";
import { useEffect, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";

import Home from "./Home";
import Navbar from "./Navbar";
import Todos from "./Todos";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LogOut from "./Logout";

import API_URL from "./utils.js";

const cookies = new Cookies();
const cookie = cookies.get("token") || "";

function App() {
  const [darkMode, setDarkMode] = useState(null);
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
      .then((_) => { })
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

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  //

  // update local storage when theme changes
  useEffect(() => {
    if (darkMode !== null)
      if (darkMode)
        // Whenever the user explicitly chooses light mode
        localStorage.theme = "dark";
      // Whenever the user explicitly chooses dark mode
      else localStorage.theme = "light";
  }, [darkMode]);

  // if theme var found in localStorage then use it
  // otherwise check prefers-color-scheme
  useEffect(() => {
    console.log(localStorage.theme);
    if (
      localStorage.theme === "dark" ||
      ((localStorage?.theme !== "light" || !("theme" in localStorage)) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setDarkMode(true);
      localStorage.theme = "dark";
    } else {
      setDarkMode(false);
      localStorage.theme = "light";
    }
  }, [setDarkMode]);

  const t = { token, setToken };
  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white min-h-screen text-sky-900 dark:text-sky-100 dark:bg-gray-900">
        <div className="sticky top-0 backdrop-blur">
          <Navbar loggedIn={t} darkMode={darkMode} setDarkMode={setDarkMode} />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace={true} />} />
          <Route path="/signin" element={<SignIn loggedIn={t} />} />
          <Route path="/signup" element={<SignUp loggedIn={t} />} />
          <Route path="/logout" element={<LogOut loggedIn={t} />} />
          <Route path="/todos" element={<Todos loggedIn={t} />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
