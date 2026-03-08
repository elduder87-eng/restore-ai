"use client"

import { useEffect, useState } from "react"
import LoadingScreen from "../components/LoadingScreen"
import Dashboard from "./dashboard/page"

export default function Home(){

const [loading,setLoading] = useState(true)

useEffect(()=>{
setTimeout(()=>{
setLoading(false)
},2600)
},[])

if(loading){
return <LoadingScreen/>
}

return <Dashboard/>

}
