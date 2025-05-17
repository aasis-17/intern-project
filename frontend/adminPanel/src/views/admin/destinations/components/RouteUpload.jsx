import React, { useContext, useEffect, useRef, useState } from 'react'
import FormField from '../../../../components/fields/FormField'
import TextField from '../../../../components/fields/TextFieldcustom'
import RouteLocate from '../../../../components/map/MapRouting'
import { useNavigate, useOutletContext } from 'react-router'
import Button from '../../../../components/button/Button'
import { latLng } from 'leaflet'
import { useForm } from 'react-hook-form'
import { useUploadRouteMutation, useRemoveRoutePlanMutation } from '../../../../services/apiSlice'

const RouteUpload = () => {

    const destination = useOutletContext()

    const navigate = useNavigate()
    const [showRoute, setShowRoute] = useState(false)
    const [routeIndex, setRouteIndex] = useState(0)
    const [routeDetails, setRouteDetails] = useState(destination?.routePlan[routeIndex] || 
        {
        day : "",
        routeTask : "",
        routeMapCoordinates : {
                    sLocation : "",
                    eLocation  : ""
        }
    })
    console.log(routeDetails)

    const routes = useRef(destination?.routePlan[0]? [...destination?.routePlan] : []  )

    const [uploadRouteMutation,{isSuccess, isError}] = useUploadRouteMutation()
    const [removeRoutePlan, {isSuccess : isRemovedSuccess, isError: isRemovedError}] = useRemoveRoutePlanMutation()

    useEffect(()=>{
    isSuccess && alert(`Route Added to destination!! ${destination.destinationName}`)
    isError && alert(`Error to add  destination route!! ${destination.destinationName}`)
    },[isSuccess, isError])


    const handleChange = (e) => {
        const {name, value} = e.target
        setRouteDetails(prev => {
            return {...prev, [name] : value}
        })
    }

    const addRoute = (e) => {
        e.preventDefault()
        if(!routeDetails.day ||!routeDetails.routeTask ){
            alert("Field missing!!")
            return
        }
        else if(routes.current.filter(route => route.day === routeDetails.day)[0]){
            alert("Day match please change!!")
            return
        }else{
            console.log(routeDetails)
            routes.current.push(routeDetails)
            setRouteDetails({
                day : "",
                routeTask : "",
                routeMapCoordinates :{
                    sLocation : "",
                    eLocation : ""
                }
            })
            console.log("routes pushed",routes.current)
        }
    }

    const removeRoute = async(e) => {
        e.preventDefault()
        console.log(routes.current[routeIndex])
        await removeRoutePlan({destinationId : destination._id, routeId : routes.current[routeIndex]._id})
        routes.current = routes.current.filter(route => route.day !== routeDetails.day )
        setRouteDetails({
            day : "",
            routeTask : "",
            routeMapCoordinates :{
                sLocation : "",
                eLocation : ""
            }
        })
        setShowRoute(false)
    }

  return (
    <div className='h-full'>
         <form className=" h-full relative flex flex-col justify-evenly ml-4">
            <div className='flex justify-between items-center'>
                <div className='text-4xl font-garamond '>Route details</div>

                <div className='mr-4'>
                {routes.current[0] && routes.current.map((route, index) => {
                    return (
                            <Button
                                key={route.day}
                                variant='secondary'
                                className='mr-5'
                                size='sm'
                                children={`Day ${route.day}`}
                                onClick={() => {
                                    setRouteIndex(index)
                                    console.log(index)
                                    setRouteDetails(routes.current[index])
                                    setShowRoute(true)
                            }} />)
                     })}
                     {routes.current[0] && <Button variant="secondary" size='sm' children="Next" onClick={()=>{
                        setRouteDetails({
                            day : "",
                            routeTask : "",
                            routeMapCoordinates :{
                                sLocation : "",
                                eLocation : "",
                        }
                        })
                        setShowRoute(false)
                        }} />}
                        </div>
                        <Button 
                  onClick={() =>  destination ? navigate(`/admin/destinations/${destination._id}/photoUpload`) : alert("create destination first!!")} 
                  children="Add Photos" 
                  size='sm'
                  variant='secondary'
                  />  
                        </div>
                {/* map preview */}
                
                <div className='flex '>
                <div className='h-76 rounded-xl overflow-hidden w-[50%]'>

                    <RouteLocate 
                    routeDetails={routes.current[routeIndex]}
                    state={destination}
                    setRouteDetails={setRouteDetails}
                    showRoute={showRoute}
                    routeIndex={routeIndex}
                    />

                </div>
                 {/* Route Day */}
                 <div className='w-1/2 ml-3'>
                <div className=''>
                <FormField 
                    value={routeDetails.day}
                    labelClassName = "block text-sm font-medium text-gray-700"
                    className = "mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
                    label = "Route Day :"
                    name="day"
                    required
                    placeholder = "Enter day"
                    onChange={(e) => handleChange(e)}
                    />
                </div>

                {/* Route task */}
                <div className='h-52'>
                <TextField
                    label="Route task :"
                    value = {routeDetails.routeTask}
                    name="routeTask"
                    required
                    placeholder="Enter info"
                    className="w-full h-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                    labelClassName="block text-sm font-medium text-gray-600"
                    onChange={(e) => handleChange(e)}
                />
                </div>
                </div>
                </div>

                <div className='flex '>

                {/* Starting route coordinates preview */}
                <div className='w-1/2'>
                <FormField
                label="Starting route Coordinates :"
                value={latLng(routeDetails.routeMapCoordinates.sLocation) || ""}
                readOnly={true}
                required
                placeholder=" coordinates"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                labelClassName="block text-sm font-medium text-gray-600"
                />
                </div>

                {/* Ending route coordinates */}
                <div className='w-1/2 ml-3'>
                <FormField
                label="Ending route Coordinates :"
                value={latLng(routeDetails.routeMapCoordinates.eLocation) || ""}
                readOnly={true}
                required
                placeholder=" coordinates"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
                labelClassName="block text-sm font-medium text-gray-600"
                />
                </div>
                </div>
           
          {/* Submit Button */}
          <div className='flex gap-10'>
          <div className='w-1/2 flex gap-2'>
          <Button
            onClick={addRoute}
            className="w-full px-4 py-2  bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Add Route"
          />
          {showRoute && (
          <Button
          onClick={removeRoute}
          variant='delete'
          className="w-1/2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
          children="Remove Route"
        />
          )}

          </div>

             <Button
            onClick={() => uploadRouteMutation({id :destination._id, data :routes.current})}
            className="w-1/2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Submit Route"
          />
          </div>
                </form>
            </div>
                )
                }

export default RouteUpload