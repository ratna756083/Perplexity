import { useDispatch } from "react-redux";
import { register,login,getMe } from "../services/auth.api";
import { setUser,setLoading,setError } from "../auth.slice";


export function useAuth(){
    const dispatch=useDispatch()

    async function handelRegister({username,email,password}){
        try {
            dispatch(setLoading(true))
            const data=await register({username,email,password})
            
        } catch (error) {
            dispatch(setError(error.response?.data?.message  || "Registation failed"))
            
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
        handelGetMe
    }
}

