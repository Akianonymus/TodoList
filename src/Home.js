import { Fragment, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import Message from "./component/Message";

const Home = function () {
  const location = new useLocation();
  const [msg, setMsg] = useState(location?.state?.message || "");

  return (
    <Fragment>
      <Message msg={msg} setMsg={setMsg} />

      <div className="flex flex-wrap h-screen justify-center items-center mt-2">
        <div className="backdrop-blur-sm p-10 text-white text-center  text-2xl space-y-4">
          <div>Welcome to TodoList App</div>
          <div>Create, edit, delete your own todos.</div>
          <button className="pl-4 pr-5 pt-2 pb-2 rounded bg-yellow-800 text-white hover:px-5">
            <Link to="/todos">Go to App</Link>
          </button>
        </div>
      </div>
    </Fragment>
  );
};
export default Home;
