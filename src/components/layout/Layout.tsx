import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import NavBar from "./NavBar";
import { FileChartPie, ScrollText, Container } from "lucide-react";

type Props = {};

function Layout({}: Props) {
  return (
    <div className="mx-auto h-svh overflow-y-scroll">
      <NavBar />
      <div className="drawer z-20">
        <input id="menu-drawer" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col"></div>
        <div className="drawer-side pt-20">
          <label
            htmlFor="menu-drawer"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <ul className="menu bg-base-200 min-h-full w-80 p-4">
            <li>
              <Link to="/environment">
                {" "}
                <Container />
                Environment Paths
              </Link>
            </li>
            <li>
              <Link to="/process">
                <ScrollText /> Run Tedana
              </Link>
            </li>
            <li>
              <Link to="/results">
                {" "}
                <FileChartPie />
                View outputs
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <main className="h-5/6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
