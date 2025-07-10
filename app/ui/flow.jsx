"use client";

import { useState, useCallback } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { Node, StartNode, EndNode } from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import { ActiveContext } from "@/app/lib/context";
import { Tree } from "@/app/lib/classes";

const nodeTypes = { node: Node, start: StartNode, end: EndNode };
const edgeTypes = { edge: Edge };

const tree = new Tree({ title: "Hello", description: "This is a description." });
tree.addChildren({ title: "World", description: "This is another description." }, { title: "Wow a third node", description: "Yet another description." });
tree.children[0].addChildren({ title: "Wow a fourth node this time with some really long text", description: "And yet another description." });
const result = tree.toFlow();

export default function Flow() {
  const active = useState(null);
  const [nodes, setNodes] = useState(result.nodes);
  const [edges, setEdges] = useState(result.edges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);

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