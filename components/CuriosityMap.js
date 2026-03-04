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
      { id: "Science", type: "main", fx: -350, fy: 120 },
      { id: "Psychology", type: "main", fx: 350, fy: -120 },
      { id: "Philosophy", type: "main", fx: 350, fy: 120 }
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
        { id: "Physics", type: "sub" },
        { id: "Biology", type: "sub" },
        { id: "Chemistry", type: "sub" }
      ]

      newLinks = [
        { source: "Science", target: "Physics" },
        { source: "Science", target: "Biology" },
        { source: "Science", target: "Chemistry" }
      ]

    }

    if (node.id === "Philosophy") {

      newNodes = [
        { id: "Free Will", type: "sub" },
        { id: "Consciousness", type: "sub" }
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

    <div style={{ height: "
