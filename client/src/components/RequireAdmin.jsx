import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAdmin = ({ children }) => {
    const auth = useSelector((state) => state.user)
    const location = useLocation()

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    if (auth.role !== 'admin') {
        return <Navigate to="/" replace />
    }

    return children
}

export default RequireAdmin
