const API = import.meta.env.VITE_API

export function getAuthHeaders(extra = {}) {
    const auth = JSON.parse(localStorage.getItem('auth') || '{}')
    return {
        ...(auth.token ? { Authorization: `Bearer ${auth.token}` } : {}),
        ...extra,
    }
}

export async function apiFetch(path, options = {}) {
    const { headers, body, ...rest } = options
    const isFormData = body instanceof FormData

    const res = await fetch(API + path, {
        ...rest,
        body,
        headers: {
            ...getAuthHeaders(isFormData ? {} : { 'Content-Type': 'application/json' }),
            ...headers,
        },
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
        throw new Error(data.error || data.message || 'Request failed')
    }

    return data
}

export function imageUrl(filename) {
    if (!filename) return ''
    if (filename.startsWith('http') || filename.startsWith('blob:')) return filename
    return API + 'images/' + filename
}

export function carImages(car) {
    if (!car) return []
    if (Array.isArray(car.images) && car.images.length) return car.images
    if (car.image) return [car.image]
    return []
}

export function carCover(car) {
    return carImages(car)[0] || ''
}

/** True when a booking's car was removed from the fleet */
export function isCarDeleted(car) {
    return !car || !car._id
}

export function bookingCarName(car, fallback = 'Car deleted') {
    if (isCarDeleted(car)) return fallback
    return car.name || fallback
}
