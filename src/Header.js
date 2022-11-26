import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="backdrop-blur-2xl pt-4 pb-2">
      <h1 className="text-2xl text-center text-white">
        <Link to="/">TodoList</Link>
      </h1>
    </header>
  );
};
export default Header;
