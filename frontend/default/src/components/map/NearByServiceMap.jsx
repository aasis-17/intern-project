import React, { memo } from 'react'
import { useMap, Marker, Popup } from 'react-leaflet'
import { icon, latLng } from 'leaflet'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router'

const NearByServiceMap = ({mapDetails}) => {
    const {id} = useParams()
    const queryClient = useQueryClient()
    const services = queryClient.getQueryData(["nearByServices", id])

        const map = useMap()
    
        map.flyTo(latLng(mapDetails.serviceLocationMapCoordinates?.latitude || mapDetails.destinationMapCoordinates?.latitude, mapDetails.serviceLocationMapCoordinates?.longitude || mapDetails.destinationMapCoordinates?.longitude), map.getZoom(17))

        return  (
        <>
            <Marker icon={icon({iconSize:40, iconUrl : "/destination.webp"})} position={ latLng(mapDetails.serviceLocationMapCoordinates?.latitude || mapDetails.destinationMapCoordinates?.latitude, mapDetails.serviceLocationMapCoordinates?.longitude || mapDetails.destinationMapCoordinates?.longitude)}>
                <Popup>{mapDetails.serviceName || mapDetails.destinationName}</Popup>
            </Marker>
        {services.map((service) => (
                    <Marker icon={icon({iconSize: 40, iconUrl : service.serviceType === "Hotel" ? "/hotel.jpg" : "/restaurant.jpg"})} key={service._id} position={ latLng( service.serviceLocationMapCoordinates.latitude, service.serviceLocationMapCoordinates.longitude)}>
                        <Popup>{service.serviceName}</Popup>
                    </Marker>
        ))}  

        </>
        )

}

export default memo(NearByServiceMap) 