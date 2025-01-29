import React, { useEffect } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

function RouteMap({location, sLocation, eLocation, intermediate=[]}) {
  useEffect(() => {
    console.log(sLocation, eLocation)
    // Initialize the map
    const map = L.map('map').setView([location.latitude, location.longitude], 5);

    // Add a tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
    .addTo(map);

    // Define start and end points
    const start = L.latLng(sLocation.latitude, sLocation.longitude); 
    const centerRoute = intermediate?.map(route => L.latLng(route.latitude, route.longitude));
    const end = L.latLng(eLocation.latitude, eLocation.longitude); 

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
              // Handle route found event
              control.on('routesfound', function (e) {
                const routes = e.routes;
                console.log('Routes found:', routes);
              });
          
              // Handle route selected event
              control.on('routeselected', function (e) {
                const route = e.route;
                console.log('Route selected:', route);
              })

    // Cleanup on unmount
    return () => {
      map.remove();
    };
  }, [sLocation.latitude]);

  return <div id="map" style={{ height: '100%', width: '100%' }} />;

}


export default RouteMap;