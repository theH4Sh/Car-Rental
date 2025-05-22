const SearchCard = () => {
    return ( 
        <div className="m-5 text-sm">
            <div className="bg-[#513336] text-white font-semibold p-3 w-full md:w-32 rounded-t-2xl text-center">Rent Car</div>
            <div className="md:h-22 shadow-xl p-2 md:rounded-tr-3xl rounded-b-3xl flex flex-col md:flex-row items-center justify-center">
                <div className="flex items-center px-3 py-1 w-full">
                    <div className="absolute translate-x-1">
                        <img 
                        src="/carseat.png" 
                        alt="seat" className="h-8"
                        />
                    </div>
                    <input type="text"
                    placeholder="Number of seats" 
                    className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center px-3 py-1 w-full">
                    <div className="absolute translate-x-1">
                        <img 
                        src="/price.png" 
                        alt="seat" className="h-7"
                        />
                    </div>
                    <input type="text"
                    placeholder="Price" 
                    className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center px-3 py-1 w-full md:mr-4">
                    <div className="absolute translate-x-1">
                        <img 
                        src="/location.png" 
                        alt="seat" className="h-7"
                        />
                    </div>
                    <input type="text"
                    placeholder="Location" 
                    className="border border-gray-200 p-3 pl-12 w-full outline-none rounded-xl font-semibold focus:ring-2 focus:ring-gray-400"
                    />
                </div>
                <div className="flex items-center w-full md:w-auto md:border-l-2 md:border-gray-200">
                    <button className="bg-[#e93c3d] m-3 text-white font-semibold rounded-lg p-2 
                    w-full md:mx-5 md:w-32 lg:mx-8
                    hover:bg-red-700 cursor-pointer transition
                    ">
                        Search
                    </button>
                </div>
            </div>
        </div>
     );
}
 
export default SearchCard;