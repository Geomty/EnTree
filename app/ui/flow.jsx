"use client";

import { useState, useCallback, useEffect } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge } from "@xyflow/react";
import Node from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import { ActiveContext } from "@/app/lib/context";
import { Tree } from "@/app/lib/classes";

const nodeTypes = { node: Node };
const edgeTypes = { edge: Edge };

const initialNodes = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    type: "node",
    data: { title: "Hello", description: "This is a description.", complete: false }
  },
  {
    id: "2",
    position: { x: -300, y: 400 },
    type: "node",
    data: { title: "Hello world this is long text", description: "This is another description.", complete: false }
  },
  {
    id: "3",
    position: { x: 300, y: 400 },
    type: "node",
    data: { title: "Wow a third node", description: "Yet another description.", complete: false }
  }
];

const initialEdges = [
  {
    id: "1-2",
    type: "edge",
    source: "1",
    target: "2"
  },
  {
    id: "1-3",
    type: "edge",
    source: "1",
    target: "3"
  }
];

const tree = new Tree({ title: "Hello", description: "This is a description." });
tree.addChildren({ title: "World", description: "This is another description." }, { title: "Wow a third node", description: "Yet another description." });
const result = tree.toFlow();

export default function Flow() {
  const active = useState(null);
  const [nodes, setNodes] = useState(result.nodes);
  const [edges, setEdges] = useState(result.edges);
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
      <div className="w-screen h-screen bg-white dark:bg-neutral-950">
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
          minZoom={0.2}
          maxZoom={2.5}
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