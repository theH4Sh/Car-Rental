import Card from "../components/Card";
import Hero from "../components/Hero";
import SearchCard from "../components/SearchCard";4
import SkeletonCard from "../components/SkeletonCard";
import { useFetch } from "../hooks/useFetch";
import { Link } from 'react-router-dom'

const Home = () => {

    const {data: cars, isLoading, error} = useFetch('api/car/')

    return (
        <div className="flex flex-col items-center overflow-hidden">
            <Hero />
            <SearchCard />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    isLoading && Array(6).fill(0).map((_, id) => <SkeletonCard key={id} />)
                }

                {
                    !isLoading && !error && (cars.map(car => (
                        <Link to={`details/${car._id}`} key={car._id}>
                            <Card 
                            carName={car.name} 
                            location="Tokyo" 
                            price={car.pricePerDay}
                            image={import.meta.env.VITE_API + 'images/' + car.image}
                            />
                        </Link>
                        )))
                        
                }

                {error && (
                    <div> {error} </div>
                )}
            </div>
        </div>
    );
}
 
export default Home;