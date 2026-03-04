"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
)

export default function CuriosityMap() {

  const [graphData, setGraphData] = useState({
    nodes: [
      { id: "Learning" },
      { id: "Science" },
      { id: "Psychology" },
      { id: "Philosophy" }
    ],
    links: [
      { source: "Learning", target: "Science" },
      { source: "Learning", target: "Psychology" },
      { source: "Learning", target: "Philosophy" }
    ]
  })

  const expandNode = (node) => {

    let newNodes = []
    let newLinks = []

    if (node.id === "Science") {

      newNodes = [
        { id: "Physics" },
        { id: "Biology" }
      ]

      newLinks = [
        { source: "Science", target: "Physics" },
        { source: "Science", target: "Biology" }
      ]

    }

    if (node.id === "Philosophy") {

      newNodes = [
        { id: "Free Will" },
        { id: "Consciousness" }
      ]

      newLinks = [
        { source: "Philosophy", target: "Free Will" },
        { source: "Philosophy", target: "Consciousness" }
      ]

    }

    // CROSS CONNECTION EXAMPLE

    if (node.id === "Physics") {

      newNodes = [
        { id: "Time" }
      ]

      newLinks = [
        { source: "Physics", target: "Time" },
        { source: "Philosophy", target: "Time" } // cross branch
      ]

    }

    if (newNodes.length === 0) return

    setGraphData(prev => ({
      nodes: [...prev.nodes, ...newNodes.filter(n => !prev.nodes.find(p => p.id === n.id))],
      links: [...prev.links, ...newLinks]
    }))
  }

  return (

    <div style={{ height: "700px", width: "100%" }}>

      <ForceGraph2D
        graphData={graphData}
        nodeAutoColorBy="id"
        nodeLabel="id"
        linkDirectionalParticles={2}
        linkDirectionalParticleSpeed={0.004}
        onNodeClick={expandNode}
      />

    </div>

  )
}
