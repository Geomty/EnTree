import { useState, useCallback, useMemo, useRef } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { Node, StartNode, EndNode } from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import { MyContext } from "@/app/lib/context";
import { Tree } from "@/app/lib/classes";

const nodeTypes = { node: Node, start: StartNode, end: EndNode };
const edgeTypes = { edge: Edge };

export default function Flow({ initial }) {
  const tree = useRef(new Tree({ title: initial, description: "This is a description." }));
  const result = useMemo(() => tree.current.toFlow(), [tree]);

  const active = useState(null);
  const [nodes, setNodes] = useState(result.nodes);
  const [edges, setEdges] = useState(result.edges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);

  return (
    <MyContext value={[active, tree, setNodes, setEdges]}>
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
    </MyContext>
  );
}