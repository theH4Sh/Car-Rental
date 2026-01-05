import { ArrowUpRight, Fuel, MapPin, Users } from 'lucide-react'

const Card = ({
  carName,
  brand,
  location,
  price,
  image,
  seats,
  fuelType,
}) => {
  return (
    <article className="group relative flex h-full w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-stone-200/80 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#e93c3d]/35 hover:shadow-[0_18px_40px_rgba(44,9,10,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-stone-100">
        <img
          src={image}
          alt={carName}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 ease-out group-hover:scale-105"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#2c090a]/55 via-transparent to-transparent opacity-80" />

        {brand && (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold tracking-wide text-[#2c090a] shadow-sm backdrop-blur">
            {brand}
          </span>
        )}

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-lg font-bold text-white drop-shadow-sm">
              {carName}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-sm font-medium text-white/90">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">{location || '—'}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
        <div className="flex flex-wrap gap-2">
          {seats != null && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f6f3f0] px-2.5 py-1.5 text-xs font-semibold text-[#513336]">
              <Users className="h-3.5 w-3.5" />
              {seats} seats
            </span>
          )}
          {fuelType && (
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#f6f3f0] px-2.5 py-1.5 text-xs font-semibold capitalize text-[#513336]">
              <Fuel className="h-3.5 w-3.5" />
              {fuelType}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-stone-100 pt-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
              From
            </p>
            <p className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-[#e93c3d]">${price}</span>
              <span className="text-sm font-semibold text-stone-400">/day</span>
            </p>
          </div>

          <span className="inline-flex items-center gap-1 rounded-xl bg-[#2c090a] px-3.5 py-2.5 text-sm font-semibold text-white transition duration-300 group-hover:bg-[#e93c3d]">
            View
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </article>
  )
}

export default Card
