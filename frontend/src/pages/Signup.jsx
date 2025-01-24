import { Link, NavLink } from "react-router";
import { Outlet } from "react-router";

const SignupPage = () => {
 
  return (
    <div className="flex ">
      <div  className="bg-amber-500 p-4 w-1/3 h-screen">
        <div className="text-5xl font-garamond font-semibold mb-6">Welcome, Signup!!</div>
        <nav>
          <ul className="flex justify-evenly">
            <li>
              <NavLink className={({isActive})=> isActive ? "bg-green-500" : ""} to={"/signup/user"} >USER</NavLink>
            </li>
            <li>
              <NavLink className={({isActive})=> isActive? "bg-green-500" : ""} to={"/signup/guide"} >GUIDE</NavLink>
            </li>
            <li>
              <NavLink className={({isActive})=> isActive? "bg-green-500" : ""} to={"/signup/service"} >SERVICE</NavLink>
            </li>
          </ul>
        </nav>
      </div>
      <main className="flex-1 mx-2 ">
        <Outlet /> {/* This renders the matching route's component */}
      </main>
    </div>
  );
};

export default SignupPage;
