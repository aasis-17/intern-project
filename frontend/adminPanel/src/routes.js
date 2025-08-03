

// Admin Imports
import MainDashboard from "./views/admin/default";
import NFTMarketplace from "./views/admin/destinations";
import Profile from "./views/admin/profile";
import DataTables from "./views/admin/tables";
import RTLDefault from "./views/rtl/default";
import Setting from "./views/admin/setting/index"

// Auth Imports
import SignIn from "./views/auth/SignIn";

// Icon Imports
import {
  MdHome,
  MdOutlineShoppingCart,
  MdBarChart,
  MdPerson,
  MdLock,
  MdOutlineSignpost,
  MdSettings,
} from "react-icons/md";
import Destination from "./views/admin/destinations";
import DestinationUpload from "./views/admin/destinations/components/DestinationUpload";
import DestinationLayout from "./layouts/destination";
import RouteUpload from "./views/admin/destinations/components/RouteUpload";
import PhotoUpload from "./views/admin/destinations/components/PhotoUpload";
import Layout from "./views/admin/destinations/components/Layout";
import AdminServices from "./views/admin/service/AdminServices";
import ServiceDetails from "./views/admin/service/ServiceDetails";
import ServiceOwner from "./views/admin/service/component/Service";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Destination",
    layout: "/admin",
    path: "destinations",
    icon: <MdOutlineSignpost className="h-6 w-6" />,
    component: <DestinationLayout />,
    children : [{
      path : "destinations",
      component : <Destination />
    },
    {
      path : "destinations/:id",
      component : <Layout />,
      children : [
        {
          component : <DestinationUpload edit={true} />,
          index : true
        },
        {
          path : "destinations/:id/route",
          component : <RouteUpload />
        },
        {
          path : "destinations/:id/photoUpload",
          component : <PhotoUpload />
        },
      ]
    },

    {
      path : "destinations/upload",
      component : <DestinationUpload />
    }],
    secondary: true,
  },
  {
    name: "Services",
    layout: "/admin",
    icon: <MdBarChart className="h-6 w-6" />,
    path: "service",
    component: <DestinationLayout />,
    secondary : true,
    children : [{
      path : 'service',
      component : <AdminServices />,
      index : true
    },
    {
      path : 'service/:serviceId',
      component : <ServiceDetails />
    },
        {
      path : 'service/upload',
      component : <ServiceOwner option="upload" />
    }
    ]
  },
  // {
  //   name: "Users",
  //   layout: "/admin",
  //   path: "profile",
  //   icon: <MdPerson className="h-6 w-6" />,
  //   component: <Profile />,
  // },
  {
    name: "Setting",
    layout: "/admin",
    path: "setting",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Setting />,
  },
  // {
  //   name: "RTL Admin",
  //   layout: "/rtl",
  //   path: "rtl",
  //   icon: <MdHome className="h-6 w-6" />,
  //   component: <RTLDefault />,
  // },
];
export default routes;
