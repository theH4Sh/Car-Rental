const Card = ({ carName, location, price, image }) => {
    console.log(image)
    return ( 
        <div className="w-80 my-10 rounded-2xl overflow-hidden shadow-xl">
            <img src={image} alt="carName.name" className="w-full h-52 object-cover" />
            <div className="p-5 space-y-1.5">
                <h1 className="font-extrabold text-xl text-[#2c090a]">{ carName }</h1>
                <div className="flex items-center gap-1 text-gray-400 font-bold text-sm">
                    <img src="/icons8-star-96.png" alt="star" width="20" height="20" />
                    <h3>Reviews (20)</h3>
                </div>
                <div className="flex items-center gap-1 text-gray-400 font-bold text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-map-pin"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                    <h3>{ location }</h3>
                </div>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline gap-1">
                        <h1 className="font-extrabold text-xl text-[#2c090a]">${price}</h1>
                        <span className="text-sm text-gray-500 font-semibold">/day</span>
                    </div>

                    <button className="bg-[#2c090a] text-white text-sm w-28 h-10 rounded-lg cursor-pointer">See More</button>
                </div>
            </div>
        </div>
     );
}
 
export default Card;