"use client"

export default function RestoreLogo(){

return(

<div className="logo-wrapper">

<svg viewBox="0 0 200 200" className="restore-logo">

{/* Outer Circle */}
<circle cx="100" cy="100" r="90" className="circle"/>

{/* Book */}
<path d="M60 110 Q100 95 140 110" className="book"/>
<path d="M60 110 Q100 125 140 110" className="book"/>

{/* Stem */}
<line x1="100" y1="110" x2="100" y2="70" className="stem"/>

{/* Leaves */}
<path d="M100 70 Q85 60 75 70 Q85 80 100 70" className="leaf left"/>
<path d="M100 70 Q115 60 125 70 Q115 80 100 70" className="leaf right"/>
<path d="M100 60 Q100 45 110 55 Q100 65 90 55 Q100 45 100 60" className="leaf top"/>

</svg>

</div>

)

}
