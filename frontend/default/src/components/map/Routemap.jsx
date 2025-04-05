import React, { useEffect } from 'react';
import L, { icon } from 'leaflet';
import { latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import { useQueryClient } from '@tanstack/react-query';
import { faIceCream } from '@fortawesome/free-solid-svg-icons';
import { useParams } from 'react-router';

function RouteMap({routeIndex, mapDetails}) {

  const {id} =useParams()
  const queryClient = useQueryClient()

  const {destinationMapCoordinates, routePlan} = mapDetails

  const services = queryClient.getQueryData(["nearByServices", id])

  console.log(services)
  
//   const intermediate = routePlan[0] && routePlan?.reduce((acc,curr,index) => {
//     if(routePlan.length - 1 !== index) {
//       acc.push(curr.routeMapCoordinates.eLocation)
//     }
//     return acc
    
//    },[])
//  console.log(intermediate)

  useEffect(() => {

    // Initialize the map
    const map = L.map('map').setView([destinationMapCoordinates.latitude, destinationMapCoordinates.longitude], 10);

    L.marker(latLng(destinationMapCoordinates.latitude, destinationMapCoordinates.longitude))
    .setIcon(icon({iconUrl :"/destination.webp", iconSize : 40}))
    .addTo(map)

    services?.forEach(service => {
      L.marker(latLng(service.serviceLocationMapCoordinates.latitude, service.serviceLocationMapCoordinates.longitude))
      .setIcon(icon({iconUrl :"/hotel.jpg", iconSize : 40}))
      .addTo(map)
    })

    // Add a tile layer (OpenStreetMap)
    L.tileLayer("https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png")
    .addTo(map);

    // Define start and end points
    if(routePlan[0]){
    const start = L.latLng(routePlan[routeIndex].routeMapCoordinates.sLocation.lat, routePlan[routeIndex].routeMapCoordinates.sLocation.lng); 
    // const centerRoute = intermediate?.map(route => L.latLng(route.lat, route.lng));
    const end = L.latLng(routePlan[routeIndex].routeMapCoordinates.eLocation.lat, routePlan[routeIndex].routeMapCoordinates.eLocation.lng); 

    // Initialize the routing control
    const control =L.Routing.control({
      waypoints: [start, end],
      routeWhileDragging: false,
      
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
      lineOptions: {
        styles: [{ color: 'blue', opacity: 0.7, weight: 5 }],
      },
      show : false,
      //  formatter: function (waypoints, routes) {
      //   const distance = (routes[0].summary.totalDistance / 1000).toFixed(2);
      //   const duration = (routes[0].summary.totalTime / 60).toFixed(2);
      //   return `Distance: ${distance} km, Duration: ${duration} mins`;
      // },
      // createMarker: function (i, waypoint, n) {
      //   return L.marker(waypoint.latLng, {
      //     icon: L.icon({
      //       iconUrl: i === 0 ? 'start-icon.png' : 'end-icon.png',
      //       iconSize: [32, 32],
      //     }),
      //   });
      // }
    }).addTo(map);

  }
    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [routeIndex]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;

}


export default RouteMap;