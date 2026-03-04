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
      { id: "Learning", type: "main", x: 0, y: 0 },
      { id: "Science", type: "main", x: -500, y: 150 },
      { id: "Psychology", type: "main", x: 500, y: -150 },
      { id: "Philosophy", type: "main", x: 500, y: 150 }
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
        { id: "Physics", type: "sub", x: node.x - 220, y: node.y - 120 },
        { id: "Biology", type: "sub", x: node.x - 220, y: node.y + 120 },
        { id: "Chemistry", type: "sub", x: node.x - 350, y: node.y }
      ]

      newLinks = [
        { source: "Science", target: "Physics" },
        { source: "Science", target: "Biology" },
        { source: "Science", target: "Chemistry" }
      ]
    }

    if (node.id === "Philosophy") {

      newNodes = [
        { id: "Free Will", type: "sub", x: node.x + 220, y: node.y + 120 },
        { id: "Consciousness", type: "sub", x: node.x + 220, y: node.y - 120 }
      ]

      newLinks = [
        { source: "Philosophy", target: "Free Will" },
        { source: "Philosophy", target: "Consciousness" }
      ]
    }

    if (newNodes.length === 0) return

    setGraphData(prev => ({
      nodes: [
        ...prev.nodes,
        ...newNodes.filter(n => !prev.nodes.find(p => p.id === n.id))
      ],
      links: [...prev.links, ...newLinks]
    }))
  }

  return (

    <div style={{ height: "1200px", width: "100%" }}>

      <ForceGraph2D
        graphData={graphData}

        cooldownTicks={100}

        d3VelocityDecay={0.3}

        d3Force={(d3) => {
          d3.force("charge").strength(-900)
          d3.force("link").distance(260)
        }}

        nodePointerAreaPaint={(node, color, ctx) => {

          const size = node.type === "main" ? 26 : 18

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
          ctx.fill()

        }}

        nodeCanvasObject={(node, ctx, globalScale) => {

          const label = node.id
          const fontSize = 20 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`

          const size = node.type === "main" ? 18 : 10

          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)

          ctx.fillStyle =
            node.type === "main"
              ? "#2b6cb0"
              : "#38a169"

          ctx.fill()

          ctx.fillStyle = "#000"
          ctx.fillText(label, node.x + size + 6, node.y + 4)

        }}

        onNodeClick={expandNode}

      />

    </div>
  )
}
