import { useDispatch } from "react-redux";
import { register,login,getMe,logout } from "../services/auth.api";
import { setUser,setLoading,setError } from "../auth.slice";


export function useAuth(){
    const dispatch=useDispatch()

    async function handelRegister({username,email,password}){
        try {
            dispatch(setLoading(true))
            const data=await register({username,email,password})
            return data
            
        } catch (error) {
            dispatch(setError(error.response?.data?.message  || "Registation failed"))
            return null
            
        }finally{
            dispatch(setLoading(false))
        }
    }

    async function handelLogin({email,password}){
        try {
            dispatch(setLoading(true))
            const data=await login({email,password})
            dispatch(setUser(data.user))
            
        } catch (error) {
            dispatch(setError(error.response?.data?.message  || "Login failed"))
            
        }finally{
            dispatch(setLoading(false))
        }
    }
    async function handelLogout(){
        await logout()
        dispatch(setUser(null))

    }

    async function handelGetMe(){
        try {
            const data=await getMe()
            dispatch(setUser(data.user))
        } catch (error) {
            dispatch(setError(error.response?.data?.message  || "failed to fetch user"))
            
        }finally{
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
