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
  Gauge,
  MapPin,
} from 'lucide-react'
import { apiFetch } from '../utils/api'
import CarGallery from '../components/CarGallery'

const StarRating = ({ value, onChange, size = 'text-xl' }) => (
  <div className={`flex gap-1 ${size}`}>
    {[1, 2, 3, 4, 5].map((n) => (
      <button
        key={n}
        type="button"
        onClick={() => onChange?.(n)}
        disabled={!onChange}
        className={`${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'} transition-transform`}
        aria-label={`${n} star${n > 1 ? 's' : ''}`}
      >
        <span className={n <= value ? 'text-yellow-500' : 'text-gray-300'}>★</span>
      </button>
    ))}
  </div>
)

const daysBetween = (start, end) => {
  const s = new Date(start)
  const e = new Date(end)
  const ms = e.setHours(0, 0, 0, 0) - s.setHours(0, 0, 0, 0)
  return Math.max(0, Math.round(ms / (1000 * 60 * 60 * 24)))
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

  const rentalDays = startDate && endDate ? daysBetween(startDate, endDate) : 0
  const totalPrice = car && rentalDays > 0 ? rentalDays * car.pricePerDay : 0

  const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)
  const alreadyReviewed = auth.isAuthenticated && reviews.some(
    (r) => r.user?.username === auth.user || r.user?._id === auth.user
  )

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

    if (rentalDays < 1) {
      toast.error('End date must be after start date')
      return
    }

    setBooking(true)
    try {
      await apiFetch('api/booking/', {
        method: 'POST',
        body: JSON.stringify({ carId: id, startDate, endDate }),
      })
      toast.success('Booking confirmed!')
      setStartDate('')
      setEndDate('')
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

  if (loading) return <p className="text-center py-20">Loading...</p>
  if (error) return <p className="text-center text-red-500 py-20">{error.message}</p>
  if (!car) return <p className="text-center py-20">Car not found</p>

  return (
    <div className="min-h-screen max-w-5xl mx-auto md:px-4">
      <CarGallery mainImage={car.image} images={[]} carName={car.name} />

      <div className="my-5">
        <h1 className="font-bold text-3xl uppercase">{car.name}</h1>
        <div>
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

        <div className="my-5 flex space-x-2 font-bold text-gray-700">
          <MapPin />
          <h4>{car.brand}</h4>
        </div>

        <div className="md:flex md:items-start md:gap-10">
          <div className="flex-1 min-w-0">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <img className="w-8 h-8 ml-3" src="/carseat.png" alt="car seat" />
                <div className="leading-tight">
                  <span className="text-gray-500">Brand</span>
                  <h6 className="font-semibold text-base">{car.brand}</h6>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <Cog className="ml-4" />
                <div className="leading-tight">
                  <span className="text-gray-500">Price</span>
                  <h6 className="font-semibold text-base">${car.pricePerDay}/day</h6>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <Fuel className="ml-4" />
                <div className="leading-tight">
                  <span className="text-gray-500">Fuel</span>
                  <h6 className="font-semibold text-base">Petrol</h6>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <CarFront className="ml-4" />
                <div className="leading-tight">
                  <span className="text-gray-500">Model</span>
                  <h6 className="font-semibold text-base">{car.name}</h6>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <Car className="ml-4" />
                <div className="leading-tight">
                  <span className="text-gray-500">Type</span>
                  <h6 className="font-semibold text-base">Rental</h6>
                </div>
              </div>

              <div className="flex items-center gap-3 border border-gray-300 rounded-lg py-2">
                <Gauge className="ml-4" />
                <div className="leading-tight">
                  <span className="text-gray-500">Status</span>
                  <h6 className="font-semibold text-base">Available</h6>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold mb-2">Description</h2>
              <p className="text-gray-500">{car.description}</p>
            </div>

            <div className="pt-8">
              <h2 className="text-xl font-bold">
                Customer Reviews{' '}
                <span className="text-gray-400">
                  ({reviews.length} review{reviews.length !== 1 ? 's' : ''})
                </span>
              </h2>

              {reviews.length === 0 ? (
                <p className="text-gray-500 my-5">Be the first to review this car.</p>
              ) : (
                displayedReviews.map((review) => (
                  <div key={review._id} className="border border-gray-300 rounded-lg my-5">
                    <div className="flex items-center justify-between border-gray-300 border-b p-5">
                      <div className="flex items-center gap-2">
                        <CircleUser />
                        <div className="font-bold">
                          {review.user?.username || 'User'}
                          <StarRating value={review.rating} size="text-base" />
                        </div>
                      </div>
                      <div className="flex text-gray-400 gap-2 font-bold text-sm">
                        <CalendarDays className="w-4 h-4" />
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : ''}
                      </div>
                    </div>
                    <p className="text-gray-500 p-5">{review.comment}</p>
                  </div>
                ))
              )}

              {reviews.length > 3 && !showAllReviews && (
                <button
                  type="button"
                  onClick={loadAllReviews}
                  className="my-3 font-bold flex justify-center items-center gap-1 border-2 border-gray-300 rounded-lg py-4 px-3 md:w-1/4 cursor-pointer hover:text-red-700 hover:border-red-600 transition-all duration-200"
                >
                  See all <ArrowRight />
                </button>
              )}

              <div className="mt-6">
                <h2 className="font-bold text-xl mt-5 mb-3">Leave a review</h2>

                {!auth.isAuthenticated ? (
                  <p className="text-gray-500 mb-4">
                    <Link to="/login" className="text-[#e93c3d] hover:underline font-medium">
                      Log in
                    </Link>{' '}
                    to share your experience.
                  </p>
                ) : alreadyReviewed ? (
                  <p className="text-gray-500 mb-4">You already reviewed this car. Thanks!</p>
                ) : (
                  <form onSubmit={handleReview} className="space-y-3">
                    <textarea
                      rows="4"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="How was your rental experience?"
                      className="border border-gray-400 rounded-lg p-3 w-full focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                    />
                    <div className="text-lg font-semibold flex items-center gap-3 my-3">
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

          <div className="w-full md:w-80 lg:w-96 shrink-0 mt-8 md:mt-0">
            <form
              onSubmit={handleBook}
              className="flex flex-col w-full border border-gray-400 rounded-xl sticky top-24"
            >
              <div className="flex items-center justify-between border-b border-gray-400 px-7 py-5">
                <h4 className="text-gray-400 font-bold text-xl md:text-lg lg:text-xl">Price</h4>
                <h2 className="text-3xl md:text-xl lg:text-3xl font-bold">
                  ${car.pricePerDay}
                  <span className="text-sm text-gray-400 font-normal">/day</span>
                </h2>
              </div>

              <div className="px-7 py-5 space-y-4">
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                  />
                </div>

                {rentalDays > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-gray-700 pt-1">
                    <span>
                      {rentalDays} day{rentalDays !== 1 ? 's' : ''}
                    </span>
                    <span>Total ${totalPrice}</span>
                  </div>
                )}

                {!auth.isAuthenticated ? (
                  <Link
                    to="/login"
                    className="bg-[#e93c3d] hover:bg-[#d13435] p-3 w-full rounded-lg text-white font-bold text-center block transition-colors"
                  >
                    Log in to book
                  </Link>
                ) : (
                  <button
                    type="submit"
                    disabled={booking}
                    className="bg-[#e93c3d] hover:bg-[#d13435] p-3 w-full rounded-lg text-white font-bold disabled:opacity-60 transition-colors"
                  >
                    {booking ? 'Booking…' : 'Book Now'}
                  </button>
                )}
              </div>
            </form>

            <div className="my-5">
              <h3 className="font-bold text-xl my-3">Listed by</h3>
              <div className="px-5 rounded-lg border py-5 border-gray-400 flex items-center gap-2">
                <span className="text-white font-semibold rounded-full bg-[#e93c3d] w-10 h-10 flex justify-center items-center">
                  T
                </span>
                <div>
                  <h4 className="font-bold">TOPCAR</h4>
                  <span className="inline-flex items-center gap-1 text-sm bg-green-500 text-white rounded-2xl px-2 py-0.5">
                    <BadgeCheck className="w-3.5 h-3.5" /> Verified
                  </span>
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
