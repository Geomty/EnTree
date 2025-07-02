"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import Node from "@/app/ui/node";
import Edge from "@/app/ui/edge";

const nodeTypes = { node: Node };
const edgeTypes = { edge: Edge };

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "node",
    data: { label: "Hello" }
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    type: "node",
    data: { label: "World" }
  }
];

const initialEdges = [
  {
    id: "1-2",
    type: "edge",
    source: "1",
    target: "2"
  }
];

export default function Flow() {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  // const onConnect = useCallback(params => setEdges(eds => addEdge(params, eds)), []);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="w-screen h-screen bg-white dark:bg-neutral-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        // onConnect={onConnect}
        proOptions={{ hideAttribution: true }}
        fitView={true}
        nodesConnectable={false}
        nodesFocusable={false}
        edgesFocusable={false}
        elementsSelectable={false}
        selectNodesOnDrag={false}
        autoPanSpeed={5}
        zoomOnDoubleClick={false}
        deleteKeyCode={null}
        selectionKeyCode={null}
        multiSelectionKeyCode={null}
        zoomActivationKeyCode={null}
        panActivationKeyCode={null}
      />
    </div>
  );
}