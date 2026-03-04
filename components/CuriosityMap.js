"use client"

import dynamic from "next/dynamic"
import { useEffect, useState } from "react"

const ForceGraph2D = dynamic(
  () => import("react-force-graph-2d"),
  { ssr: false }
)

export default function CuriosityMap() {

  const [graphData, setGraphData] = useState(null)
  const [selectedNode, setSelectedNode] = useState(null)

  useEffect(() => {

    setGraphData({
      nodes: [
        { id: "Learning", description: "How we explore and understand ideas" },
        { id: "Science", description: "Exploring the physical universe" },
        { id: "Psychology", description: "Understanding the mind" },
        { id: "Philosophy", description: "Big questions about existence" },
        { id: "Astrophysics", description: "The physics of space and time" },
        { id: "Free Will", description: "Do we truly choose our actions?" }
      ],
      links: [
        { source: "Learning", target: "Science" },
        { source: "Learning", target: "Psychology" },
        { source: "Learning", target: "Philosophy" },
        { source: "Science", target: "Astrophysics" },
        { source: "Philosophy", target: "Free Will" }
      ]
    })

  }, [])

  if (!graphData) return <p>Loading curiosity map...</p>

  return (
    <div style={{ marginTop: "30px" }}>

      <div style={{ height: "700px", width: "100%" }}>
        <ForceGraph2D
          graphData={graphData}
          nodeLabel="id"
          nodeAutoColorBy="id"
          linkDirectionalParticles={2}
          linkDirectionalParticleSpeed={0.005}
          onNodeClick={(node) => setSelectedNode(node)}
        />
      </div>

      {selectedNode && (
        <div style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ddd",
          borderRadius: "10px",
          background: "#fafafa"
        }}>
          <h3>{selectedNode.id}</h3>
          <p>{selectedNode.description}</p>
        </div>
      )}

    </div>
  )
}
