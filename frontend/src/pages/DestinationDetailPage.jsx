import React, { useState } from "react";

const DestinationDetailPage = () => {
  const destination = {
    name: "Bali, Indonesia",
    coverImage:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
    description:
      "Bali is an Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches, and coral reefs. The island is home to religious sites such as cliffside Uluwatu Temple.",
    location: "Indonesia",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126438.347068943!2d115.08804822167969!3d-8.455371999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd22f7520fca7d3%3A0x2872b62cc456cd84!2sBali%2C%20Indonesia!5e0!3m2!1sen!2sus!4v1698765432100!5m2!1sen!2sus",
  };

  // State for reviews
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");

  // Handle review submission
  const handleSubmitReview = (e) => {
    e.preventDefault();
    if (newReview.trim()) {
      setReviews([...reviews, { id: Date.now(), comment: newReview }]);
      setNewReview("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Image Section */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={destination.coverImage}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white text-center">
            {destination.name}
          </h1>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Destination Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
            About {destination.name}
          </h2>
          <p className="text-gray-600 leading-relaxed mb-6">
            {destination.description}
          </p>

          {/* Location */}
          <div className="flex items-center space-x-2 mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <p className="text-gray-700 font-medium">{destination.location}</p>
          </div>

          {/* Map Preview */}
          <div className="mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Location</h3>
            <div className="rounded-lg overflow-hidden shadow-md">
              <iframe
                src={destination.mapEmbedUrl}
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Destination Map"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Review Component */}
        <div className="bg-white rounded-lg shadow-lg p-6 md:p-8 mt-8">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Reviews</h3>
          {/* Review Form */}
          <form onSubmit={handleSubmitReview} className="mb-6">
            <textarea
              value={newReview}
              onChange={(e) => setNewReview(e.target.value)}
              placeholder="Write your review..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
              required
            />
            <button
              type="submit"
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Submit Review
            </button>
          </form>

          {/* Review List */}
          <div className="space-y-4">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="p-4 border border-gray-200 rounded-lg"
              >
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Sections (Optional) */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Gallery Section */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Gallery</h3>
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1353&q=80"
                alt="Gallery 1"
                className="w-full h-32 object-cover rounded-lg"
              />
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
        </div>
      </div>
    </div>
  );
};

export default DestinationDetailPage;