import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Cookies from "universal-cookie";

import Message from "./component/Message";

const cookies = new Cookies();

const Home = function () {
  const location = new useLocation();
  const [msg, setMsg] = useState(location?.state?.message || "");
  const name = cookies.get("name")?.toUpperCase();

  return (
    <>
      <Message msg={msg} setMsg={setMsg} />
      <div className="flex flex-col mt-2 justify-center min-h-[80vh]">
        <div className="bg-gray-200 dark:bg-slate-800 w-[90%] sm:w-[66%] lg:w-[40%] self-center rounded-md shadow-md p-10 text-center text-2xl space-y-4">
          <div>Welcome {name ? name : "to Simple Notes App"}</div>
          <div>Create, edit, delete your own notes.</div>
          <button className="pl-4 pr-5 pt-2 pb-2 rounded bg-blue-800 hover:bg-blue-700 text-white">
            <Link to="/notes">Go to App</Link>
          </button>
        </div>
      </div>
    </>
  );
};
export default Home;
