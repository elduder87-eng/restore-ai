"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoadingScreen from "../components/LoadingScreen"

export default function Home(){

const router = useRouter()

useEffect(()=>{

setTimeout(()=>{

router.push("/dashboard")

},2500)

},[])

return <LoadingScreen/>

}
