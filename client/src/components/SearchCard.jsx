import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SearchCard = () => {
    const navigate = useNavigate()
    const [seats, setSeats] = useState('')
    const [price, setPrice] = useState('')
    const [location, setLocation] = useState('')

    const handleSearch = (e) => {
        e.preventDefault()
        const params = new URLSearchParams()
        if (seats) params.set('seats', seats)
        if (price) params.set('price', price)
        if (location) params.set('location', location)
        const query = params.toString()
        navigate(query ? `/rent?${query}` : '/rent')
    }

    return (
        <form onSubmit={handleSearch} className="m-5 text-sm">
            <div className="bg-[#513336] text-white font-semibold p-3 w-full md:w-32 rounded-t-2xl text-center">Rent Car</div>
            <div className="md:h-22 shadow-xl p-2 md:rounded-tr-3xl rounded-b-3xl flex flex-col md:flex-row items-center justify-center">
                <div className="flex items-center px-3 py-1 w-full relative">
                    <div className="absolute translate-x-1">
                        <img
                        src="/carseat.png"
                        alt="seat" className="h-8"
                        />
                    </div>
                    <input
                        type="number"
                        min="1"
                        value={seats}
                        onChange={(e) => setSeats(e.target.value)}
                        placeholder="Number of seats"
                        className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center px-3 py-1 w-full relative">
                    <div className="absolute translate-x-1">
                        <img
                        src="/price.png"
                        alt="price" className="h-7"
                        />
                    </div>
                    <input
                        type="number"
                        min="0"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Max price / day"
                        className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center px-3 py-1 w-full md:mr-4 relative">
                    <div className="absolute translate-x-1">
                        <img
                        src="/location.png"
                        alt="location" className="h-7"
                        />
                    </div>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Location"
                        className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center w-full md:w-auto md:border-l-2 md:border-gray-200">
                    <button
                        type="submit"
                        className="bg-[#e93c3d] m-3 text-white font-semibold rounded-lg p-2
                    w-full md:mx-5 md:w-32 lg:mx-8
                    hover:bg-red-700 cursor-pointer transition
                    ">
                        Search
                    </button>
                </div>
            </div>
        </form>
    )
}

export default SearchCard
