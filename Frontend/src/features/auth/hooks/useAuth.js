import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../services/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";

export function useAuth() {
    const dispatch = useDispatch()

    async function handelRegister({ username, email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await register({ username, email, password })
            return data
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Registration failed"
            dispatch(setError(errorMsg))
            return { success: false, message: errorMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handelLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            dispatch(setError(null))
            const data = await login({ email, password })
            if (data?.user) {
                dispatch(setUser(data.user))
            }
            return data
        } catch (error) {
            const errorMsg =
                error.response?.data?.message ||
                error.response?.data?.errors?.[0]?.msg ||
                "Invalid credentials"
            dispatch(setError(errorMsg))
            return { success: false, message: errorMsg }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handelLogout() {
        await logout()
        dispatch(setUser(null))
    }

    async function handelGetMe() {
        try {
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Failed to fetch user"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handelRegister,
        handelLogin,
        handelGetMe,
        handelLogout
    }
}
