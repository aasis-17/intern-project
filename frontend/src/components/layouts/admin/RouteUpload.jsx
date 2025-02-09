import { useMutation} from '@tanstack/react-query'
import React, { useContext, useRef, useState } from 'react'
import FormField from '../../form/FormField'
import TextField from '../../form/TextField'
import RouteLocate from '../../map/MapRouting'
import { useLocation } from 'react-router'
import Button from '../../Button'
import destinationService from '../../../services/destinationService'
import { latLng } from 'leaflet'
import { AuthContext } from '../../../store/authContext'

const RouteUpload = () => {
    // const {state} = useContext(AuthContext)
    const {state} = useLocation()
    const [showRoute, setShowRoute] = useState(false)
    const [routeDetails, setRouteDetails] = useState({
        day : "",
        routeTask : "",
        routeMapCoordinates : {
                    sLocation : "",
                    eLocation  : ""
        }
    })
    const routes = useRef(state.routePlan)
    
    const mutation = useMutation({
        mutationFn : ()=> {
             destinationService.addRoutePlan(state._id, routes.current)
        },
        onSuccess : () => {
            alert(`Route Added to destination!! ${state.destinationName}`)
        },
        onError : () => {
            alert ("error")
        }
    })

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
        if(routes.current.filter(route => route.day === routeDetails.day)){
            alert("Day match please change!!")
            return
        }
    
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

    const removeRoute = (e) => {
        e.preventDefault()
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
    <div className=' flex-1'>
         <form className=" h-full relative flex flex-col justify-evenly ml-4">
            <div className='flex justify-between items-center'>
                <div className='text-4xl font-garamond '>Route details</div>
                <div className='mr-4'>
                {routes.current[0] && routes.current.map(route => {
                    return (
                            <Button
                                key={route.day}
                                variant='secondary'
                                className='mr-5'
                                size='sm'
                                children={`Day ${route.day}`}
                                onClick={() => {
                                    setRouteDetails({
                                    day : route.day,
                                    routeTask : route.routeTask,
                                    routeMapCoordinates : {
                                        sLocation : latLng(route.routeMapCoordinates.sLocation.lat,route.routeMapCoordinates.sLocation.lng),
                                        eLocation : latLng(route.routeMapCoordinates.eLocation.lat,route.routeMapCoordinates.eLocation.lng)
                                    }
                                })
                                setShowRoute(true)
                            console.log(route)}} />)
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

                        </div>
                {/* map preview */}
                
                <div className='flex '>
                <div className='h-76 rounded-xl overflow-hidden w-[50%]'>

                    <RouteLocate 
                    routeDetails={routeDetails}
                    state={state}
                    setRouteDetails={setRouteDetails}
                    showRoute={showRoute}
                    setShowRoute={setShowRoute}
                    path=""
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
                value={routeDetails.routeMapCoordinates.sLocation}
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
                value={routeDetails.routeMapCoordinates.eLocation}
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
            onClick={mutation.mutateAsync}
            className="w-1/2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            children="Submit Route"
          />
          </div>
                    </form>
                </div>
                )
                }

export default RouteUpload