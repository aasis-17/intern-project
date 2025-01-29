import React from 'react'

const RouteGallery = () => {
  return (
    <>
    <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
                {/* {data.destinationImages.map((image) => {
                    return (
                        <img
                        src={image}
                        alt="Gallery 1"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    )
                })} */}

              <img
                src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                alt="Gallery 2"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
                alt="Gallery 3"
                className="w-full h-32 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-1.2.1&auto=format&fit=crop&w=1352&q=80"
                alt="Gallery 4"
                className="w-full h-32 object-cover rounded-lg"
              />
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