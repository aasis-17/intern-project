import { useQueryClient } from '@tanstack/react-query'
import React from 'react'

const RouteGallery = () => {

  const queryClient = useQueryClient()
  const destinationDetails = queryClient.getQueryData(["destinationId"])
  console.log(destinationDetails)
  return (
    <>
    <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
                {destinationDetails?.destinationImages.map((image) => {
                    return (
                        <img
                        key={image._id}
                        src={image.src}
                        alt="Gallery 1"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )
                })}

            </div>
          </div>

          {/* Activities Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Popular Activities
            </h3>
            <ul className="space-y-2">
              <li className="text-gray-600">Surfing at Kuta Beach</li>
              <li className="text-gray-600">Exploring Ubud's Rice Terraces</li>
              <li className="text-gray-600">Visiting Uluwatu Temple</li>
              <li className="text-gray-600">Snorkeling in Nusa Penida</li>
            </ul>
          </div>

    </>
  )
}

export default RouteGallery