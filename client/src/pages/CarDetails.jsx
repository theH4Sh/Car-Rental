export default function CarDetails() {
  return (
    <div className="bg-white px-6 py-10 max-w-7xl mx-auto space-y-12">
      {/* Hero Images */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <img src="/main-car.jpg" alt="Main car" className="rounded-xl w-full h-auto" />
        </div>
        <div className="space-y-4">
          <img src="/car1.jpg" className="rounded-lg" alt="" />
          <img src="/car2.jpg" className="rounded-lg" alt="" />
          <img src="/car3.jpg" className="rounded-lg" alt="" />
        </div>
      </div>

      {/* Car Info */}
      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1 space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">MAZDA CX-5 2021</h1>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>⭐ 4.8 (2,436 reviews)</span>
            <span>·</span>
            <span>Post code: BTX0000614</span>
          </div>
          <p className="text-gray-700">📍 Hoan Kiem district, Ha Noi city</p>

          {/* Specs */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 py-6">
            <div className="p-4 bg-gray-100 rounded-lg">🪑 7 seats</div>
            <div className="p-4 bg-gray-100 rounded-lg">⚙️ Auto</div>
            <div className="p-4 bg-gray-100 rounded-lg">⛽ Gas</div>
            <div className="p-4 bg-gray-100 rounded-lg">🚘 Brand: Kia</div>
            <div className="p-4 bg-gray-100 rounded-lg">🚗 Type: Carnival</div>
            <div className="p-4 bg-gray-100 rounded-lg">📏 Mileage: 23,000 km</div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Description</h2>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur. Maecenas tristique mauris
              nisi in eget senectus metus. Ante felis diam eleifend at scelerisque.
            </p>
          </div>

          {/* Reviews */}
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-semibold">Customer Reviews (24)</h2>
            {[1, 2, 3].map((_, idx) => (
              <div key={idx} className="p-4 bg-gray-100 rounded-lg space-y-1">
                <div className="flex justify-between items-center text-sm">
                  <div className="font-medium">Guy Hawkins</div>
                  <div className="text-gray-500">June 13, 2023</div>
                </div>
                <div className="text-yellow-500">★★★★★</div>
                <p className="text-gray-600 text-sm">
                  Lorem ipsum dolor sit amet consectetur. Quam dolor augue placerat
                  viverra elit vitae habitasse egestas rutrum.
                </p>
              </div>
            ))}
          </div>

          {/* Review Form */}
          <div className="pt-8 space-y-4">
            <h2 className="text-xl font-semibold">Review</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <input placeholder="Your name" className="p-3 border border-gray-300 rounded-lg" />
              <input placeholder="Your email" className="p-3 border border-gray-300 rounded-lg" />
            </div>
            <textarea
              rows="4"
              placeholder="Enter description..."
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
            <div>
              <span className="text-sm">Review: </span>
              <span className="text-yellow-500 text-lg">★★★★★</span>
            </div>
            <button className="px-6 py-2 bg-[#431c0d] text-white rounded-lg">Send review</button>
          </div>
        </div>

        {/* Price & Owner */}
        <div className="w-full lg:w-80 space-y-6">
          <div className="bg-gray-100 p-6 rounded-lg shadow">
            <div className="text-gray-600 text-sm">Price</div>
            <div className="text-3xl font-bold text-black mb-4">$43,000</div>
            <button className="w-full bg-[#e93c3d] hover:bg-[#d13435] text-white font-semibold py-2 rounded-lg transition">
              Contact
            </button>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg flex items-center gap-4">
            <img src="/owner.jpg" alt="Owner" className="w-12 h-12 rounded-full" />
            <div>
              <div className="font-semibold">Darrell Steward</div>
              <div className="text-sm text-green-600">✔ Verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Similar Cars */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">Similar Cars</h2>
          <a href="#" className="text-sm text-gray-500 hover:underline">See all →</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <img src="/car-thumb.jpg" alt="Car" className="rounded-lg mb-3" />
              <h3 className="font-semibold">Jaguar XE L P250 2019</h3>
              <p className="text-sm text-gray-500">📍 Hoan Kiem, Ha Noi</p>
              <div className="flex justify-between text-xs text-gray-500 my-2">
                <span>🚘 4 seats</span>
                <span>⛽ Gas</span>
                <span>⚙ Auto</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="font-bold">$400/day</span>
                <button className="text-sm text-white bg-[#431c0d] px-3 py-1 rounded-md">See more</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
