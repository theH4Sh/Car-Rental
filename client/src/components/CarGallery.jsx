const CarGallery = ({ mainImage, images, carName }) => {
    return ( 
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-2">
            <div className="md:col-span-3 lg:col-span-4">
                <img 
                src={import.meta.env.VITE_API + 'images/' + mainImage} 
                alt={carName}
                className="rounded-xl w-full h-auto md:h-[500px] lg:w-[800px] lg:h-[500px] object-cover" />
            </div>
            <div className="gap-2 flex md:flex-col">
                {images.map((img, id) => (
                    <img 
                        key={id}
                        src={img}
                        alt={carName}
                        className="rounded-lg md:h-[160.5px] w-full min-w-[90px] cursor-pointer object-cover"
                    />
                ))}
            </div>
        </div>
     );
}
 
export default CarGallery;