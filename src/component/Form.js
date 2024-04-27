import { Link } from "react-router-dom";
import Message from "./Message";
import Spinner from "./Spinner";

const Form = ({
  info,
  msg,
  setMsg,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  spinner,
}) => {
  let nameComponent = "";
  if (info.blink.includes("signin")) {
    nameComponent = (
      <div className="mb-2">
        <label type="text" className="block text-sm font-semibold ">
          Name
        </label>
        <input
          type="text"
          className="block w-full dark:text-gray-700 px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-wrap justify-center min-h-[90vh]">
      <Message msg={msg} setMsg={setMsg} spinner={spinner} classes="mb-2" />
      <div className="bg-gray-200 dark:bg-gray-800 self-center sm:w-[66%] lg:w-[40%] w-[90%] p-4 rounded-md shadow-md">
        <h1 className="text-3xl font-semibold text-center ">{info.header}</h1>
        <form className="mt-6">
          {nameComponent}
          <div className="mb-2">
            <label type="text" className="block text-sm font-semibold ">
              Email
            </label>
            <input
              type="email"
              className="block w-full dark:text-gray-700 px-4 py-2 mt-2 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </div>
          <div className="mb-2">
            <label type="password" className="block text-sm font-semibold ">
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 dark:text-gray-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          <button
            className="mt-6 flex flex-row items-center w-full justify-center bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 py-2 tracking-wide text-white "
            type="submit"
            onClick={(e) => handleSubmit(e)}
          >
            <Spinner
              spinner={spinner}
              classes="mx-3 mr-auto text-lg text-white"
            />
            <div className="">{info.submit}</div>
            <Spinner
              spinner={spinner}
              classes="mx-3 text-lg ml-auto text-white"
            />
          </button>
        </form>

        <p className="mt-8 text-xs font-light text-center ">
          {" "}
          {info.b1}{" "}
          <Link
            className="font-medium text-green-400 hover:underline"
            to={info.blink}
          >
            {info.b2}
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Form;
