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

      { id: "Science", type: "main", x: -650, y: 60 },

      { id: "Psychology", type: "main", x: 0, y: -450 },

      { id: "Philosophy", type: "main", x: 650, y: 150 }

    ],

    links: [
      { source: "Learning", target: "Science" },
      { source: "Learning", target: "Psychology" },
      { source: "Learning", target: "Philosophy" }
    ]
  })


  function createBranchNodes(parent, labels, radius = 420) {

    let baseAngle = 0

    if (parent.id === "Science") baseAngle = Math.PI
    if (parent.id === "Philosophy") baseAngle = 0
    if (parent.id === "Psychology") baseAngle = -Math.PI / 2

    const spread = Math.PI / 1.2

    return labels.map((label, i) => {

      const angle =
        baseAngle - spread / 2 +
        (i / (labels.length - 1 || 1)) * spread

      return {
        id: label,
        type: "sub",
        x: parent.x + radius * Math.cos(angle),
        y: parent.y + radius * Math.sin(angle)
      }

    })
  }


  function expandNode(node) {

    let labels = []

    if (node.id === "Science")
      labels = ["Physics", "Biology", "Chemistry"]

    if (node.id === "Philosophy")
      labels = ["Free Will", "Consciousness"]

    if (node.id === "Psychology")
      labels = ["Cognition", "Emotion", "Behavior"]

    if (labels.length === 0) return

    const newNodes = createBranchNodes(node, labels)

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

    <div
      style={{
        height: "900px",
        width: "100%",
        marginTop: "-120px"
      }}
    >

      <ForceGraph2D
        graphData={graphData}

        cooldownTicks={0}
        d3VelocityDecay={1}

        enableNodeDrag={false}
        enablePointerInteraction={true}

        nodePointerAreaPaint={(node, color, ctx) => {

          const hitboxSize = node.type === "main" ? 65 : 40

          ctx.fillStyle = color
          ctx.beginPath()
          ctx.arc(node.x, node.y, hitboxSize, 0, 2 * Math.PI)
          ctx.fill()

        }}

        nodeCanvasObject={(node, ctx, globalScale) => {

          const label = node.id
          const fontSize = 22 / globalScale

          ctx.font = `${fontSize}px Sans-Serif`

          const size =
            node.id === "Learning"
              ? 38
              : node.type === "main"
              ? 32
              : 12

          ctx.beginPath()
          ctx.arc(node.x, node.y, size, 0, 2 * Math.PI)

          ctx.fillStyle =
            node.type === "main"
              ? "#2b6cb0"
              : "#38a169"

          ctx.fill()

          ctx.fillStyle = "#000"

          ctx.fillText(
            label,
            node.x + size + 6,
            node.y + 4
          )

        }}

        linkColor={() => "#cccccc"}

        linkWidth={link =>
          link.source.id === "Learning"
            ? 2.5
            : 1.5
        }

        onNodeClick={expandNode}

      />

    </div>
  )
}
