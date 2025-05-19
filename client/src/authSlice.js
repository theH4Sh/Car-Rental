import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    role: null,
    isAuthenticated: false,
}

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload.username
            state.token = action.payload.token
            state.role = action.payload.role
            state.isAuthenticated = true
        },
        logout: (state) => {
            state.user = null
            state.token = null
            state.role = null
            state.isAuthenticated = false
        }
    }
})

export const { login, logout } = authSlice.actions

export default authSlice.reducer