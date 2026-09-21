import { RouterProvider } from 'react-router'
import router from './app.routes'
import { useEffect } from 'react'
import {useAuth} from '../features/auth/hooks/useAuth'



const App = () => {
const auth=useAuth()
  useEffect(()=>{
auth.handelGetMe()
},[])
  return <RouterProvider router={router} />
}

export default App
