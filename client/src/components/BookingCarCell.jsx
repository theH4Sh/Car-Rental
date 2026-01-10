import { Link } from 'react-router-dom'
import { CarFront } from 'lucide-react'
import { bookingCarName, carCover, imageUrl, isCarDeleted } from '../utils/api'

/**
 * Consistent car summary for booking lists when the car may have been deleted.
 */
const BookingCarCell = ({ car, size = 'md', linkToDetails = false }) => {
  const deleted = isCarDeleted(car)
  const dim = size === 'lg' ? 'w-16 h-16' : size === 'sm' ? 'w-10 h-10' : 'w-11 h-11'

  if (deleted) {
    return (
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`${dim} rounded-lg bg-stone-100 text-stone-400 flex items-center justify-center shrink-0 ring-1 ring-stone-200`}
        >
          <CarFront className={size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'} />
        </div>
        <div className="min-w-0">
          <p className="font-medium text-stone-500 italic">Car deleted</p>
          <p className="text-xs text-stone-400">No longer in fleet</p>
        </div>
      </div>
    )
  }

  const title = (
    <p className={`font-medium truncate ${linkToDetails ? 'text-[#2c090a] hover:text-[#e93c3d]' : 'text-[#2c090a]'}`}>
      {bookingCarName(car, car.name)}
    </p>
  )

  return (
    <div className="flex items-center gap-3 min-w-0">
      <img
        src={imageUrl(carCover(car))}
        alt=""
        className={`${dim} rounded-lg object-cover bg-stone-100 shrink-0`}
      />
      <div className="min-w-0">
        {linkToDetails && car._id ? (
          <Link to={`/details/${car._id}`} className="block">
            {title}
          </Link>
        ) : (
          title
        )}
        {car.brand && <p className="text-xs text-stone-400 truncate">{car.brand}</p>}
      </div>
    </div>
  )
}

export default BookingCarCell
