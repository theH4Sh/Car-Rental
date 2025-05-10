const Hero = () => {
    return ( 
        <div className='flex flex-col lg:flex-row items-center justify-evenly'>
            <div className="flex flex-col items-center md:items-start space-y-5 lg:ml-30">
                <div>
                    <h1 className="text-5xl font-bold text-[#331512]">Buy, sell & rent</h1>
                    <h1 className="text-5xl font-bold text-[#e93c3b]">reputable cars</h1>
                </div>
                <div className="font-semibold w-[340px] text-[#513336]">
                    <p>Buy and sell reputable cars. Renting car is easy and fast with Topcar</p>
                </div>
                <div className="flex items-center justify-evenly text-[#513336]">
                    <div className="border-r-1 border-slate-200 pr-5">
                        <h1 className="text-4xl font-bold">50+</h1>
                        <p className="font-semibold">Car brands</p>
                    </div>
                    <div className="pl-5">
                        <h1 className="text-4xl font-bold">10k+</h1>
                        <p className="font-semibold">Clients</p>
                    </div>
                </div>
            </div>
            <div className='w-[480px]'>
                <img src="/ferrari.png" alt="ferrari" />
            </div>
        </div>
     );
}
 
export default Hero;