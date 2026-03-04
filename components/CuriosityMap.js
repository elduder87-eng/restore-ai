"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

const ForceGraph2D = dynamic(
  () => import("react-force-graph").then(mod => mod.ForceGraph2D),
  { ssr: false }
)

export default function CuriosityMap() {

  const [selectedNode, setSelectedNode] = useState(null)

  const data = {
    nodes: [
      { id: "Science", group: 1 },
      { id: "Astronomy", group: 1 },
      { id: "Black Holes", group: 1 },

      { id: "Technology", group: 2 },
      { id: "Artificial Intelligence", group: 2 },
      { id: "Machine Learning", group: 2 },

      { id: "Philosophy", group: 3 },
      { id: "Ethics", group: 3 }
    ],

    links: [
      { source: "Science", target: "Astronomy" },
      { source: "Astronomy", target: "Black Holes" },

      { source: "Technology", target: "Artificial Intelligence" },
      { source: "Artificial Intelligence", target: "Machine Learning" },

      { source: "Artificial Intelligence", target: "Philosophy" },
      { source: "Philosophy", target: "Ethics" }
    ]
  }

  return (
    <div style={{ height: "600px", width: "100%" }}>

      <ForceGraph2D
        graphData={data}
        nodeAutoColorBy="group"
        nodeLabel="id"
        nodeRelSize={8}

        onNodeClick={(node) => {
          setSelectedNode(node)
        }}
      />

      {selectedNode && (
        <div
          style={{
            position: "absolute",
            bottom: "20px",
            left: "20px",
            background: "#111",
            color: "white",
            padding: "10px",
            borderRadius: "8px"
          }}
        >
          <h3>{selectedNode.id}</h3>
          <p>This topic is part of your curiosity map.</p>
        </div>
      )}

    </div>
  )
}
