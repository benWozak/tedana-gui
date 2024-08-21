import { Outlet } from "react-router-dom";
import NavBar from "./NavBar";
type Props = {};

function Layout({}: Props) {
  return (
    <div className="mx-auto h-svh">
      <NavBar />
      <main className="flex flex-col justify-center items-center h-5/6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
