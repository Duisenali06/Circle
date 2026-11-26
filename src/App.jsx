import Layout from "./pages/Layout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Items from "./pages/Items.jsx";
import DashboardCoffee from "./pages/DashboardCoffee.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import PwaStatus from './ui/PwaStatus.jsx'
import Offline from './pages/Offline.jsx'
import Favorites from './pages/Favorites.jsx'
import ItemDetails from './pages/ItemDetails.jsx'
import Cart from './pages/Cart.jsx'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useAuth } from './auth/AuthContext.jsx'
import { loadSelection, selectSelectionStatus } from './store/selectionSlice.js'
function App() {
  const dispatch = useDispatch()
  const { user, loading } = useAuth()
  const status = useSelector(selectSelectionStatus)
  const selectionUid = useSelector((state) => state.selection.uid)
  const uid = user?.uid || null

  useEffect(() => {
    if (!loading && (status === 'idle' || selectionUid !== uid)) dispatch(loadSelection(uid))
  }, [dispatch, loading, status, selectionUid, uid])

  useEffect(() => {
    const syncWhenOnline = () => dispatch(loadSelection(uid))
    window.addEventListener('online', syncWhenOnline)
    return () => window.removeEventListener('online', syncWhenOnline)
  }, [dispatch, uid])

  return (
    <>


        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <PwaStatus />
            <Routes>
                    <Route path="offline" element={<Offline />} />
                <Route element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path="practice/circle" element={<Home/>}/>
                    <Route path="/about" element={<About />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/items/:id" element={<ItemDetails />} />
                    <Route path="/favorites" element={<Favorites />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/dashboard" element={<DashboardCoffee />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/profile" element={<Profile />} />
                    </Route>
                    {/* <Route path="/items/:id" element={<ItemDetails />} /> */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>





    </>
  )
}

export default App
