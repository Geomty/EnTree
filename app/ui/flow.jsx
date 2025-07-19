import { useState, useCallback, useMemo, useRef } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { Node } from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import { MyContext } from "@/app/lib/context";
import { Tree } from "@/app/lib/classes";

const nodeTypes = { node: Node };
const edgeTypes = { edge: Edge };

export default function Flow({ initial, formStyle }) {
  const tree = useRef(new Tree({ title: initial, description: "This is a description.", position: { x: 0, y: 0 } }));
  const result = useMemo(() => tree.current.toFlow(), [tree]);

  const active = useState(null);
  const [nodes, setNodes] = useState(result.nodes);
  const [edges, setEdges] = useState(result.edges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onNodeDragStart = useCallback(() => reset[1](false));
  const onNodeDragStop = useCallback((_, node) => tree.current.findChild(node.id).position = node.position, []);
  const reset = useState(true);

  return (
    <MyContext value={[active, tree, reset]}>
      <AnimatePresence>
        {!reset[0] && <motion.button
          type="button"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
          title="Reset"
          onClick={() => {
            tree.current.organize();
            const result = tree.current.toFlow();
            setNodes(result.nodes);
            setEdges(result.edges);
            reset[1](true);
          }}
          className={"absolute bottom-5 right-5 z-10 px-3 py-1 hover:cursor-pointer " + formStyle}
        >Reset</motion.button>}
      </AnimatePresence>
      <div className="w-screen h-screen bg-white dark:bg-neutral-950">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeDragStart={onNodeDragStart}
          onNodeDragStop={onNodeDragStop}
          proOptions={{ hideAttribution: true }}
          fitView={true}
          fitViewOptions={{ padding: 2 }}
          minZoom={0.2}
          maxZoom={2.5}
          panOnDrag={!active[0]}
          zoomOnScroll={!active[0]}
          zoomOnPinch={!active[0]}
          nodesDraggable={!active[0]}
          nodesConnectable={false}
          nodesFocusable={false}
          edgesFocusable={false}
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