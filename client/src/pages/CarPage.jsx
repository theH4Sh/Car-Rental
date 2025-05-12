import { useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch";
import CarGallery from "../components/CarGallery";
import { Car, CarFront, Cog, Fuel, Gauge, MapPin } from "lucide-react"
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
                      
                      {/* Specs */}
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 py-6">
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
                    </div>
                </div>
            )}
        </div>
     );
}
 
export default CarPage;