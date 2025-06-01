import { latLng } from 'leaflet'
import React, { useEffect } from 'react'
import { useMap } from "react-leaflet"
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import "leaflet-routing-machine"

const RouteLocate = ({
  state,
  mapState,
  setMapState,
  routeDetails,
  setRouteDetails,
  routeIndex,
  showRoute,
  path=""}) => {

  if(path === "upload"){
    const map = useMap()
        map.on("click", function(e) {
        setMapState(prev=>({...prev, position : e.latlng}))     
    }) 
          map.flyTo(latLng(mapState.province.lat, mapState.province.lng), map.getZoom(10))

          return mapState.position ==="" ? null : (
            <Marker position={mapState.position}>
              {/* <Popup>{state?.destinationName}</Popup> */}
            </Marker>)
  }else{

  function createButton(label, container) {
    const btn = L.DomUtil.create('button', '', container);
    btn.setAttribute('type', 'button');
    btn.innerHTML = label;
    return btn;
}
  // start end
useEffect(()=>{
console.log(routeDetails)

  const map = L.map('map').setView( [state?.destinationMapCoordinates.latitude, state?.destinationMapCoordinates.longitude], 10);
  L.marker(latLng(state.destinationMapCoordinates.latitude, state.destinationMapCoordinates.longitude)).addTo(map)
  let start;
  let end
  if(showRoute){
      start =  L.latLng(routeDetails.routeMapCoordinates.sLocation.lat, routeDetails.routeMapCoordinates.sLocation.lng); 
      end =  L.latLng(routeDetails.routeMapCoordinates.eLocation.lat, routeDetails.routeMapCoordinates.eLocation.lng); 
  }
    //       // Add a tile layer (OpenStreetMap)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png')
        .addTo(map);
const control = L.Routing.control({
    waypoints : [start, end],
    routeWhileDragging: true,
    show : false,
      router: L.Routing.osrmv1({
        serviceUrl: 'https://router.project-osrm.org/route/v1',
      }),
    lineOptions: {
      styles: [{ color: 'blue', opacity: 0.7, weight: 5 }],
    },
}).addTo(map);

map.on('click', function(e) {
    const container = L.DomUtil.create('div'),
        startBtn = createButton('Start location', container),
        destBtn = createButton('End location', container);
        startBtn.style = "margin-right : 10px"

      L.popup()
        .setContent(container)
        .setLatLng(e.latlng)
        .openOn(map);

        L.DomEvent.on(startBtn, 'click', function() {
            control.spliceWaypoints(0, 1, e.latlng);
            setRouteDetails(prev => ({...prev, routeMapCoordinates : {...prev.routeMapCoordinates, sLocation : e.latlng}}))
            map.closePopup();
        });
        L.DomEvent.on(destBtn, 'click', function() {
            control.spliceWaypoints(control.getWaypoints().length - 1, 1, e.latlng);
            setRouteDetails(prev => ({...prev, routeMapCoordinates : {...prev.routeMapCoordinates, eLocation : e.latlng}}))
            map.closePopup();
        });
});

  return () => { 
    map.remove();
  };
},[routeIndex, showRoute])
  
  return  <div id="map" className='z-0' style={{ height: '100%', width: '100%' }} />;    
}   
} 

export default RouteLocate