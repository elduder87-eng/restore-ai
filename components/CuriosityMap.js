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
      { id: "Learning", type: "main", fx: 0, fy: 0 },
      { id: "Science", type: "main", fx: -500, fy: 150 },
      { id: "Psychology", type: "main", fx: 500, fy: -150 },
      { id: "Philosophy", type: "main", fx: 500, fy: 150 }
    ],
    links: [
      { source: "Learning", target: "Science" },
      { source: "Learning", target: "Psychology" },
      { source: "Learning", target: "Philosophy" }
    ]
  })

  const createRadialNodes = (parent, labels, radius = 350) => {
    return labels.map((label, i) => {

      const angle = (i / labels.length) * Math.PI * 2

      return {
        id: label,
        type: "sub",
        x: parent.x + radius * Math.cos(angle),
        y: parent.y + radius * Math.sin(angle)
      }
    })
  }

  const expandNode = (node) => {

    let labels = []

    if (node.id === "Science")
      labels = ["Physics", "Biology", "Chemistry"]

    if (node.id === "Philosophy")
      labels = ["Free Will", "Consciousness"]

    if (labels.length === 0) return

    const newNodes = createRadialNodes(node, labels)

    const newLinks = labels.map(label => ({
      source: node.id,
      target: label
    }))

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

        d3VelocityDecay={0.35}

        d3Force={(d3) => {
          d3.force("charge").strength(-1200)
          d3.force("link").distance(300)
        }}

        nodePointerAreaPaint={(node, color, ctx) => {

          const size = node.type === "main" ? 30 : 18

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)
          ctx.fill()

        }}

        nodeCanvasObject={(node, ctx, globalScale) => {

          const label = node.id
          const fontSize = 20 / globalScale
          ctx.font = `${fontSize}px Sans-Serif`

          const size = node.type === "main" ? 28 : 12

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
