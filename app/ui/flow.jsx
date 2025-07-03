"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import Node from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import { ActiveContext } from "@/app/lib/context";

const nodeTypes = { node: Node };
const edgeTypes = { edge: Edge };

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "node",
    data: { label: "Hello", complete: false }
  },
  {
    id: "2",
    position: { x: 0, y: 100 },
    type: "node",
    data: { label: "World", complete: false }
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
  const active = useState(null);
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
    <ActiveContext value={active}>
      <div className={(active[0] && "brightness-50 ") + "w-screen h-screen bg-white dark:bg-neutral-950"}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={active[0] ? null : onNodesChange}
          onEdgesChange={onEdgesChange}
          // onConnect={onConnect}
          proOptions={{ hideAttribution: true }}
          fitView={true}
          fitViewOptions={{ padding: 2 }}
          maxZoom={10}
          panOnDrag={!active[0]}
          zoomOnScroll={!active[0]}
          zoomOnPinch={!active[0]}
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
    </ActiveContext>
  );
}