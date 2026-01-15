import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Car,
  CarFront,
  CircleUser,
  Cog,
  Fuel,
  MapPin,
} from 'lucide-react'
import { apiFetch, carImages } from '../utils/api'
import CarGallery from '../components/CarGallery'

const StarRating = ({ value, onChange, size = 'text-xl' }) => (
  <div className={`flex gap-1 ${size}`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        disabled={!onChange}
        className={`${
          onChange
            ? 'cursor-pointer hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#e93c3d] rounded'
            : 'cursor-default'
        } transition-transform`}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >
        <span className={n <= value ? 'text-yellow-500' : 'text-gray-300'}>★</span>
      </button>
    ))}
  </div>
)

const SpecTile = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2.5 px-1 transition-colors duration-200 hover:border-gray-400 hover:bg-stone-50/80">
    <div className="ml-2 shrink-0 text-[#513336] flex items-center justify-center w-8">
      {icon}
    </div>
    <div className="leading-tight min-w-0 pr-2">
      <span className="text-gray-500 text-sm">{label}</span>
      <h6 className="font-semibold text-base truncate capitalize">{value}</h6>
    </div>
  </div>
)

const daysBetween = (start, end) => {
  const s = new Date(start)
  const e = new Date(end)
  const ms = e.setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0)
  return Math.round(ms / (1000 * 60 * 60 * 24))
}

const rentalDayCount = (start, end) => {
  if (!start || !end) return 0
  const diff = daysBetween(start, end)
  if (diff < 0) return 0
  return Math.max(1, diff)
}

const todayISO = () => new Date().toISOString().slice(0, 10)

const CarPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const auth = useSelector((state) => state.user)

  const [car, setCar] = useState(null)
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showAllReviews, setShowAllReviews] = useState(false)

  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [booking, setBooking] = useState(false)

  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [sendingReview, setSendingReview] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchCar = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await apiFetch(`api/car/${id}`)
        if (cancelled) return
        setCar(data)
        setReviews(data.reviews || [])
      } catch (err) {
        if (!cancelled) setError(err)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchCar()
    return () => {
      cancelled = true
    }
  }, [id])

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0)
    return Math.round((sum / reviews.length) * 10) / 10
  }, [reviews])

  const rentalDays = rentalDayCount(startDate, endDate)
  const totalPrice = car && rentalDays > 0 ? rentalDays * car.pricePerDay : 0

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)
  const alreadyReviewed =
    auth.isAuthenticated &&
    reviews.some((r) => r.user?.username === auth.user || r.user?._id === auth.user)

  const requireLogin = () => {
    toast.error('Please log in to continue')
    navigate('/login')
  }

  const handleBook = async (e) => {
    e.preventDefault()
    if (!auth.isAuthenticated) return requireLogin()

    if (!startDate || !endDate) {
      toast.error('Select start and end dates')
      return
    }

    if (endDate < startDate) {
      toast.error('End date cannot be before start date')
      return
    }

    if (!phone.trim() || phone.trim().length < 7) {
      toast.error('Enter a valid phone number')
      return
    }

    if (!address.trim() || address.trim().length < 5) {
      toast.error('Enter your pickup/delivery address')
      return
    }

    setBooking(true)
    try {
      await apiFetch('api/booking/', {
        method: 'POST',
        body: JSON.stringify({
          carId: id,
          startDate,
          endDate,
          phone: phone.trim(),
          address: address.trim(),
        }),
      })
      toast.success('Booking submitted — pending approval')
      setStartDate('')
      setEndDate('')
      setPhone('')
      setAddress('')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBooking(false)
    }
  }

  const handleReview = async (e) => {
    e.preventDefault()
    if (!auth.isAuthenticated) return requireLogin()

    if (!rating) {
      toast.error('Select a rating')
      return
    }

    if (!comment.trim()) {
      toast.error('Write a short review')
      return
    }

    setSendingReview(true)
    try {
      const review = await apiFetch(`api/reviews/${id}`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment }),
      })
      setReviews((prev) => [review, ...prev])
      setRating(0)
      setComment('')
      toast.success('Review submitted')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSendingReview(false)
    }
  }

  const loadAllReviews = async () => {
    try {
      const data = await apiFetch(`api/reviews/${id}`)
      setReviews(data.reviews || [])
      setShowAllReviews(true)
    } catch (err) {
      toast.error(err.message)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-64 md:h-[500px] rounded-xl bg-stone-200" />
        <div className="h-8 w-2/3 rounded bg-stone-200" />
        <div className="h-4 w-1/3 rounded bg-stone-200" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-16 rounded-lg bg-stone-200" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20 space-y-3 px-4">
        <p className="text-red-500 font-medium">{error.message}</p>
        <Link to="/rent" className="text-[#e93c3d] hover:underline font-medium inline-block">
          Browse other cars
        </Link>
      </div>
    )
  }

  if (!car) {
    return (
      <div className="text-center py-20 space-y-3 px-4">
        <p className="text-gray-500">Car not found</p>
        <Link to="/rent" className="text-[#e93c3d] hover:underline font-medium inline-block">
          Browse cars
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 md:px-4 pb-10">
      <CarGallery images={carImages(car)} carName={car.name} />

      <div className="my-6 md:my-8">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-[#e93c3d] mb-1">
              {car.brand}
            </p>
            <h1 className="font-bold text-3xl uppercase text-[#2c090a] leading-tight">
              {car.name}
            </h1>
            <div className="mt-2">
              {reviews.length > 0 ? (
                <>
                  <span className="font-bold">⭐ {averageRating} </span>
                  <span className="text-gray-500">
                    ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                  </span>
                </>
              ) : (
                <span className="text-gray-500">No reviews yet</span>
              )}
            </div>
          </div>
        </div>

        <div className="my-5 flex items-center gap-2 font-bold text-gray-700">
          <MapPin className="w-5 h-5 shrink-0 text-[#e93c3d]" />
          <h4>{car.location || car.brand}</h4>
        </div>

        <div className="md:flex md:items-start md:gap-10 relative isolate">
          <div className="flex-1 min-w-0 relative z-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
              <SpecTile
                icon={<img className="w-8 h-8" src="/carseat.png" alt="" />}
                label="Seats"
                value={car.seats != null ? `${car.seats} seats` : '—'}
              />
              <SpecTile
                icon={<Fuel className="w-5 h-5" />}
                label="Fuel"
                value={car.fuelType || '—'}
              />
              <SpecTile
                icon={<MapPin className="w-5 h-5" />}
                label="Location"
                value={car.location || '—'}
              />
              <SpecTile
                icon={<CarFront className="w-5 h-5" />}
                label="Brand"
                value={car.brand}
              />
              <SpecTile
                icon={<Car className="w-5 h-5" />}
                label="Model"
                value={car.name}
              />
              <SpecTile
                icon={<Cog className="w-5 h-5" />}
                label="Price"
                value={`$${car.pricePerDay}/day`}
              />
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2 text-[#2c090a]">Description</h2>
              <p className="text-gray-500 leading-relaxed">{car.description}</p>
            </div>

            <div className="pt-8">
              <h2 className="text-xl font-bold text-[#2c090a]">
                Customer Reviews{' '}
                <span className="text-gray-400 font-semibold">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 my-5">Be the first to review this car.</p>
              ) : (
                displayedReviews.map((review) => (
                  <div
                    key={review._id}
                    className="border border-gray-300 rounded-lg my-5 transition-colors hover:border-gray-400"
                  >
                    <div className="flex items-center justify-between gap-3 border-gray-300 border-b p-4 sm:p-5">
                      <div className="flex items-center gap-2 min-w-0">
                        <CircleUser className="w-6 h-6 shrink-0 text-[#513336]" />
                        <div className="font-bold min-w-0">
                          <span className="truncate block">
                            {review.user?.username || 'User'}
                          </span>
                          <StarRating value={review.rating} size="text-base" />
                        </div>
                      </div>
                      <div className="flex items-center text-gray-400 gap-2 font-bold text-sm shrink-0">
                        <CalendarDays className="w-4 h-4" />
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                    <p className="text-gray-500 p-4 sm:p-5 leading-relaxed">{review.comment}</p>
                  </div>
                ))
              )}

              {reviews.length > 3 && !showAllReviews && (
                <button
                  type="button"
                  onClick={loadAllReviews}
                  className="my-3 font-bold flex justify-center items-center gap-1 border-2 border-gray-300 rounded-lg py-3 px-4 md:w-auto cursor-pointer hover:text-red-700 hover:border-red-600 transition-all duration-200"
                >
                  See all <ArrowRight className="w-4 h-4" />
                </button>
              )}

              <div className="mt-6 rounded-xl border border-gray-300 p-4 sm:p-5 bg-white">
                <h2 className="font-bold text-xl mb-3 text-[#2c090a]">Leave a review</h2>

                {!auth.isAuthenticated ? (
                  <p className="text-gray-500">
                    <Link to="/login" className="text-[#e93c3d] hover:underline font-medium">
                      Log in
                    </Link>{' '}
                    to share your experience.
                  </p>
                ) : alreadyReviewed ? (
                  <p className="text-gray-500">You already reviewed this car. Thanks!</p>
                ) : (
                  <form onSubmit={handleReview} className="space-y-3">
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was your rental experience?"
                      className="border border-gray-400 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#e93c3d] transition-shadow"
                    />
                    <div className="text-lg font-semibold flex flex-wrap items-center gap-3">
                      <span>Rating:</span>
                      <StarRating value={rating} onChange={setRating} />
                    </div>
                    <button
                      type="submit"
                      disabled={sendingReview}
                      className="p-3 px-7 rounded-lg cursor-pointer transition-all duration-200 border border-[#513336] bg-[#513336] text-white hover:bg-white hover:text-[#513336] font-semibold disabled:opacity-60"
                    >
                      {sendingReview ? 'Sending…' : 'Send Review'}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 lg:w-96 shrink-0 mt-8 md:mt-0 relative z-10">
            <div className="md:sticky md:top-24 md:space-y-5">
              <form
                onSubmit={handleBook}
                className="flex flex-col w-full border border-gray-400 rounded-xl bg-white shadow-sm"
              >
                <div className="flex items-center justify-between border-b border-gray-400 px-6 sm:px-7 py-5">
                  <h4 className="text-gray-400 font-bold text-xl md:text-lg lg:text-xl">Price</h4>
                  <h2 className="text-3xl md:text-xl lg:text-3xl font-bold text-[#2c090a]">
                    ${car.pricePerDay}
                    <span className="text-sm text-gray-400 font-normal">/day</span>
                  </h2>
                </div>

                <div className="px-6 sm:px-7 py-5 space-y-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-600 mb-1">
                      Start date
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      min={todayISO()}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-600 mb-1">
                      End date
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      min={startDate || todayISO()}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">
                      Phone number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      placeholder="+1 555 014 2200"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] transition-shadow"
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-600 mb-1">
                      Address
                    </label>
                    <textarea
                      id="address"
                      rows="2"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      placeholder="Pickup / delivery address"
                      className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] transition-shadow resize-none"
                    />
                  </div>

                  {rentalDays > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-gray-700 pt-1 px-1 py-2 rounded-lg bg-stone-50">
                      <span>
                        {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                      </span>
                      <span className="text-[#e93c3d]">Total ${totalPrice}</span>
                    </div>
                  )}

                  {!auth.isAuthenticated ? (
                    <Link
                      to="/login"
                      className="bg-[#e93c3d] hover:bg-[#d13435] active:scale-[0.99] p-3 w-full rounded-lg text-white font-bold text-center block transition-all"
                    >
                      Log in to book
                    </Link>
                  ) : (
                    <button
                      type="submit"
                      disabled={booking}
                      className="bg-[#e93c3d] hover:bg-[#d13435] active:scale-[0.99] p-3 w-full rounded-lg text-white font-bold disabled:opacity-60 transition-all cursor-pointer"
                    >
                      {booking ? 'Booking…' : 'Book Now'}
                    </button>
                  )}
                </div>
              </form>

              <div className="mt-5 md:mt-0">
                <h3 className="font-bold text-xl my-3 text-[#2c090a]">Listed by</h3>
                <div className="rounded-xl border border-gray-300 bg-white p-4">
                  <div className="flex items-center gap-3">
                    <div className="relative shrink-0">
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e93c3d] text-lg font-bold text-white shadow-sm">
                        T
                      </span>
                      <span className="absolute -bottom-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm">
                        <BadgeCheck className="h-4 w-4 fill-emerald-500 text-white" />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-[#2c090a]">TOPCAR</h4>
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
                          <BadgeCheck className="h-3.5 w-3.5" />
                          Verified
                        </span>
                      </div>
                      <p className="mt-0.5 text-sm text-gray-500">
                        Official TOPCAR listing · Trusted fleet
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarPage
