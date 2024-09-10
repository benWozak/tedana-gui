import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
type Props = {};

function Layout({}: Props) {
  return (
    <div className="mx-auto h-svh overflow-y-scroll">
      <NavBar />
      <main className="h-5/6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
