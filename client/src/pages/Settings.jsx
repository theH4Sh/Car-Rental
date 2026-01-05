import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import { KeyRound, UserRound } from 'lucide-react'
import { apiFetch } from '../utils/api'
import { updateUser } from '../authSlice'

const Settings = () => {
  const auth = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState({
    username: auth.user || '',
    email: '',
  })
  const [savingProfile, setSavingProfile] = useState(false)

  const [passwords, setPasswords] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [savingPassword, setSavingPassword] = useState(false)

  useEffect(() => {
    let cancelled = false

    apiFetch('api/users/me')
      .then((data) => {
        if (!cancelled) {
          setProfile({
            username: data.username || '',
            email: data.email || '',
          })
        }
      })
      .catch((err) => {
        if (!cancelled) toast.error(err.message)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setSavingProfile(true)

    try {
      const updated = await apiFetch('api/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          username: profile.username.trim(),
          email: profile.email.trim(),
        }),
      })

      dispatch(updateUser({ username: updated.username, role: updated.role }))

      const stored = JSON.parse(localStorage.getItem('auth') || '{}')
      localStorage.setItem(
        'auth',
        JSON.stringify({
          ...stored,
          username: updated.username,
          role: updated.role,
          isAuthenticated: true,
        })
      )

      setProfile({
        username: updated.username,
        email: updated.email,
      })
      toast.success('Profile updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingProfile(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwords.newPassword !== passwords.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setSavingPassword(true)
    try {
      await apiFetch('api/users/me/password', {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword: passwords.currentPassword,
          newPassword: passwords.newPassword,
        }),
      })
      setPasswords({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
      toast.success('Password updated')
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSavingPassword(false)
    }
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Loading settings…</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-2 md:px-4 space-y-8 pb-10">
      <div className="space-y-2">
        <p className="text-[#e93c3d] font-bold tracking-wide uppercase text-sm">Account</p>
        <h1 className="text-4xl font-bold text-[#331512]">Settings</h1>
        <p className="text-[#513336] font-medium">
          Update your profile details and password.
        </p>
      </div>

      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="w-9 h-9 rounded-xl bg-[#e93c3d]/10 text-[#e93c3d] flex items-center justify-center">
            <UserRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2c090a]">Profile</h2>
            <p className="text-sm text-stone-500">Username and email used for your account</p>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-stone-700 mb-1">
              Username
            </label>
            <input
              id="username"
              required
              minLength={3}
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-5 py-2.5 bg-[#e93c3d] hover:bg-[#d13435] text-white font-semibold rounded-lg disabled:opacity-60 transition-colors"
            >
              {savingProfile ? 'Saving…' : 'Save changes'}
            </button>
            <Link
              to={`/profile/${auth.user}`}
              className="text-sm font-medium text-[#513336] hover:text-[#e93c3d]"
            >
              View profile
            </Link>
          </div>
        </form>
      </section>

      <section className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center gap-3 px-6 py-4 border-b border-stone-100 bg-stone-50">
          <div className="w-9 h-9 rounded-xl bg-[#513336]/10 text-[#513336] flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-semibold text-[#2c090a]">Password</h2>
            <p className="text-sm text-stone-500">Choose a strong password you don’t use elsewhere</p>
          </div>
        </div>

        <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-stone-700 mb-1">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              required
              value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-1">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              required
              value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
            />
            <p className="text-xs text-stone-400 mt-1">
              At least 8 characters with upper, lower, number, and symbol.
            </p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-1">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              required
              value={passwords.confirmPassword}
              onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
              className="w-full px-4 py-2.5 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
            />
          </div>

          <button
            type="submit"
            disabled={savingPassword}
            className="px-5 py-2.5 bg-[#513336] hover:bg-[#3f282a] text-white font-semibold rounded-lg disabled:opacity-60 transition-colors"
          >
            {savingPassword ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default Settings
