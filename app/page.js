"use client"

import { useState } from "react"
import Dashboard from "../components/Dashboard"
import Universe from "../components/Universe"
import Profile from "../components/Profile"
import NavBar from "../components/NavBar"

export default function Home(){

const [view,setView] = useState("dashboard")

return(

<div>

<NavBar setView={setView}/>

{view === "dashboard" && <Dashboard/>}
{view === "universe" && <Universe/>}
{view === "profile" && <Profile/>}

</div>

)

}
