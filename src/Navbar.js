import { NavLink } from "react-router-dom";
import { BsThreeDotsVertical } from "react-icons/bs";
import {
  TbListDetails,
  TbLogin,
  TbLogout,
  TbMoonStars,
  TbNotes,
  TbUserPlus,
} from "react-icons/tb";
import { Fragment, useState } from "react";

const NavItem = ({ path, content, onClick, icon }) => {
  const active = "text-blue-600 dark:text-blue-500 ";
  const classes =
    "flex items-center rounded-md px-2 py-2 bg-gray-200 dark:bg-gray-700 hover:text-blue-700 dark:hover:text-blue-600";
  return (
    <NavLink
      className={({ isActive }) => (isActive ? active : "") + classes}
      to={path}
      onClick={onClick}
    >
      {icon}
      {content}
    </NavLink>
  );
};

const Nav = ({ loggedIn, setMenu, darkMode, setDarkMode }) => {
  return (
    <Fragment>
      {loggedIn.token === "" || (
        <NavItem
          path="/todos"
          content="Todos"
          onClick={() => setMenu && setMenu(false)}
          icon={<TbListDetails className="mr-1" />}
        />
      )}
      {loggedIn.token === "" && (
        <Fragment>
          <NavItem
            path="/signin"
            content="Sign In"
            onClick={() => setMenu && setMenu(false)}
            icon={<TbLogin className="mr-1" />}
          />
          <NavItem
            path="/signup"
            content="Sign Up"
            onClick={() => setMenu && setMenu(false)}
            icon={<TbUserPlus className="mr-1" />}
          />
        </Fragment>
      )}
      {loggedIn.token === "" || (
        <NavItem
          path="/logout"
          content="Log Out"
          onClick={() => setMenu && setMenu(false)}
          icon={<TbLogout className="mr-1" />}
        />
      )}

      <button
        className="flex items-center py-2 bg-gray-200 dark:bg-gray-700 rounded-md px-2 hover:text-blue-700 dark:hover:text-blue-600"
        onClick={() => setDarkMode(darkMode ? false : true)}
      >
        <TbMoonStars className={setMenu ? "mr-1 text-xl" : "text-2xl"} />
        {setMenu ? "Switch Theme" : null}
      </button>
    </Fragment>
  );
};

const Navbar = ({ loggedIn, darkMode, setDarkMode }) => {
  const [menu, setMenu] = useState(false);
  return (
    <h1 className="flex flex-row flex-wrap items-center relative pt-4 pb-4">
      {/* icon with name */}
      <div className="bg-gray-200 dark:bg-gray-800 ml-5 lg:ml-8 flex flex-row items-center text-2xl rounded-md px-3 py-2">
        <NavLink to="/" className="flex flex-row items-center">
          <TbNotes className="mr-1" />
          TodoList
        </NavLink>
      </div>

      {/* large screen nav */}
      <div className="ml-auto mr-5 flex flex-row items-center list-none">
        <div className="hidden sm:flex items-center space-x-3">
          <Nav
            loggedIn={loggedIn}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />
        </div>
        <button
          type="button"
          onClick={() => {
            setMenu(menu ? false : true);
          }}
        >
          <BsThreeDotsVertical className="flex sm:hidden text-2xl"></BsThreeDotsVertical>
        </button>
      </div>

      {/* small screen 2 dot menu nav */}
      <div
        className={
          menu
            ? "backdrop-blur-[3px] sm:hidden absolute inset-0 flex flex-row min-h-screen outline-none focus:outline-none overflow-auto dark:backdrop-brightness-50"
            : "hidden"
        }
        onClick={() => setMenu(false)}
      >
        <div
          className="flex flex-row items-center h-fit bg-white dark:bg-gray-800 fixed top-4 right-4 max-w-fit rounded-md shadow-lg text-base font-semibold border border-solid border-gray-300 dark:border-transparent"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="space-y-2 py-2 mx-2 list-none">
            <Nav
              loggedIn={loggedIn}
              setMenu={setMenu}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          </div>

          {/* close icon */}
          <button
            className="dark:bg-gray-700 bg-gray-300 hover:bg-gray-200 dark:hover:bg-gray-900 rounded-md p-4 flex flex-col justify-center self-stretch "
            onClick={() => setMenu(false)}
          >
            <svg viewBox="0 0 10 10" className="w-2.5 h-2.5 overflow-visible ">
              <path
                d="M0 0L10 10M10 0L0 10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </h1>
  );
};
export default Navbar;
