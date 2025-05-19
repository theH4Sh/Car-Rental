import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import CarGallery from "../components/CarGallery";
import { ArrowRight, BadgeCheck, CalendarDays, Car, CarFront, CircleUser, Cog, EllipsisVertical, Fuel, Gauge, MapPin } from "lucide-react"
const CarPage = () => {
    const { id } = useParams()
    const { data: car, isLoading, error } = useFetch(`api/car/${id}`)

    console.log(car)

    const images = [
        "/black911.jpg",
        "/porsche911.jpg",
        "/black911.jpg"
    ]
    
    if (isLoading) return <p className="text-center py-20">Loading...</p>;
    if (error) return <p className="text-center text-red-500">{error.message}</p>;
    if (!car) return <p className="text-center py-20">Car not found</p>;

    return ( 
        <div className="min-h-screen max-w-5xl mx-auto md:px-4">
            {car && (
                <div>
                    <CarGallery
                        mainImage={car.image}
                        images={images}
                        name={car.name}
                    />
                    <div className="my-5">
                        <h1 className="font-bold text-3xl uppercase">{car.name}</h1>
                        <div>
                          <span className="font-bold">⭐ 4.8 </span>
                          <span className="text-gray-500">(2,436 reviews)</span>
                        </div>

                        <div className="my-5 flex space-x-2 font-bold">
                          <MapPin />
                          <h4>Tokyo, Japan</h4>
                        </div>
                      <div className="md:flex md:items-start md:gap-10"> 
                        <div>
                          {/* Specs */}
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <img className="w-8 h-8 ml-3" src="/carseat.png" alt="car seat" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Seats</span>
                                  <h6 className="font-semibold text-base">7 seats</h6>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <Cog className="ml-4" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Transmission</span>
                                  <h6 className="font-semibold text-base">Auto</h6>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <Fuel className="ml-4" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Fuel</span>
                                  <h6 className="font-semibold text-base">Petrol</h6>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <CarFront className="ml-4" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Brand</span>
                                  <h6 className="font-semibold text-base">Porsche</h6>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <Car className="ml-4" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Car Type</span>
                                  <h6 className="font-semibold text-base">Carnival</h6>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 border border-gray-300 rounded-lg">
                                <Gauge className="ml-4" />
                                <div className="leading-tight">
                                  <span className="text-gray-500">Mileage</span>
                                  <h6 className="font-semibold text-base">23000 km</h6>
                                </div>
                            </div>
                          </div>

                          {/* Description */}
                          <div>
                            <h2 className="text-xl font-bold mb-2">Description</h2>
                            <p className="text-gray-500">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aut impedit voluptas adipisci quos aliquid, minus vel quia eligendi qui incidunt! Quis voluptatum pariatur vero asperiores quaerat ex dolor placeat!
                            </p>
                          </div>

                          {/* Reviews */}
                          <div className="pt-8">
                            <h2 className="text-xl font-bold">Customer Reviews <span className="text-gray-400">(24 reviews)</span></h2>
                            {[1,2,3].map((_, idx) => (
                              <div key={idx} className="border border-gray-300 rounded-lg my-5">
                                <div className="flex items-center justify-between border-gray-300 border-b-1 p-5">
                                  <div className="flex items-center gap-2">
                                    <CircleUser />
                                    <div className="font-bold">Guy Hawkins
                                      <div className="text-yellow-500">★★★★<span className="text-gray-300">★</span></div>
                                    </div>
                                  </div>
                                  <div className="flex text-gray-400 gap-2 font-bold"> <CalendarDays /> May 13, 2025</div>
                                </div>
                                <p className="text-gray-500 p-5">
                                Lorem, ipsum dolor sit amet consectetur adipisicing elit. Voluptatum aut impedit voluptas adipisci quos aliquid, minus vel quia eligendi qui incidunt! Quis voluptatum pariatur vero asperiores quaerat ex dolor placeat!
                                </p>
                              </div>
                            ))}
                            <div className="my-3 font-bold flex justify-center gap-1 border-2 border-gray-300 rounded-lg py-4 px-3 md:w-1/4 cursor-pointer hover:text-red-700 hover:border-red-600 transition-all duration-200">
                              See all <ArrowRight />
                            </div>

                            <div>
                              <h2 className="font-bold text-xl mt-5 mb-3">Review</h2>
                              <textarea 
                                rows="4"
                                placeholder="Enter description..."
                                className="border border-gray-400 rounded-sm p-1 w-full"
                              />
                              <div className="text-lg font-semibold flex items-center gap-3 my-3">
                                <span>Review:</span>
                                <span className="text-gray-300 text-xl">★★★★★</span>
                              </div>
                              <button className="p-3 px-7 rounded-lg cursor-pointer transition-all duration-200 border border-[#513336] bg-[#513336] text-white hover:bg-white hover:text-[#513336] font-semibold">Send Review</button>
                            </div>
                          </div>
                        </div>
                        <div className="w-full">
                          {/* Pricing */}
                          <div className="flex flex-col w-full border border-gray-400 rounded-xl">
                            <div className="flex items-center justify-between border-b border-gray-400 px-7 py-5">
                              <h4 className="text-gray-400 font-bold text-xl md:text-lg lg:text-xl">Price</h4>
                              <h2 className="text-3xl md:text-xl lg:text-3xl font-bold">$43,000</h2>
                            </div>
                            <div className="px-7 py-5">
                              <button className="bg-[#e93c3d] p-3 w-full rounded-lg text-white font-bold">Book Now</button>
                            </div>
                          </div>

                          {/* Car Owner */}
                          <div className="my-5">
                            <h3 className="font-bold text-xl my-3">Car Owner</h3>
                            <div className="px-5 rounded-lg border py-5 border-gray-400 flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <span className="text-white font-semibold rounded-full bg-[#e93c3d] w-10 h-10 p-6 flex justify-center place-items-center">H</span>
                                <div>
                                  <h4 className="font-bold">Owner Name</h4>
                                  <span className="flex items-center gap-1 text-sm bg-green-500 rounded-2xl px-2"><BadgeCheck /> Admin </span>
                                </div>
                              </div>
                              <EllipsisVertical />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default CarPage;