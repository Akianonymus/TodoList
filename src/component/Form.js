import { Link } from "react-router-dom";

const Form = ({
  info,
  username,
  setUsername,
  password,
  setPassword,
  handleSubmit,
}) => {
  return (
    <div className="pb-20  flex flex-wrap justify-center h-screen mt-2">
      <div className="w-2/3 p-4 backdrop-blur m-auto rounded-md shadow-md lg:max-w-xl">
        <h1 className="text-3xl font-semibold text-center text-yellow-100 ">
          {info.header}
        </h1>
        <form className="mt-6">
          <div className="mb-2">
            <label
              type="text"
              className="block text-sm font-semibold text-white"
            >
              Username
            </label>
            <input
              type="text"
              className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoFocus={true}
            />
          </div>
          <div className="mb-2">
            <label
              type="password"
              className="block text-sm font-semibold text-white"
            >
              Password
            </label>
            <input
              type="password"
              className="block w-full px-4 py-2 mt-2 text-blue-700 bg-white border rounded-md focus:border-blue-400 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>
          <div className="mt-6">
            <button
              className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-blue-700 rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600"
              type="submit"
              onClick={(e) => handleSubmit(e)}
            >
              {info.submit}
            </button>
          </div>
        </form>

        <p className="mt-8 text-xs font-light text-center text-white">
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
