import Layout from "./pages/Layout.jsx";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/Login.jsx";
import Items from "./pages/Items.jsx";
import DashboardCoffee from "./pages/DashboardCoffee.jsx";
function App() {


  return (
    <>


        <BrowserRouter basename={import.meta.env.BASE_URL}>
            <Routes>
                <Route element={<Layout />}>
                    <Route index element={<Home/>}/>
                    <Route path="practice/circle" element={<Home/>}/>
                    <Route path="/about" element={<About />} />
                    <Route path="/items" element={<Items />} />
                    <Route path="/dashboard" element={<DashboardCoffee />} />
                    <Route path="/login" element={<Login />} />
                    {/* <Route path="/items/:id" element={<ItemDetails />} /> */}
                    {/* <Route path="*" element={<NotFound />} /> */}
                </Route>
            </Routes>
        </BrowserRouter>





    </>
  )
}

export default App
