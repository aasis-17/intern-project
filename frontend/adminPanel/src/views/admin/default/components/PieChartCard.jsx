import PieChart from "../../../../components/charts/PieChart.jsx";
import { pieChartOptions } from "../../../../variables/charts.js";
import Card from "../../../../components/card";
import { useGetAllDestinationNameQuery, useTotalServiceCountMutation } from "../../../../services/apiSlice.js";
import { useState } from "react";

const PieChartCard = ({data}) => {
//   const pieChartData = Object.values(data)
//   const totalCount = Number(data.totalDestinationCount + data.totalUserCount + data.totalServiceCount)
//   const percentage = {
//     destination : Number((data.totalDestinationCount / totalCount) * 100).toFixed(0),
//     service : Number((data.totalServiceCount / totalCount) * 100).toFixed(0),
//     user : Number((data.totalUserCount / totalCount) * 100).toFixed(0)
//   }
// console.log(pieChartData)

  const [pieChartData, setPieChartData] = useState()

  const {data : destinationsName, isLoading, isError} = useGetAllDestinationNameQuery()

  const [serviceMutation,{data, isLoading:isServiceMutationLoading, isError : isServiceMutationError}] = useTotalServiceCountMutation()

  const handleChange = (e) =>{
    e.preventDefault()
    serviceMutation({serviceDestination : e.target.value})
  }

if(isLoading) return <p>Loading..</p>

  return (
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div>
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
             Pie Chart
          </h4>
        </div>

        <div className="mb-6 flex items-center justify-center">
          <select onChange={handleChange} className="mb-3 mr-2 flex items-center justify-center text-sm font-bold text-gray-600 hover:cursor-pointer dark:!bg-navy-800 dark:text-white">
              <option value="">Select Destination </option>
            {destinationsName.data.map((destination) =>{
              return (
                <option key={destination._id} value={destination.destinationName}>{destination.destinationName}</option>
              )
            })}
            
          </select>
        </div>
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">Destinations</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            {percentage.destination}%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Services</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {percentage.service}%
          </p>
        </div>
        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#EFF4FB]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Users</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {percentage.user}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
