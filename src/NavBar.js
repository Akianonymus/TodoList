import { NavLink } from "react-router-dom";

const active =
  "text-blue-500 underline underline-offset-8 decoration-4 font-bold";

const NavItem = ({ path, content }) => {
  return (
    <li className="pl-2 pr-2 hover:text-blue-300">
      <NavLink
        className={({ isActive }) => (isActive ? active : undefined)}
        to={{ pathname: path }}
      >
        {content}
      </NavLink>
    </li>
  );
};

const navItems = [
  { path: "/", content: "Home", show: "always" },
  { path: "/todos", content: "Todos", show: "login" },
  { path: "/signin", content: "Sign In", show: "logout" },
  { path: "/signup", content: "Sign Up", show: "logout" },
  { path: "/logout", content: "Log Out", show: "login" },
];

const Navbar = ({ loggedIn }) => {
  return (
    <nav>
      <ul className="backdrop-blur-2xl pb-2 text-white flex flex-row flex-wrap justify-center list-none space-x-2 pl-2">
        {navItems.map((e) => {
          const nav = [];
          const logged = loggedIn.token !== "";
          switch (e.show) {
            case "always":
              nav.push(
                <NavItem key={e.path} path={e.path} content={e.content} />
              );
              break;
            case "login":
              if (logged)
                nav.push(
                  <NavItem key={e.path} path={e.path} content={e.content} />
                );
              break;
            case "logout":
              if (!logged)
                nav.push(
                  <NavItem key={e.path} path={e.path} content={e.content} />
                );
              break;
            default:
              break;
          }
          return nav;
        })}
      </ul>
    </nav>
  );
};
export default Navbar;
