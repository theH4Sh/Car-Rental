import { Calendar, Mail, MapPin, User } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { useFetch } from '../hooks/useFetch'
import { apiFetch, imageUrl } from '../utils/api'

const statusColor = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  canceled: 'bg-stone-200 text-stone-600',
}

const Profile = () => {
  const { username } = useParams()
  const auth = useSelector((state) => state.user)
  const { data: user, isLoading } = useFetch(`api/${username}`)
  const isOwnProfile = auth.isAuthenticated && auth.user === username

  const [bookings, setBookings] = useState([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [canceling, setCanceling] = useState(null)

  useEffect(() => {
    if (!isOwnProfile) return

    setBookingsLoading(true)
    apiFetch('api/booking/')
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setBookingsLoading(false))
  }, [isOwnProfile])

  const cancelBooking = async (id) => {
    if (!confirm('Cancel this booking?')) return
    setCanceling(id)
    try {
      await apiFetch(`api/booking/${id}`, { method: 'DELETE' })
      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: 'canceled' } : b))
      )
      toast.success('Booking canceled')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setCanceling(null)
    }
  }

  if (isLoading) return <div className="text-center py-20">Loading...</div>
  if (!user?.username) return <div className="text-center py-20">User not found</div>

  return (
    <div className="md:mx-5 lg:mx-auto min-h-screen lg:max-w-5xl md:py-8 md:px-4 space-y-8">
      <div className="shadow-sm rounded-lg overflow-hidden bg-white">
        <div className="flex items-center space-x-4 bg-gray-50 p-6 border-b border-gray-300">
          <div className="text-white font-semibold rounded-full bg-[#e93c3d] w-16 h-16 flex justify-center items-center text-2xl">
            {user.username.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="font-bold text-2xl">{user.username}</h1>
            <p className="text-gray-600">Personal details and account information</p>
          </div>
        </div>

        <div className="divide-y divide-gray-200 text-sm text-gray-700">
          <DetailRow icon={<User className="w-4 h-4" />} label="Username" value={user.username} />
          <DetailRow icon={<Mail className="w-4 h-4" />} label="Email" value={user.email || '—'} />
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
        <div className="shadow-sm rounded-lg overflow-hidden bg-white">
          <div className="bg-gray-50 p-6 border-b border-gray-300">
            <h2 className="font-bold text-xl">My bookings</h2>
            <p className="text-gray-600 text-sm mt-1">Reservations you’ve made</p>
          </div>

          {bookingsLoading ? (
            <p className="p-6 text-gray-500">Loading bookings...</p>
          ) : bookings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <p>No bookings yet.</p>
              <Link to="/" className="text-[#e93c3d] hover:underline font-medium mt-2 inline-block">
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
                      src={imageUrl(b.car?.image)}
                      alt={b.car?.name || 'Car'}
                      className="w-16 h-16 rounded-lg object-cover bg-gray-100 shrink-0"
                    />
                    <div className="min-w-0">
                      <Link
                        to={`/details/${b.car?._id}`}
                        className="font-semibold text-[#2c090a] hover:text-[#e93c3d] truncate block"
                      >
                        {b.car?.name || 'Car'}
                      </Link>
                      <p className="text-sm text-gray-500">
                        {new Date(b.startDate).toLocaleDateString()} –{' '}
                        {new Date(b.endDate).toLocaleDateString()}
                      </p>
                      <span
                        className={`inline-block mt-1 px-2 py-0.5 rounded-md text-xs capitalize ${statusColor[b.status]}`}
                      >
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {b.status === 'confirmed' && (
                    <button
                      type="button"
                      disabled={canceling === b._id}
                      onClick={() => cancelBooking(b._id)}
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
    </div>
  )
}

const DetailRow = ({ icon, label, value }) => (
  <div className="even:bg-gray-50 flex flex-col md:flex-row md:items-start md:space-x-10 px-6 py-4">
    <div className="flex items-center space-x-2 w-40 text-gray-600 font-medium">
      {icon}
      <span>{label}</span>
    </div>
    <p className="whitespace-pre-line capitalize">{value}</p>
  </div>
)

export default Profile
