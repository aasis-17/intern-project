import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

const Map = ({children}) => {
  return (
    <MapContainer 
    className='w-full h-64 rounded-lg'
    center={{lat : 27.05365240, lng :87.30161320}}
    zoom={8}
    scrollWheelZoom={false}>
    <TileLayer
      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {children}
  </MapContainer>
  )
}

export default Map