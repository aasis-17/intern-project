import { Link, NavLink, useLocation } from "react-router";
import { Outlet } from "react-router";
import User from "./signup/User";

const SignupPage = () => {
  const location = useLocation()
  const path = location.pathname
  return (
    <div className="sm:flex ">
      <div  className="bg-amber-500 p-4 sm:w-1/3 sm:h-screen">
        <div className="text-5xl font-garamond font-semibold mb-6">Welcome <br/>To trekers hub. {`${path === "/signup"?"" : ""}`}</div>
        <nav>
          {/* <ul className="flex justify-evenly">
            <li>
              <NavLink className={({isActive})=> isActive ? "bg-green-500" : ""} to={"/signup/user"} >USER</NavLink>
            </li>
            <li>
              <NavLink className={({isActive})=> isActive? "bg-green-500" : ""} to={"/signup/guide"} >GUIDE</NavLink>
            </li>
            <li>
              <NavLink className={({isActive})=> isActive? "bg-green-500" : ""} to={"/signup/service"} >SERVICE</NavLink>
            </li>
          </ul> */}
        </nav>
      </div>
      <main className="flex-1">
        <Outlet /> {/* This renders the matching route's component */}
      </main>
    </div>
  );
};

export default SignupPage;
