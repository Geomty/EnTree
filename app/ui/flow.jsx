"use client";

import { useState, useCallback, useRef } from "react";
import { ReactFlow, applyNodeChanges, applyEdgeChanges } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { RiResetLeftFill } from "react-icons/ri";
import Node from "@/app/ui/node";
import Edge from "@/app/ui/edge";
import ErrorToast from "@/app/ui/error-toast";
import { MyContext } from "@/app/lib/context";
import { Tree } from "@/app/lib/classes";
import { updateTree } from "@/app/lib/actions";

const nodeTypes = { node: Node };
const edgeTypes = { edge: Edge };

export default function Flow({ initial, slug }) {
  const tree = useRef(new Tree(initial));
  let result = tree.current.toFlow();

  let timeout = useRef(null);
  const active = useState(null);
  const [nodes, setNodes] = useState(result.nodes);
  const [edges, setEdges] = useState(result.edges);
  const onNodesChange = useCallback(changes => setNodes(nds => applyNodeChanges(changes, nds)), []);
  const onEdgesChange = useCallback(changes => setEdges(eds => applyEdgeChanges(changes, eds)), []);
  const onNodeDragStart = useCallback(() => reset[1](false));
  const onNodeDragStop = useCallback((_, node) => {
    tree.current.findChild(node.id).position = node.position;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => updateTree("1", slug, JSON.stringify(tree.current)), 3000);
  }, []);
  const reset = useState(true);

  const resetView = useCallback(() => {
    tree.current.organize();
    const result = tree.current.toFlow();
    setNodes(result.nodes);
    setEdges(result.edges);
    reset[1](true);
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => updateTree("1", slug, JSON.stringify(tree.current)), 3000);
  }, [tree, reset]);

  const [error, setError] = useState(false);
  const showError = useCallback(() => setError(setTimeout(() => setError(false), 5000)), []);

  return (
    <MyContext value={[active, tree, slug, reset, timeout, showError]}>
      <AnimatePresence>
        {(!reset[0] && !active[0]) && <motion.button
          type="button"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 1.1 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { type: "tween", duration: 0.3, ease: "easeInOut" },
            scale: { type: "tween", duration: 0.3, ease: "backOut" }
          }}
          title="Reset"
          onClick={resetView}
          className="absolute bottom-5 right-5 z-10 p-2 hover:cursor-pointer bg-slate-300 dark:bg-slate-700 rounded-lg"
        ><RiResetLeftFill className="size-6 fill-banana-800 dark:fill-banana-500" /></motion.button>}
      </AnimatePresence>
      <AnimatePresence>{error && <ErrorToast />}</AnimatePresence>
      <motion.div
        className="w-screen h-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "tween", duration: 0.3, ease: "easeInOut" }}
      >
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
      </motion.div>
    </MyContext>
  );
}