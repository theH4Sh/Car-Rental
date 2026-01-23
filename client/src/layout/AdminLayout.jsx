import { NavLink, Outlet, Link } from 'react-router-dom'
import {
    LayoutDashboard,
    Car,
    CalendarDays,
    Users,
    Mail,
    ArrowLeft,
    Menu,
    X,
} from 'lucide-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'

const links = [
    { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/cars', label: 'Cars', icon: Car },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
    { to: '/admin/messages', label: 'Messages', icon: Mail },
    { to: '/admin/users', label: 'Users', icon: Users },
]

const AdminLayout = () => {
    const [open, setOpen] = useState(false)
    const auth = useSelector((state) => state.user)

    const navClass = ({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
            isActive
                ? 'bg-[#e93c3d] text-white'
                : 'text-stone-300 hover:bg-white/10 hover:text-white'
        }`

    return (
        <div className="min-h-screen bg-[#f6f3f0] flex">
            {/* Mobile overlay */}
            {open && (
                <button
                    type="button"
                    aria-label="Close sidebar"
                    className="fixed inset-0 bg-black/40 z-30 lg:hidden"
                    onClick={() => setOpen(false)}
                />
            )}

            <aside
                className={`fixed lg:sticky top-0 left-0 z-40 h-screen w-64 bg-[#2c090a] text-white flex flex-col transition-transform duration-300 ${
                    open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                }`}
            >
                <div className="px-5 py-6 border-b border-white/10 flex items-center justify-between">
                    <div>
                        <p className="text-xs tracking-[0.2em] uppercase text-stone-400">TOPCAR</p>
                        <h1 className="text-xl font-semibold mt-1">Admin</h1>
                    </div>
                    <button
                        type="button"
                        className="lg:hidden p-1 rounded hover:bg-white/10"
                        onClick={() => setOpen(false)}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1">
                    {links.map((link) => {
                        const Icon = link.icon
                        return (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.end}
                                className={navClass}
                                onClick={() => setOpen(false)}
                            >
                                <Icon className="w-4 h-4" />
                                {link.label}
                            </NavLink>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-white/10 space-y-3">
                    <p className="text-sm text-stone-400 px-2">
                        Signed in as <span className="text-white font-medium">{auth.user}</span>
                    </p>
                    <Link
                        to="/"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm text-stone-300 hover:bg-white/10 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to site
                    </Link>
                </div>
            </aside>

            <div className="flex-1 min-w-0 flex flex-col">
                <header className="sticky top-0 z-20 bg-[#f6f3f0]/95 backdrop-blur border-b border-stone-200 px-4 sm:px-6 py-4 flex items-center gap-3">
                    <button
                        type="button"
                        className="lg:hidden p-2 rounded-lg hover:bg-stone-200"
                        onClick={() => setOpen(true)}
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    <div>
                        <p className="text-xs uppercase tracking-wider text-stone-500">Management</p>
                        <p className="font-semibold text-[#2c090a]">Car Rental Control</p>
                    </div>
                </header>

                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}

export default AdminLayout
