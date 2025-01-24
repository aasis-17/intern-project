import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./layouts/Header";

const Layout = ({childern}) => {
  return (
    <div>
      {childern}
      <main>
        <Outlet /> {/* This renders the matching route's component */}
      </main>
    </div>
  );
};

export default Layout;
