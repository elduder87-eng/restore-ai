"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then((mod) => mod.ForceGraph2D),
  { ssr: false }
)

export default function CuriosityMap() {

  const [data] = useState({
    nodes: [
      { id: "Science" },
      { id: "Philosophy" },
      { id: "Psychology" },
      { id: "Learning" },
      { id: "Astrophysics" },
      { id: "Free Will" }
    ],
    links: [
      { source: "Science", target: "Astrophysics" },
      { source: "Philosophy", target: "Free Will" },
      { source: "Learning", target: "Science" },
      { source: "Learning", target: "Psychology" }
    ]
  })

  return (
    <div style={{ height: "500px", border: "1px solid #eee", marginTop: "20px" }}>
      <ForceGraph2D
        graphData={data}
        nodeLabel="id"
        nodeAutoColorBy="id"
        linkDirectionalParticles={2}
      />
    </div>
  )
}
