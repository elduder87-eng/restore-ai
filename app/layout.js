"use client"

import "./globals.css"
import NavBar from "../components/NavBar"

export default function RootLayout({ children }) {

return (

<html>

<body>

<NavBar/>

{children}

</body>

</html>

)

}
