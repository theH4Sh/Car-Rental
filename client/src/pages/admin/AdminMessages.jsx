import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Trash2 } from 'lucide-react'
import { apiFetch } from '../../utils/api'
import ConfirmModal from '../../components/ConfirmModal'

const statusColor = {
  new: 'bg-sky-100 text-sky-800',
  read: 'bg-stone-200 text-stone-600',
  archived: 'bg-amber-100 text-amber-800',
}

const AdminMessages = () => {
  const [messages, setMessages] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [selected, setSelected] = useState(null)
  const [updating, setUpdating] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    const query = filter === 'all' ? '' : `?status=${filter}`
    apiFetch(`api/admin/messages${query}`)
      .then((data) => {
        if (cancelled) return
        setMessages(data.messages || [])
        setUnreadCount(data.unreadCount || 0)
        setSelected((prev) => {
          if (!prev) return null
          return (data.messages || []).find((m) => m._id === prev._id) || null
        })
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
  }, [filter])

  const loadMessages = () => {
    setLoading(true)
    const query = filter === 'all' ? '' : `?status=${filter}`
    apiFetch(`api/admin/messages${query}`)
      .then((data) => {
        setMessages(data.messages || [])
        setUnreadCount(data.unreadCount || 0)
        setSelected((prev) => {
          if (!prev) return null
          return (data.messages || []).find((m) => m._id === prev._id) || null
        })
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setLoading(false))
  }

  const openMessage = async (msg) => {
    setSelected(msg)
    if (msg.status !== 'new') return

    try {
      const updated = await apiFetch(`api/admin/messages/${msg._id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status: 'read' }),
      })
      setMessages((prev) => prev.map((m) => (m._id === msg._id ? updated : m)))
      setSelected(updated)
      setUnreadCount((n) => Math.max(0, n - 1))
    } catch (err) {
      toast.error(err.message)
    }
  }

  const setStatus = async (id, status) => {
    setUpdating(id)
    try {
      const updated = await apiFetch(`api/admin/messages/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      })
      setMessages((prev) => prev.map((m) => (m._id === id ? updated : m)))
      if (selected?._id === id) setSelected(updated)
      if (status === 'new') setUnreadCount((n) => n + 1)
      toast.success(`Marked as ${status}`)
      if (filter !== 'all' && filter !== status) {
        loadMessages()
      }
    } catch (err) {
      toast.error(err.message)
    } finally {
      setUpdating(null)
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await apiFetch(`api/admin/messages/${deleteTarget._id}`, { method: 'DELETE' })
      setMessages((prev) => prev.filter((m) => m._id !== deleteTarget._id))
      if (selected?._id === deleteTarget._id) setSelected(null)
      if (deleteTarget.status === 'new') setUnreadCount((n) => Math.max(0, n - 1))
      toast.success('Message deleted')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-[#2c090a]">Messages</h2>
          <p className="text-stone-500 mt-1">
            Contact form inbox
            {unreadCount > 0 && (
              <span className="ml-2 text-[#e93c3d] font-semibold">
                · {unreadCount} new
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {['all', 'new', 'read', 'archived'].map((s) => (
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

      <div className="grid lg:grid-cols-5 gap-4 min-h-[420px]">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col">
          {loading ? (
            <div className="p-6 space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-16 bg-stone-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : messages.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-stone-500 text-center">
              <Mail className="w-8 h-8 mb-2 text-stone-300" />
              <p>No messages yet.</p>
            </div>
          ) : (
            <ul className="divide-y divide-stone-100 overflow-y-auto max-h-[70vh]">
              {messages.map((msg) => {
                const active = selected?._id === msg._id
                return (
                  <li key={msg._id}>
                    <button
                      type="button"
                      onClick={() => openMessage(msg)}
                      className={`w-full text-left px-4 py-3 transition-colors ${
                        active ? 'bg-[#e93c3d]/5' : 'hover:bg-stone-50'
                      } ${msg.status === 'new' ? 'bg-sky-50/50' : ''}`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <p className={`truncate ${msg.status === 'new' ? 'font-bold text-[#2c090a]' : 'font-medium text-[#2c090a]'}`}>
                          {msg.subject}
                        </p>
                        <span className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] capitalize ${statusColor[msg.status]}`}>
                          {msg.status}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 truncate mt-0.5">{msg.name} · {msg.email}</p>
                      <p className="text-xs text-stone-400 mt-1">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="lg:col-span-3 bg-white rounded-2xl border border-stone-200/80 p-5 sm:p-6 min-h-[320px]">
          {!selected ? (
            <div className="h-full flex flex-col items-center justify-center text-stone-400 text-center py-16">
              <Mail className="w-10 h-10 mb-3" />
              <p>Select a message to read it</p>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-stone-100 pb-4">
                <div className="min-w-0">
                  <h3 className="text-xl font-semibold text-[#2c090a]">{selected.subject}</h3>
                  <p className="text-sm text-stone-500 mt-1">
                    From{' '}
                    <a href={`mailto:${selected.email}`} className="text-[#e93c3d] hover:underline">
                      {selected.name}
                    </a>{' '}
                    &lt;{selected.email}&gt;
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {new Date(selected.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(selected)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 shrink-0"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>

              <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{selected.message}</p>

              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                <span className="text-sm text-stone-500 mr-1">Mark as</span>
                {['new', 'read', 'archived'].map((status) => (
                  <button
                    key={status}
                    type="button"
                    disabled={updating === selected._id || selected.status === status}
                    onClick={() => setStatus(selected._id, status)}
                    className={`px-3 py-1.5 rounded-lg text-sm capitalize border transition-colors disabled:opacity-50 ${
                      selected.status === status
                        ? 'bg-[#2c090a] text-white border-[#2c090a]'
                        : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {status}
                  </button>
                ))}
                <a
                  href={`mailto:${selected.email}?subject=Re: ${encodeURIComponent(selected.subject)}`}
                  className="ml-auto px-3 py-1.5 rounded-lg text-sm font-medium bg-[#e93c3d] text-white hover:bg-[#d13435]"
                >
                  Reply by email
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Delete message"
        message={
          deleteTarget
            ? `Delete the message from ${deleteTarget.name}? This cannot be undone.`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Keep"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  )
}

export default AdminMessages
