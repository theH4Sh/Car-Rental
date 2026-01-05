import { Navigate, useLocation } from 'react-router-dom'
import { useSelector } from 'react-redux'

const RequireAuth = ({ children }) => {
    const auth = useSelector((state) => state.user)
    const location = useLocation()

    if (!auth.isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />
    }

    return children
}

export default RequireAuth
