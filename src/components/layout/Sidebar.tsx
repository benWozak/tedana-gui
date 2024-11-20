import { Link } from "react-router-dom";
import { FileChartPie, ScrollText, Container, MonitorDown } from "lucide-react";

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
        <div className="flex flex-col justify-between menu bg-base-200 min-h-full w-80 p-4">
          <ul>
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
          <ul>
            <li>
              <Link to="/installation">
                <MonitorDown />
                Installation Guide
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
