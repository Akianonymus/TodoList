import axios from "axios";
import { useMemo, useState } from "react";
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

const redirectTo = (msg = "You need to Login First", path = "/signin") => (
  <Navigate to={path} replace={true} state={{ message: msg }} />
);

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

  // update local storage when theme changes
  useMemo(() => {
    if (darkMode !== null)
      if (darkMode)
        // Whenever the user explicitly chooses dark mode
        localStorage.theme = "dark";
      // Whenever the user explicitly chooses light mode
      else localStorage.theme = "light";
  }, [darkMode]);

  // if theme var found in localStorage then use it
  // otherwise check prefers-color-scheme
  useMemo(() => {
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
  }, []);

  const t = { token, setToken };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="bg-white min-h-screen text-sky-900 dark:text-sky-100 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="sticky top-0 backdrop-blur">
            <Navbar
              loggedIn={t}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate to="/" replace={true} />} />
            <Route
              path="/signin"
              element={
                token === "" ? (
                  <SignIn loggedIn={t} />
                ) : (
                  redirectTo("Already Logged In", "/")
                )
              }
            />
            <Route path="/signup" element={<SignUp loggedIn={t} />} />
            <Route path="/logout" element={<LogOut loggedIn={t} />} />
            <Route
              path="/todos"
              element={
                token === "" ? (
                  redirectTo("You need to Login First")
                ) : (
                  <Todos loggedIn={t} />
                )
              }
            />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
