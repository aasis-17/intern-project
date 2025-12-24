import { latLng } from 'leaflet'
import { memo } from 'react'
import { MapContainer, TileLayer } from 'react-leaflet'

const Map = ({children}) => {
  return (
    <MapContainer 
    className='w-full h-full rounded-lg'
    center={latLng(27.71, 85.32)}
    zoom={15}
    scrollWheelZoom={false}
    >
    <TileLayer
      // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // attribution='&copy; 
          // <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>'
    url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
    />
    {children}
  </MapContainer>
  )
}

export default memo(Map)