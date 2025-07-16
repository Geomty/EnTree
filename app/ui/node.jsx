import { useActionState, useCallback, useContext, useEffect, useRef } from "react";
import { Handle as FlowHandle, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { MyContext } from "@/app/lib/context";
import { createChildren } from "@/app/lib/actions";

export function Node(props) {
  return <BaseNode props={props} />
}

export function StartNode(props) {
  return <BaseNode props={props} pos="top" />
}

export function EndNode(props) {
  return <BaseNode props={props} pos="bottom" />
}

function BaseNode({ props, pos = "middle" }) {
  const [active, tree, setNodes, setEdges] = useContext(MyContext);

  const reactFlow = useReactFlow();
  const toggleActive = useCallback(() => {
    if (active[0]) {
      reactFlow.setViewport(active[0].pos, { duration: 1000 });
      active[1](null);
    } else {
      reactFlow.fitView({ duration: 1000, nodes: [{ id: props.id }] });
      setTimeout(() => active[1]({ id: props.id, pos: reactFlow.getViewport() }), 1); // optimal solution!
    }
    // reactFlow.updateNodeData(props.id, { complete: props.data.complete ? false : true });
  }, [active]);

  const [state, formAction, isPending] = useActionState(createChildren, null);
  useEffect(() => {
    if (state) {
      const node = tree.current.findChild(props.id);
      node.addChildren(state);
      const result = tree.current.toFlow();
      setNodes(result.nodes);
      setEdges(result.edges);
      toggleActive();
    }
  }, [state]);

  return (
    <div className={(props.data.complete ? "opacity-50 " : "opacity-100 ") + (active[0]?.id == props.id ? "cursor-auto " : "") + "w-96 h-52 flex justify-center content-center text-center bg-neutral-100 border-4 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-4xl"}>
      <AnimatePresence>
        {active[0]?.id == props.id &&
          <Animated className="p-4 w-full flex flex-col justify-between content-center nodrag">
            <p className="text-xl select-text overflow-x-auto text-nowrap">{props.data.title}</p>
            <p className="text-sm select-text">{props.data.description}</p>
            <div className="flex justify-end content-center gap-4">
              <Button value="Mark as complete" disabled={isPending} />
              <form action={formAction} className="m-[-0.2rem]">
                <input type="text" name="query" value={props.data.title} readOnly className="hidden" />
                <Button value="Generate children" disabled={isPending} submit={true} />
              </form>
              <Button value="Back" onClick={toggleActive} disabled={isPending} />
            </div>
          </Animated>
        }
      </AnimatePresence>
      <Title onClick={toggleActive} value={props.data.title} />
      {pos != "bottom" && <Handle type="source" position="bottom" />}
      {pos != "top" && <Handle type="target" position="top" />}
    </div>
  )
}

function Handle(props) {
  const [active] = useContext(MyContext);

  return <FlowHandle {...props} className={(active[0] ? "!cursor-default " : "!cursor-grab ") + "!bg-black dark:!bg-neutral-500 !size-6 !border-4 !border-white dark:!border-neutral-950"} />
}

function Animated({ ref, children, className }) {
  return <motion.div ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} className={className}>{children}</motion.div>
}

function Title({ value, onClick }) {
  const [active] = useContext(MyContext);
  const titleRef = useRef(null);
  useEffect(() => {
    let i = 5;
    while (titleRef.current.clientHeight > 180 && i > 0) {
      // its the only way :(
      switch (i) {
        case 5:
          titleRef.current.children[0].style.fontSize = "var(--text-5xl)";
          break;
        case 4:
          titleRef.current.children[0].style.fontSize = "var(--text-4xl)";
          break;
        case 3:
          titleRef.current.children[0].style.fontSize = "var(--text-3xl)";
          break;
        case 2:
          titleRef.current.children[0].style.fontSize = "var(--text-2xl)";
          break;
        case 1:  
          titleRef.current.children[0].style.fontSize = "var(--text-xl)";
          break;
      }
      i--;
    }
  }, []);

  return (
    <motion.div ref={titleRef} variants={{ active: { opacity: 0 }, inactive: { opacity: 1 } }} animate={active[0] ? "active" : "inactive"} exit={{ opacity: 0 }} transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} className="w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 wrap-break-word">
      <p style={{ fontSize: "var(--text-6xl)" }} className={"text-center" + (active[0] ? "" : " hover:cursor-pointer")} onClick={active[0] ? () => {} : onClick}>{value}</p>
    </motion.div>
  )
}

function Button({ value, onClick = () => {}, disabled = false, submit = false }) {
  return <button type={submit ? "submit" : "button"} disabled={disabled} className={"px-[0.4rem] py-[0.2rem] text-[0.6rem] bg-neutral-300 border border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-md" + (disabled ? " opacity-50" : " hover:cursor-pointer")} onClick={onClick}>{value}</button>
}