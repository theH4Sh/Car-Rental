import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, ImageOff } from 'lucide-react'
import { imageUrl } from '../utils/api'

const CarGallery = ({ images = [], carName }) => {
    const gallery = images.filter(Boolean)
    const [active, setActive] = useState(0)
    const thumbRefs = useRef([])

    useEffect(() => {
        setActive(0)
    }, [images])

    useEffect(() => {
        thumbRefs.current[active]?.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center',
        })
    }, [active])

    useEffect(() => {
        if (gallery.length < 2) return undefined

        const onKey = (e) => {
            if (e.key === 'ArrowLeft') {
                setActive((i) => (i - 1 + gallery.length) % gallery.length)
            }
            if (e.key === 'ArrowRight') {
                setActive((i) => (i + 1) % gallery.length)
            }
        }

        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [gallery.length])

    if (!gallery.length) {
        return (
            <div className="rounded-xl bg-stone-100 h-64 md:h-[500px] flex flex-col items-center justify-center gap-2 text-stone-400 border border-stone-200">
                <ImageOff className="w-8 h-8" />
                <span className="text-sm font-medium">No images available</span>
            </div>
        )
    }

    const safeIndex = Math.min(active, gallery.length - 1)
    const hasThumbs = gallery.length > 1

    const goPrev = () => setActive((i) => (i - 1 + gallery.length) % gallery.length)
    const goNext = () => setActive((i) => (i + 1) % gallery.length)

    return (
        <div
            className={`grid grid-cols-1 gap-3 ${hasThumbs ? 'md:grid-cols-4 lg:grid-cols-5' : ''}`}
            role="region"
            aria-label={`${carName} image gallery`}
        >
            <div
                className={`group relative overflow-hidden rounded-xl bg-stone-100 border border-stone-200/80 ${
                    hasThumbs ? 'md:col-span-3 lg:col-span-4' : ''
                }`}
            >
                <img
                    key={gallery[safeIndex]}
                    src={imageUrl(gallery[safeIndex])}
                    alt={`${carName} — photo ${safeIndex + 1}`}
                    className="w-full h-[260px] sm:h-[360px] md:h-[500px] object-cover animate-[fadeIn_220ms_ease-out]"
                />

                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent" />

                {hasThumbs && (
                    <>
                        <button
                            type="button"
                            onClick={goPrev}
                            aria-label="Previous image"
                            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2c090a] shadow-md backdrop-blur-sm transition hover:bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e93c3d]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                            type="button"
                            onClick={goNext}
                            aria-label="Next image"
                            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-[#2c090a] shadow-md backdrop-blur-sm transition hover:bg-white opacity-100 md:opacity-0 md:group-hover:opacity-100 focus:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e93c3d]"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>

                        <span className="absolute bottom-3 right-3 rounded-full bg-black/65 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm tabular-nums">
                            {safeIndex + 1} / {gallery.length}
                        </span>
                    </>
                )}
            </div>

            {hasThumbs && (
                <div className="flex gap-2 overflow-x-auto md:flex-col md:overflow-y-auto md:max-h-[500px] pb-1 md:pb-0 md:pr-1 scrollbar-thin">
                    {gallery.map((img, id) => {
                        const selected = id === safeIndex
                        return (
                            <button
                                key={`${img}-${id}`}
                                ref={(el) => {
                                    thumbRefs.current[id] = el
                                }}
                                type="button"
                                onClick={() => setActive(id)}
                                aria-label={`View image ${id + 1}`}
                                aria-current={selected}
                                className={`relative shrink-0 overflow-hidden rounded-lg border-2 transition duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e93c3d] focus-visible:ring-offset-1 ${
                                    selected
                                        ? 'border-[#e93c3d] shadow-sm'
                                        : 'border-transparent hover:border-stone-300'
                                }`}
                            >
                                <img
                                    src={imageUrl(img)}
                                    alt=""
                                    className={`h-20 w-28 md:h-[110px] md:w-full object-cover transition duration-200 ${
                                        selected ? 'opacity-100' : 'opacity-70 hover:opacity-100'
                                    }`}
                                />
                                {selected && (
                                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#e93c3d]" />
                                )}
                            </button>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

export default CarGallery
