import { latLng } from 'leaflet'
import React from 'react'
import { MapContainer, TileLayer, Marker,Popup } from 'react-leaflet'
import "leaflet/dist/leaflet.css"

const Map = ({children}) => {
  
  return (

    <MapContainer 
    className=' w-full h-full rounded-lg'
    center={latLng(27.71, 85.32)}
    zoom={15}
    scrollWheelZoom={false}>
    <TileLayer
      // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://stadiamaps.com/"</a>'
    url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
    />
    {children}
    
  </MapContainer>

  )
}

export default Map