"use client"

import { useEffect,useState } from "react"
import LoadingScreen from "../components/LoadingScreen"

export default function Home(){

const [loading,setLoading]=useState(true)

useEffect(()=>{

setTimeout(()=>{

setLoading(false)

},2600)

},[])

if(loading){

return <LoadingScreen/>

}

return(

<div style={{padding:"40px"}}>

<h1>Welcome to Restore</h1>

<p>Your learning environment is ready.</p>

</div>

)

}
