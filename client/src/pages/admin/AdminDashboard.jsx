import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Car, CalendarDays, Users, ArrowRight, Mail } from 'lucide-react'
import { apiFetch } from '../../utils/api'
import BookingCarCell from '../../components/BookingCarCell'
import toast from 'react-hot-toast'

const statusColor = {
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-emerald-100 text-emerald-800',
    canceled: 'bg-stone-200 text-stone-600',
}

const AdminDashboard = () => {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        apiFetch('api/admin/stats')
            .then(setStats)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false))
    }, [])

    if (loading) {
        return (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 rounded-2xl bg-white animate-pulse" />
                ))}
            </div>
        )
    }

    if (!stats) return null

    const cards = [
        { label: 'Cars', value: stats.cars, icon: Car, to: '/admin/cars', accent: 'bg-[#e93c3d]/10 text-[#e93c3d]' },
        { label: 'Bookings', value: stats.bookings, icon: CalendarDays, to: '/admin/bookings', accent: 'bg-[#513336]/10 text-[#513336]' },
        { label: 'Users', value: stats.users, icon: Users, to: '/admin/users', accent: 'bg-sky-100 text-sky-700' },
        {
            label: 'New messages',
            value: stats.unreadMessages ?? 0,
            icon: Mail,
            to: '/admin/messages',
            accent: 'bg-emerald-100 text-emerald-700',
        },
    ]

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold text-[#2c090a]">Dashboard</h2>
                <p className="text-stone-500 mt-1">Overview of your rental fleet and activity.</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon
                    return (
                        <Link
                            key={card.label}
                            to={card.to}
                            className="group bg-white rounded-2xl p-5 border border-stone-200/80 hover:border-[#e93c3d]/40 transition-colors"
                        >
                            <div className="flex items-start justify-between">
                                <div className={`p-2.5 rounded-xl ${card.accent}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <ArrowRight className="w-4 h-4 text-stone-300 group-hover:text-[#e93c3d] transition-colors" />
                            </div>
                            <p className="mt-4 text-3xl font-semibold text-[#2c090a]">{card.value}</p>
                            <p className="text-sm text-stone-500 mt-1">{card.label}</p>
                        </Link>
                    )
                })}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 lg:col-span-1">
                    <h3 className="font-semibold text-[#2c090a]">Booking status</h3>
                    <ul className="mt-4 space-y-3">
                        {Object.entries(stats.bookingStatus).map(([status, count]) => (
                            <li key={status} className="flex items-center justify-between text-sm">
                                <span className={`px-2.5 py-1 rounded-md capitalize ${statusColor[status]}`}>
                                    {status}
                                </span>
                                <span className="font-semibold text-[#2c090a]">{count}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-2xl border border-stone-200/80 p-5 lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-[#2c090a]">Recent bookings</h3>
                        <Link to="/admin/bookings" className="text-sm text-[#e93c3d] hover:underline">
                            View all
                        </Link>
                    </div>

                    {stats.recentBookings.length === 0 ? (
                        <p className="text-sm text-stone-500 py-8 text-center">No bookings yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-stone-500 border-b border-stone-100">
                                    <tr>
                                        <th className="pb-3 font-medium">Car</th>
                                        <th className="pb-3 font-medium">User</th>
                                        <th className="pb-3 font-medium">Dates</th>
                                        <th className="pb-3 font-medium">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-100">
                                    {stats.recentBookings.map((b) => (
                                        <tr key={b._id}>
                                            <td className="py-3">
                                                <BookingCarCell car={b.car} size="sm" />
                                            </td>
                                            <td className="py-3 text-stone-600">{b.user?.username || '—'}</td>
                                            <td className="py-3 text-stone-600 whitespace-nowrap">
                                                {new Date(b.startDate).toLocaleDateString()} –{' '}
                                                {new Date(b.endDate).toLocaleDateString()}
                                            </td>
                                            <td className="py-3">
                                                <span className={`px-2 py-1 rounded-md capitalize text-xs ${statusColor[b.status]}`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
