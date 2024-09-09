import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

type Props = {};

function NavBar({}: Props) {
  return (
    <nav className="navbar bg-base-100 sticky top-0 z-40">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost text-xl">
          FMRIPrep
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Link</a>
          </li>
          <li>
            <ThemeToggle />
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default NavBar;
