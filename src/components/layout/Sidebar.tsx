import { Link } from "react-router-dom";
import { FileChartPie, ScrollText, Container } from "lucide-react";

type Props = {};

function Sidebar({}: Props) {
  return (
    <aside className="drawer z-20">
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
              <FileChartPie />
              View outputs
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default Sidebar;
