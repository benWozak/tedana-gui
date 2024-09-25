import ThemeToggle from "./ThemeToggle";
import { Link } from "react-router-dom";

type Props = {};

function NavBar({}: Props) {
  return (
    <nav className="navbar bg-base-100 sticky top-0 z-40">
      <div className="flex-1">
        <label
          htmlFor="menu-drawer"
          aria-label="open sidebar"
          className="btn btn-square btn-ghost"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="inline-block h-6 w-6 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
        <Link to="/" className="btn btn-ghost text-xl">
          Tedana
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a
              href="https://tedana.readthedocs.io/en/stable/index.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
              aria-label="View Documentation"
            >
              Read the Docs
            </a>
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
