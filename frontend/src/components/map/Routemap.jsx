import React, { useEffect } from 'react';
import L from 'leaflet';
import { latLng } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

function RouteMap({location={}, routePlan, intermediate}) {
  console.log(routePlan)
  useEffect(() => {
    console.log(location)
    // Initialize the map
    const map = L.map('map').setView([location.latitude, location.longitude], 10);

    L.marker(latLng(location.latitude, location.longitude))
    .addTo(map)

    // Add a tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

    // Define start and end points
    if(routePlan){
    const start = L.latLng(routePlan.sLocation.latitude, routePlan.sLocation.longitude); 
    const centerRoute = intermediate?.map(route => L.latLng(route.latitude, route.longitude));
    const end = L.latLng(routePlan.eLocation.latitude, routePlan.eLocation.longitude); 

    // Initialize the routing control
    const control =L.Routing.control({
      waypoints: [start,...centerRoute, end],
      routeWhileDragging: true,
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
  }, [routePlan]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;

}


export default RouteMap;