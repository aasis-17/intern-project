import MiniCalendar from "../../../components/calendar/MiniCalendar";
// import WeeklyRevenue from "./components/WeeklyRevenue";
// import TotalSpent from "./components/TotalSpent";
import PieChartCard from "./components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart } from "react-icons/md";

// import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "../../../components/widget/Widget";
// import CheckTable from "./components/CheckTable";
import ComplexTable from "./components/ComplexTable";
// import DailyTraffic from "./components/DailyTraffic";
// import TaskCard from "./components/TaskCard";
// import tableDataCheck from "./variables/tableDataCheck.json";
// import tableDataComplex from "./variables/tableDataComplex.json";
import { useTotalCountQuery } from "../../../services/apiSlice";

const Dashboard = () => {

  const {data, isLoading, isError} = useTotalCountQuery()

  if(isLoading) return<div>Loading..</div>
  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Destinations"}
          subtitle={data.totalDestinationCount}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Services"}
          subtitle={data.totalServiceCount}
        />
        {/* <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={"$574.34"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={"$1,000"}
        /> */}
         {/* <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"New Tasks"}
          subtitle={"145"}
        /> */}
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total Users"}
          subtitle={data.totalUserCount}
        /> 
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* <TotalSpent /> */}
         {/* <WeeklyRevenue /> */}
         <MiniCalendar />
         <PieChartCard />
      </div>

      {/* Tables & Charts */}

      {/* <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2"> */}
        {/* Check Table */}
        {/* <div> */}
         
          {/* <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          /> */}
        {/* </div> */}

        {/* Traffic chart & Pie Chart */}

        {/* <div className=""> */}
          {/* <DailyTraffic /> */}
           
          
        {/* </div> */}

        {/* Complex Table , Task & Calendar */}
<div className="mt-5">
        <ComplexTable /> 
</div>
        {/* Task chart & Calendar */}

        {/* <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2"> */}
          {/* <TaskCard /> */}
{/*            
          <div className="grid grid-cols-1 rounded-[20px]">
            
          </div>
        </div> */}
        
      </div>
    // </div>
  );
};

export default Dashboard;
