import { Calendar, Mail, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { apiFetch, carCover, imageUrl } from '../utils/api'
import ConfirmModal from '../components/ConfirmModal'

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  canceled: 'bg-stone-200 text-stone-600',
}

const Profile = () => {
  const { username } = useParams()
  const auth = useSelector((state) => state.user)
  const isOwnProfile =
    auth.isAuthenticated &&
    auth.user &&
    username &&
    auth.user.toLowerCase() === username.toLowerCase()

  const [user, setUser] = useState(
    isOwnProfile
      ? { username: auth.user, role: auth.role, email: '' }
      : null
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError] = useState(null)
  const [canceling, setCanceling] = useState(null)
  const [cancelTarget, setCancelTarget] = useState(null)

  useEffect(() => {
    let cancelled = false

    const loadUser = async () => {
      setLoading(true)
      setError(null)

      // Own profile: show auth info immediately, then enrich from API
      if (
        auth.isAuthenticated &&
        auth.user &&
        username &&
        auth.user.toLowerCase() === username.toLowerCase()
      ) {
        setUser((prev) => prev || { username: auth.user, role: auth.role, email: '' })
      }

      try {
        const endpoint =
          auth.isAuthenticated &&
          auth.user &&
          username &&
          auth.user.toLowerCase() === username.toLowerCase()
            ? 'api/users/me'
            : `api/users/${encodeURIComponent(username)}`

        const data = await apiFetch(endpoint)
        if (!cancelled) setUser(data)
      } catch (err) {
        if (!cancelled) {
          // Keep local auth fallback for own profile instead of blanking the page
          const own =
            auth.isAuthenticated &&
            auth.user &&
            username &&
            auth.user.toLowerCase() === username.toLowerCase()

          if (own) {
            setUser({ username: auth.user, role: auth.role, email: '' })
          } else {
            setUser(null)
            setError(err.message || 'User not found')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (username) loadUser()
    return () => {
      cancelled = true
    }
  }, [username, auth.isAuthenticated, auth.user, auth.role])

  useEffect(() => {
    if (!isOwnProfile) {
      setBookings([])
      setBookingsError(null)
      return
    }

    let cancelled = false
    setBookingsLoading(true)
    setBookingsError(null)

    apiFetch('api/booking/')
      .then((data) => {
        if (!cancelled) setBookings(Array.isArray(data) ? data : [])
      })
      .catch((err) => {
        if (!cancelled) {
          setBookings([])
          setBookingsError(err.message || 'Could not load bookings')
          toast.error(err.message || 'Could not load bookings')
        }
      })
      .finally(() => {
        if (!cancelled) setBookingsLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [isOwnProfile])

  const cancelBooking = async () => {
    if (!cancelTarget) return
    setCanceling(cancelTarget._id)
    try {
      await apiFetch(`api/booking/${cancelTarget._id}`, { method: 'DELETE' })
      setBookings((prev) =>
        prev.map((b) => (b._id === cancelTarget._id ? { ...b, status: 'canceled' } : b))
      )
      toast.success('Booking canceled')
      setCancelTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCanceling(null)
    }
  }

  if (loading && !user) {
    return <div className="text-center py-20 text-gray-500">Loading profile…</div>
  }

  if (error || !user?.username) {
    return (
      <div className="text-center py-20 space-y-3">
        <p className="text-gray-500">{error || 'User not found'}</p>
        <Link to="/" className="text-[#e93c3d] hover:underline font-medium inline-block">
          Back to home
        </Link>
      </div>
    )
  }

  return (
    <div className="md:mx-5 lg:mx-auto min-h-screen lg:max-w-5xl md:py-8 md:px-4 space-y-8">
      <div className="shadow-sm rounded-lg overflow-hidden bg-white border border-gray-200">
        <div className="flex items-center space-x-4 bg-gray-50 p-6 border-b border-gray-300">
          <div className="text-white font-semibold rounded-full bg-[#e93c3d] w-16 h-16 flex justify-center items-center text-2xl shrink-0">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-2xl text-[#2c090a]">{user.username}</h1>
            <p className="text-gray-600">Personal details and account information</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 text-sm text-gray-700">
          <DetailRow icon={<User className="w-4 h-4" />} label="Username" value={user.username} />
          <DetailRow
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={user.email || (isOwnProfile ? '—' : 'Hidden')}
          />
          <DetailRow
            icon={<MapPin className="w-4 h-4" />}
            label="Role"
            value={user.role || 'user'}
          />
          <DetailRow
            icon={<Calendar className="w-4 h-4" />}
            label="Member since"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : '—'
            }
          />
        </div>
      </div>

      {isOwnProfile && (
        <div className="shadow-sm rounded-lg overflow-hidden bg-white border border-gray-200">
          <div className="bg-gray-50 p-6 border-b border-gray-300 flex items-center justify-between gap-3">
            <div>
              <h2 className="font-bold text-xl text-[#2c090a]">My bookings</h2>
              <p className="text-gray-600 text-sm mt-1">Reservations you’ve made</p>
            </div>
            {!bookingsLoading && !bookingsError && (
              <span className="text-sm font-semibold text-stone-500">
                {bookings.length}
              </span>
            )}
          </div>

          {bookingsLoading ? (
            <p className="p-6 text-gray-500">Loading bookings…</p>
          ) : bookingsError ? (
            <div className="p-6 text-center text-red-600 space-y-2">
              <p>{bookingsError}</p>
              <p className="text-sm text-gray-500">Try logging out and back in, then refresh.</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p className="font-medium text-[#2c090a]">You haven’t booked a car yet</p>
              <p className="text-sm mt-1">Pick a car and choose your dates to get started.</p>
              <Link
                to="/rent"
                className="text-[#e93c3d] hover:underline font-medium mt-3 inline-block"
              >
                Browse cars
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-4 justify-between"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <img
                      src={imageUrl(carCover(b.car))}
                      alt={b.car?.name || 'Car'}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      {b.car?._id ? (
                        <Link
                          to={`/details/${b.car._id}`}
                          className="font-semibold text-[#2c090a] hover:text-[#e93c3d] truncate block"
                        >
                          {b.car?.name || 'Car'}
                        </Link>
                      ) : (
                        <p className="font-semibold text-[#2c090a]">
                          {b.car?.name || 'Car unavailable'}
                        </p>
                      )}
                      <p className="text-sm text-gray-500">
                        {new Date(b.startDate).toLocaleDateString()} –{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                      </p>
                      {(b.phone || b.address) && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                          {[b.phone, b.address].filter(Boolean).join(' · ')}
                        </p>
                      )}
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs capitalize ${statusColor[b.status] || statusColor.pending}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {(b.status === 'confirmed' || b.status === 'pending') && (
                    <button
                      type="button"
                      disabled={canceling === b._id}
                      onClick={() => setCancelTarget(b)}
                      className="px-4 py-2 text-sm rounded-lg border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-60 shrink-0"
                    >
                      {canceling === b._id ? 'Canceling…' : 'Cancel'}
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <ConfirmModal
        open={Boolean(cancelTarget)}
        title="Cancel booking"
        message={
          cancelTarget
            ? `Cancel your booking for ${cancelTarget.car?.name || 'this car'}? You can book again later if needed.`
            : ''
        }
        confirmLabel="Cancel booking"
        cancelLabel="Keep booking"
        danger
        loading={Boolean(canceling)}
        onConfirm={cancelBooking}
        onCancel={() => !canceling && setCancelTarget(null)}
      />
    </div>
  )
}

const DetailRow = ({ icon, label, value }) => (
  <div className="even:bg-gray-50 flex flex-col md:flex-row md:items-start md:space-x-10 px-6 py-4">
    <div className="flex items-center space-x-2 w-40 text-gray-600 font-medium">
      {icon}
      <span>{label}</span>
    </div>
    <p className="whitespace-pre-line">{value}</p>
  </div>
)

export default Profile
