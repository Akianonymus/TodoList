import axios from "axios";
import Cookies from "universal-cookie";

export const API_URL =
  process.env.REACT_APP_BACKEND_SERVER ||
  "https://akitodolist-backend.cyclic.app";

export const refreshAccessToken = (refresh_token) => {
  const cookies = new Cookies();
  const configuration = {
    method: "post",
    url: `${API_URL}/auth/refreshAccessToken`,
    data: { refreshToken: refresh_token },
  };

  axios(configuration)
    .then((result) => {
      const cookieOpt = {
        path: "/",
        secure: true,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 * 24 * 7,
      };
      const token = result?.data?.data?.accessToken;
      cookies.set("access_token", token, cookieOpt);
      return token;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
