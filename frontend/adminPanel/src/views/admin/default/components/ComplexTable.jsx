import React from "react";
import { useCallback } from "react";
import CardMenu from "../../../../components/card/CardMenu";
import Card from "../../../../components/card";
import Progress from "../../../../components/progress";

import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useGetDestinationsQuery, useGetServicesQuery } from "../../../../services/apiSlice";
import { useState } from "react";
import { useEffect } from "react";

const columnHelper = createColumnHelper();

// const columns = columnsDataCheck;
export default function ComplexTable() {

  const [sorting, setSorting] = React.useState([]);
  

  const [state, setState] = useState({
    reviewSortType : "dec",
    option : "destinations",
    defaultData : []
  })

  const {data : services, isLoading, isSuccess : isServiceSuccess, isError} = useGetServicesQuery({reviewSort : state.reviewSortType}, {skip : state.option !== "services"})
  const {data : destinations, isSuccess : isDestinationSuccess, isLoading : isDestinationLoading} = useGetDestinationsQuery({reviewSort : state.reviewSortType}, {skip : state.option !== "destinations"})
  
  const handleChange = (e) =>{
    const {name, value} = e.target
    setState((prev) => {
      return {...prev, [name] : value }
    })
  }

useEffect(()=>{
const data = state.option === "services" ? services?.reduce((acc, service) => {
    acc.push( {
    name: service.serviceName,
    reviewSubmited: service.reviews?.length,
    // date: "24.Jan.2021",
    avgReview: service.avgReview || 0
  })
  return acc
},[])
  :

  destinations?.destinations.reduce((acc, destination) => {
     acc.push( {
    name: destination.destinationName,
    reviewSubmited: destination.reviews?.length,
    // date: "24.Jan.2021",
    avgReview: destination.avgReview || 0
    }
    )
    return acc
  }
  ,[])

  setState(prev => ({...prev, defaultData : data || []}))
  },[state.option, isServiceSuccess, isDestinationSuccess]) 

  const columns = [
    columnHelper.accessor("name", {
      id: "name",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">NAME</p>
      ),
      cell: (info) => (
        <>
          {info.getValue()}
        </>
      ),
    }),
    columnHelper.accessor("reviewSubmited", {
      id: "reviewSubmited",
      header: () => (
        <p className="text-sm font-bold text-gray-600 dark:text-white">
          SUBMITED REVIEWS
        </p>
      ),
      cell: (info) => (
        <div className="flex items-center">
          <p className="text-sm font-bold text-navy-700 dark:text-white">
            {info.getValue()}
          </p>
        </div>
      ),
    }),
    // columnHelper.accessor("date", {
    //   id: "date",
    //   header: () => (
    //     <p className="text-sm font-bold text-gray-600 dark:text-white">DATE</p>
    //   ),
    //   cell: (info) => (
    //     <p className="text-sm font-bold text-navy-700 dark:text-white">
    //       {info.getValue()}
    //     </p>
    //   ),
    // }),
    columnHelper.accessor("avgReview", {
      id: "avgReview",
      header: () => (
        
          <p className="text-sm font-bold text-gray-600 dark:text-white">
          AVERAGE REVIEW
        </p>
        

      ),
      cell: (info) => (
        
        <div className="flex items-center">
          <Progress color = {info.getValue() < 2 && "red" || info.getValue() > 2 && info.getValue() < 3 && "orange" || "green"} width="w-[108px]" value={info.getValue()} />
        </div>
      ),
    }),
  ]; // eslint-disable-next-line
  // const [data, setData] = React.useState(() => [...defaultData]);

  // useEffect(()=> setData(defaultData),[isDestinationSuccess, isServiceSuccess])

  const table = useReactTable({
    data : state.defaultData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: true,
  });

  return (
    <Card extra={"w-full h-full px-6 pb-6 sm:overflow-x-auto"}>
      <div className="relative flex items-center justify-between pt-4">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Review Table
        </div>
        {/* <CardMenu /> */}
        <select defaultValue={state.option} name="option" className="outline-none" onChange={handleChange}>
          <option value={"services"}> Services</option>
          <option value={"destinations"}>Destinations</option>
        </select>
      </div>
      {  isDestinationLoading || isLoading ? <>loading</> :  
        
      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
               key={headerGroup.id} 
               className="!border-px !border-gray-400">
                {headerGroup.headers.map((header) => { 
                 return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer border-b-[1px] border-gray-200 pt-4 pb-2 pr-4 text-start"
                    >
                      <div className="items-center justify-between text-xs text-gray-200">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {{
                          asc: "",
                          desc: "",
                        }[header.column.getIsSorted()] ?? null}

                      </div>
                    </th>
                    ); 
                 })} 
              </tr>
             ))} 
          </thead>
          <tbody>
            {table
              .getRowModel()
              .rows.slice(0, 5)
              .map((row) => {
                return (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <td
                          key={cell.id}
                          className="min-w-[150px] border-white/0 py-3  pr-4"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
}
    </Card>
  );
}
