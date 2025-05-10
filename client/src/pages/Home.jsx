import { useEffect, useState } from "react";
import Card from "../components/Card";
import Hero from "../components/Hero";
import SearchCard from "../components/SearchCard";4
import SkeletonCard from "../components/SkeletonCard";

const Home = () => {

    const [cars, setCars] = useState([]);
    const [isLoading, setIsLoading] = useState(true)
    
    const link = import.meta.env.VITE_API
    console.log(link+'api/car/')

    useEffect(() => {
        fetch(link + 'api/car/')
         .then(res => res.json())
         .then(data => {
            setCars(data)
            setIsLoading(false)
        })
         .catch(err => console.log(err))
    }, [])

    return (
        <div className="flex flex-col items-center overflow-hidden">
            <Hero />
            <SearchCard />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {
                    isLoading ? Array(6).fill(0).map((_, id) => <SkeletonCard key={id} />) : cars.map(car => (
                        <Card
                        key={car._id} 
                        carName={car.name} 
                        location="Tokyo" 
                        price={car.pricePerDay}
                        image={import.meta.env.VITE_API + 'images/' + car.image}
                        />
                    ))
                }
            </div>
        </div>
    );
}
 
export default Home;