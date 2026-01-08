import { useEffect } from 'react'
import { X } from 'lucide-react'

const ConfirmModal = ({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}) => {
  useEffect(() => {
    if (!open) return undefined

    const onKey = (e) => {
      if (e.key === 'Escape' && !loading) onCancel?.()
    }

    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, loading, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        onClick={() => !loading && onCancel?.()}
      />

      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-desc"
        className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-stone-200"
      >
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-stone-100">
          <h3 id="confirm-modal-title" className="font-semibold text-lg text-[#2c090a]">
            {title}
          </h3>
          <button
            type="button"
            onClick={() => !loading && onCancel?.()}
            disabled={loading}
            className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-5 py-4">
          <p id="confirm-modal-desc" className="text-sm text-stone-600 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="flex gap-3 px-5 py-4 border-t border-stone-100">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 text-stone-600 font-medium hover:bg-stone-50 disabled:opacity-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium disabled:opacity-60 transition-colors ${
              danger
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-[#e93c3d] hover:bg-[#d13435]'
            }`}
          >
            {loading ? 'Please wait…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmModal
