import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import Cookies from "universal-cookie";

import Home from "./Home";
import Navbar from "./Navbar";
import Notes from "./Notes";
import SignIn from "./SignIn";
import SignUp from "./SignUp";
import LogOut from "./Logout";

import { API_URL, refreshAccessToken } from "./utils";

const cookies = new Cookies();

const redirectTo = (msg = "You need to Login First", path = "/signin") => (
  <Navigate to={path} replace={true} state={{ message: msg }} />
);

function App() {
  const [darkMode, setDarkMode] = useState(null);
  const [accessToken, setAccessToken] = useState(
    cookies.get("access_token") || "",
  );
  const refreshToken = cookies.get("refresh_token") || "";

  useEffect(() => {
    const configuration = {
      method: "get",
      url: `${API_URL}/auth`,
      headers: { access_token: accessToken },
    };
    if (accessToken !== "") {
      axios(configuration)
        .then((_) => {})
        .catch((error) => {
          console.log(error.code);
          switch (error.code) {
            case "ERR_NETWORK":
              console.log(error.message);
              break;
            case "ERR_BAD_REQUEST":
              const res = error?.response;
              switch (res.status) {
                case 403:
                  const token = refreshAccessToken(setAccessToken);
                  if (token) {
                    setAccessToken(token);
                  } else {
                    console.log(error.message);
                    console.log(res.statusText);
                  }
                  break;
                default:
                  setAccessToken("");
                  cookies.remove("access_token");
                  // cookies.remove("user");
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
    } else if (refreshToken !== "") {
      const token = refreshAccessToken(setAccessToken);
      if (token) {
        setAccessToken(token);
      }
    }
  }, [accessToken, refreshToken]);

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

  const t = { token: accessToken, setToken: setAccessToken };

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
                accessToken === "" ? (
                  <SignIn loggedIn={t} />
                ) : (
                  redirectTo("Already Logged In", "/")
                )
              }
            />
            <Route path="/signup" element={<SignUp loggedIn={t} />} />
            <Route path="/logout" element={<LogOut loggedIn={t} />} />
            <Route
              path="/notes"
              element={
                accessToken === "" ? (
                  redirectTo("You need to Login First")
                ) : (
                  <Notes loggedIn={t} />
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
