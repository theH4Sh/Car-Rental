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
    if (filename.startsWith('http')) return filename
    return API + 'images/' + filename
}
