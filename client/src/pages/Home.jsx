import Card from "../components/Card";
import Hero from "../components/Hero";
import SearchCard from "../components/SearchCard";
import SkeletonCard from "../components/SkeletonCard";
import { useFetch } from "../hooks/useFetch";
import { Link } from 'react-router-dom'
import { carCover } from "../utils/api";

const Home = () => {

    const {data: cars, isLoading, error} = useFetch('api/car/')

    return (
        <div className="flex flex-col items-center overflow-hidden">
            <Hero />
            <SearchCard />
            <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 my-6 md:my-10">
                {
                    isLoading && Array(6).fill(0).map((_, id) => <SkeletonCard key={id} />)
                }

                {
                    !isLoading && !error && Array.isArray(cars) && cars.map(car => (
                        <Link
                          to={`details/${car._id}`}
                          key={car._id}
                          className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e93c3d] focus-visible:ring-offset-2 rounded-2xl"
                        >
                            <Card
                              carName={car.name}
                              brand={car.brand}
                              location={car.location || car.brand}
                              price={car.pricePerDay}
                              seats={car.seats}
                              fuelType={car.fuelType}
                              image={import.meta.env.VITE_API + 'images/' + carCover(car)}
                            />
                        </Link>
                        ))
                }

                {error && (
                    <div className="col-span-full text-center text-red-500 py-10">
                      Couldn’t load cars. Please try again.
                    </div>
                )}

                {!isLoading && !error && Array.isArray(cars) && cars.length === 0 && (
                    <div className="col-span-full text-center text-stone-500 py-10">
                      No cars available yet.
                    </div>
                )}
            </div>
        </div>
    );
}
 
export default Home;