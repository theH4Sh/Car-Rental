import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useSelector } from 'react-redux'
import { apiFetch } from '../../utils/api'

const AdminUsers = () => {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [updating, setUpdating] = useState(null)
    const auth = useSelector((state) => state.user)

    useEffect(() => {
        apiFetch('api/admin/users')
            .then(setUsers)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false))
    }, [])

    const changeRole = async (user, role) => {
        if (user.username === auth.user && role !== 'admin') {
            toast.error('You cannot demote yourself')
            return
        }

        setUpdating(user._id)
        try {
            const updated = await apiFetch(`api/admin/users/${user._id}/role`, {
                method: 'PATCH',
                body: JSON.stringify({ role }),
            })
            setUsers((prev) => prev.map((u) => (u._id === user._id ? updated : u)))
            toast.success(`${updated.username} is now ${role}`)
        } catch (err) {
            toast.error(err.message)
        } finally {
            setUpdating(null)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-[#2c090a]">Users</h2>
                <p className="text-stone-500 mt-1">View accounts and manage admin access.</p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden">
                {loading ? (
                    <div className="p-8 space-y-3">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-12 bg-stone-100 rounded-lg animate-pulse" />
                        ))}
                    </div>
                ) : users.length === 0 ? (
                    <p className="text-center text-stone-500 py-12">No users found.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-stone-50 text-stone-500 border-b border-stone-100">
                                <tr>
                                    <th className="px-4 py-3 font-medium">User</th>
                                    <th className="px-4 py-3 font-medium">Email</th>
                                    <th className="px-4 py-3 font-medium">Joined</th>
                                    <th className="px-4 py-3 font-medium">Role</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100">
                                {users.map((user) => (
                                    <tr key={user._id} className="hover:bg-stone-50/60">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-full bg-[#e93c3d] text-white flex items-center justify-center font-semibold text-sm">
                                                    {user.username.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="font-medium text-[#2c090a]">
                                                    {user.username}
                                                    {user.username === auth.user && (
                                                        <span className="ml-2 text-xs text-stone-400">(you)</span>
                                                    )}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-stone-600">{user.email}</td>
                                        <td className="px-4 py-3 text-stone-600 whitespace-nowrap">
                                            {user.createdAt
                                                ? new Date(user.createdAt).toLocaleDateString()
                                                : '—'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <select
                                                value={user.role}
                                                disabled={updating === user._id}
                                                onChange={(e) => changeRole(user, e.target.value)}
                                                className="px-2 py-1.5 border border-stone-200 rounded-lg text-sm bg-white disabled:opacity-50"
                                            >
                                                <option value="user">user</option>
                                                <option value="admin">admin</option>
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

export default AdminUsers
