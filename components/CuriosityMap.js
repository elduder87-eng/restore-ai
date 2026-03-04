"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
)

export default function CuriosityMap() {

  const [graphData, setGraphData] = useState(null)

  useEffect(() => {

    setGraphData({
      nodes: [
        { id: "Science" },
        { id: "Philosophy" },
        { id: "Learning" },
        { id: "Psychology" },
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

  }, [])

  if (!graphData) return <p>Loading curiosity map...</p>

  return (
    <div style={{ height: "500px", width: "100%", marginTop: "20px" }}>
      <ForceGraph2D
        graphData={graphData}
        nodeLabel="id"
        nodeAutoColorBy="id"
      />
    </div>
  )
}
