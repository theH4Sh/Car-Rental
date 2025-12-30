import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { apiFetch, carCover, imageUrl } from '../../utils/api'

const statusColor = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    canceled: 'bg-stone-200 text-stone-600',
}

const AdminBookings = () => {
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [updating, setUpdating] = useState(null)

    const loadBookings = () => {
        setLoading(true)
        apiFetch('api/admin/bookings')
            .then(setBookings)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadBookings()
    }, [])

    const updateStatus = async (id, status) => {
        setUpdating(id)
        try {
            const updated = await apiFetch(`api/admin/bookings/${id}`, {
                method: 'PATCH',
                body: JSON.stringify({ status }),
            })
            setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)))
            toast.success(`Booking ${status}`)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setUpdating(null)
        }
    }

    const filtered =
        filter === 'all' ? bookings : bookings.filter((b) => b.status === filter)

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-[#2c090a]">Bookings</h2>
                    <p className="text-stone-500 mt-1">Review and update reservation status.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {['all', 'pending', 'confirmed', 'canceled'].map((s) => (
                        <button
                            key={s}
                            type="button"
                            onClick={() => setFilter(s)}
                            className={`px-3 py-1.5 rounded-lg text-sm capitalize transition-colors ${
                                filter === s
                                    ? 'bg-[#2c090a] text-white'
                                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
                            }`}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-stone-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : filtered.length === 0 ? (
                    <p className="text-center text-stone-500 py-12">No bookings found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-stone-50 text-stone-500 border-b border-stone-100">
                                <tr>
                                    <th className="px-4 py-3 font-medium">Car</th>
                                    <th className="px-4 py-3 font-medium">Customer</th>
                                    <th className="px-4 py-3 font-medium">Dates</th>
                                    <th className="px-4 py-3 font-medium">Status</th>
                                    <th className="px-4 py-3 font-medium">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {filtered.map((b) => (
                                    <tr key={b._id} className="hover:bg-stone-50/60">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3 min-w-[160px]">
                                                <img
                                                    src={imageUrl(carCover(b.car))}
                                                    alt=""
                                                    className="w-11 h-11 rounded-lg object-cover bg-stone-100"
                                                />
                                                <div>
                                                    <p className="font-medium text-[#2c090a]">{b.car?.name || '—'}</p>
                                                    <p className="text-xs text-stone-400">{b.car?.brand}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <p className="font-medium text-[#2c090a]">{b.user?.username || '—'}</p>
                                            <p className="text-xs text-stone-400">{b.user?.email}</p>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                                            {new Date(b.startDate).toLocaleDateString()} –{' '}
                                            {new Date(b.endDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2.5 py-1 rounded-md capitalize text-xs ${statusColor[b.status]}`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={b.status}
                                                disabled={updating === b._id}
                                                onChange={(e) => updateStatus(b._id, e.target.value)}
                                                className="px-2 py-1.5 border border-stone-200 rounded-lg text-sm bg-white disabled:opacity-50"
                                            >
                                                <option value="pending">pending</option>
                                                <option value="confirmed">confirmed</option>
                                                <option value="canceled">canceled</option>
                                            </select>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminBookings
