import React from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

const Map = ({children}) => {
  return (
    <MapContainer 
    className='w-full h-full rounded-lg'
    center={{lat : 27.05365240, lng :87.30161320}}
    zoom={13}
    scrollWheelZoom={false}>
    <TileLayer
      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    />
    {children}
  </MapContainer>
  )
}

export default Map