import { useEffect, useState } from 'react'
import { imageUrl } from '../utils/api'

const CarGallery = ({ images = [], carName }) => {
    const gallery = images.filter(Boolean)
    const [active, setActive] = useState(0)

    useEffect(() => {
        setActive(0)
    }, [images])

    if (!gallery.length) {
        return (
            <div className="rounded-xl bg-stone-100 h-64 md:h-[500px] flex items-center justify-center text-stone-400">
                No images
            </div>
        )
    }

    const safeIndex = Math.min(active, gallery.length - 1)
    const thumbs = gallery.length > 1 ? gallery : []

    return (
        <div className={`grid grid-cols-1 gap-2 ${thumbs.length ? 'md:grid-cols-4 lg:grid-cols-5' : ''}`}>
            <div className={thumbs.length ? 'md:col-span-3 lg:col-span-4' : ''}>
                <img
                    src={imageUrl(gallery[safeIndex])}
                    alt={carName}
                    className="rounded-xl w-full h-auto md:h-[500px] object-cover bg-stone-100"
                />
            </div>

            {thumbs.length > 0 && (
                <div className="gap-2 flex md:flex-col overflow-x-auto md:overflow-y-auto md:max-h-[500px]">
                    {gallery.map((img, id) => (
                        <button
                            key={`${img}-${id}`}
                            type="button"
                            onClick={() => setActive(id)}
                            className={`shrink-0 rounded-lg overflow-hidden border-2 transition-colors ${
                                id === safeIndex ? 'border-[#e93c3d]' : 'border-transparent'
                            }`}
                        >
                            <img
                                src={imageUrl(img)}
                                alt={`${carName} ${id + 1}`}
                                className="rounded-lg md:h-[110px] h-20 w-28 md:w-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}

export default CarGallery
