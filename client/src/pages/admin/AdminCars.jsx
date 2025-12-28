import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, X } from 'lucide-react'
import toast from 'react-hot-toast'
import { apiFetch, imageUrl } from '../../utils/api'

const FUEL_TYPES = ['petrol', 'diesel', 'electric', 'hybrid']

const emptyForm = {
    name: '',
    brand: '',
    pricePerDay: '',
    description: '',
    seats: '',
    location: '',
    fuelType: 'petrol',
}

const AdminCars = () => {
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [modalOpen, setModalOpen] = useState(false)
    const [editing, setEditing] = useState(null)
    const [form, setForm] = useState(emptyForm)
    const [image, setImage] = useState(null)
    const [preview, setPreview] = useState('')
    const [saving, setSaving] = useState(false)

    const loadCars = () => {
        setLoading(true)
        apiFetch('api/car')
            .then(setCars)
            .catch((err) => toast.error(err.message))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        loadCars()
    }, [])

    const openCreate = () => {
        setEditing(null)
        setForm(emptyForm)
        setImage(null)
        setPreview('')
        setModalOpen(true)
    }

    const openEdit = (car) => {
        setEditing(car)
        setForm({
            name: car.name,
            brand: car.brand,
            pricePerDay: String(car.pricePerDay),
            description: car.description,
            seats: car.seats != null ? String(car.seats) : '',
            location: car.location || '',
            fuelType: car.fuelType || 'petrol',
        })
        setImage(null)
        setPreview(imageUrl(car.image))
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setEditing(null)
        setForm(emptyForm)
        setImage(null)
        setPreview('')
    }

    const handleImageChange = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        setImage(file)
        setPreview(URL.createObjectURL(file))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const body = new FormData()
            body.append('name', form.name)
            body.append('brand', form.brand)
            body.append('pricePerDay', form.pricePerDay)
            body.append('description', form.description)
            body.append('seats', form.seats)
            body.append('location', form.location)
            body.append('fuelType', form.fuelType)
            if (image) body.append('carImage', image)

            if (editing) {
                await apiFetch(`api/car/${editing._id}`, { method: 'PUT', body })
                toast.success('Car updated')
            } else {
                if (!image) {
                    toast.error('Car image is required')
                    setSaving(false)
                    return
                }
                await apiFetch('api/car', { method: 'POST', body })
                toast.success('Car created')
            }

            closeModal()
            loadCars()
        } catch (err) {
            toast.error(err.message)
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (car) => {
        if (!confirm(`Delete "${car.name}"? This cannot be undone.`)) return

        try {
            await apiFetch(`api/car/${car._id}`, { method: 'DELETE' })
            toast.success('Car deleted')
            setCars((prev) => prev.filter((c) => c._id !== car._id))
        } catch (err) {
            toast.error(err.message)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-semibold text-[#2c090a]">Cars</h2>
                    <p className="text-stone-500 mt-1">Manage your rental fleet.</p>
                </div>
                <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#e93c3d] hover:bg-[#d13435] text-white rounded-lg font-medium transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add car
                </button>
            </div>

            {loading ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-64 rounded-2xl bg-white animate-pulse" />
                    ))}
                </div>
            ) : cars.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center">
                    <p className="text-stone-500">No cars yet. Add your first vehicle.</p>
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {cars.map((car) => (
                        <article
                            key={car._id}
                            className="bg-white rounded-2xl border border-stone-200/80 overflow-hidden flex flex-col"
                        >
                            <img
                                src={imageUrl(car.image)}
                                alt={car.name}
                                className="h-40 w-full object-cover bg-stone-100"
                            />
                            <div className="p-4 flex-1 flex flex-col">
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <p className="text-xs uppercase tracking-wider text-stone-400">{car.brand}</p>
                                        <h3 className="font-semibold text-[#2c090a]">{car.name}</h3>
                                    </div>
                                    <p className="text-[#e93c3d] font-semibold whitespace-nowrap">
                                        ${car.pricePerDay}
                                        <span className="text-stone-400 font-normal text-xs">/day</span>
                                    </p>
                                </div>
                                <p className="text-sm text-stone-500 mt-2 line-clamp-2">{car.description}</p>
                                <div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-stone-600">
                                    {car.location && (
                                        <span className="px-2 py-1 rounded-md bg-stone-100">{car.location}</span>
                                    )}
                                    {car.seats != null && (
                                        <span className="px-2 py-1 rounded-md bg-stone-100">{car.seats} seats</span>
                                    )}
                                    {car.fuelType && (
                                        <span className="px-2 py-1 rounded-md bg-stone-100 capitalize">{car.fuelType}</span>
                                    )}
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button
                                        type="button"
                                        onClick={() => openEdit(car)}
                                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-stone-200 text-sm hover:bg-stone-50 transition-colors"
                                    >
                                        <Pencil className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(car)}
                                        className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-red-200 text-red-600 text-sm hover:bg-red-50 transition-colors"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <button
                        type="button"
                        className="absolute inset-0 bg-black/40"
                        aria-label="Close"
                        onClick={closeModal}
                    />
                    <div className="relative bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-xl">
                        <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                            <h3 className="font-semibold text-[#2c090a]">
                                {editing ? 'Edit car' : 'Add car'}
                            </h3>
                            <button type="button" onClick={closeModal} className="p-1 rounded hover:bg-stone-100">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4">
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Name</label>
                                    <input
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Brand</label>
                                    <input
                                        required
                                        value={form.brand}
                                        onChange={(e) => setForm({ ...form, brand: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Price per day ($)</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        value={form.pricePerDay}
                                        onChange={(e) => setForm({ ...form, pricePerDay: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Seats</label>
                                    <input
                                        required
                                        type="number"
                                        min="1"
                                        max="20"
                                        value={form.seats}
                                        onChange={(e) => setForm({ ...form, seats: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                                    />
                                </div>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Location</label>
                                    <input
                                        required
                                        value={form.location}
                                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                                        placeholder="e.g. Tokyo"
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-700 mb-1">Fuel type</label>
                                    <select
                                        required
                                        value={form.fuelType}
                                        onChange={(e) => setForm({ ...form, fuelType: e.target.value })}
                                        className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] bg-white capitalize"
                                    >
                                        {FUEL_TYPES.map((type) => (
                                            <option key={type} value={type} className="capitalize">
                                                {type.charAt(0).toUpperCase() + type.slice(1)}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">Description</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#e93c3d] resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-stone-700 mb-1">
                                    Image {editing ? '(optional)' : ''}
                                </label>
                                <input
                                    type="file"
                                    accept="image/png,image/jpeg"
                                    onChange={handleImageChange}
                                    className="w-full text-sm file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-stone-100 file:text-stone-700 hover:file:bg-stone-200"
                                />
                                {preview && (
                                    <img
                                        src={preview}
                                        alt="Preview"
                                        className="mt-3 h-32 w-full object-cover rounded-lg bg-stone-100"
                                    />
                                )}
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="flex-1 px-4 py-2.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 px-4 py-2.5 rounded-lg bg-[#e93c3d] hover:bg-[#d13435] text-white font-medium disabled:opacity-60"
                                >
                                    {saving ? 'Saving…' : editing ? 'Save changes' : 'Create car'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminCars
