import { useActionState, useCallback, useContext, useEffect, useRef } from "react";
import { Handle, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { HiArrowSmallLeft, HiOutlineTrash } from "react-icons/hi2";
import { GiCheckMark } from "react-icons/gi";
import { MyContext } from "@/app/lib/context";
import { createChildren } from "@/app/lib/actions";

const handleStyle = "!bg-black dark:!bg-neutral-500 !size-6 !border-4 !border-white dark:!border-neutral-950";

export function Node(props) {
  const [active, tree, reset] = useContext(MyContext);
  const reactFlow = useReactFlow();

  const toggleActive = useCallback(() => {
    if (active[0]) {
      reactFlow.setViewport(active[0].pos, { duration: 1000 });
      active[1](null);
    } else {
      reactFlow.fitView({ duration: 1000, nodes: [{ id: props.id }] });
      setTimeout(() => active[1]({ id: props.id, pos: reactFlow.getViewport() }), 1); // optimal solution!
    }
  }, [active]);

  const updateFlow = useCallback(() => {
    toggleActive();
    if (reset[0]) tree.current.organize();
    const result = tree.current.toFlow();
    reactFlow.setNodes(result.nodes);
    reactFlow.setEdges(result.edges);
  }, [tree, reset, toggleActive]);

  const toggleComplete = useCallback(() => {
    reactFlow.updateNodeData(props.id, { complete: !props.data.complete });
    tree.current.findChild(props.id).complete = !props.data.complete;
  }, [tree, props.data.complete]);

  const deleteNode = useCallback(() => {
    let arr = props.id.split("_");
    let i = arr.pop();
    tree.current.findChild(arr.join("_")).children.splice(i, 1);
    updateFlow();
  }, [tree, updateFlow]);

  const [state, formAction, isPending] = useActionState(createChildren, null);
  useEffect(() => {
    if (state) {
      if (state.error) {
        alert(`A ${state.error.name} has occurred. Please try again.`);
      } else {
        const node = tree.current.findChild(props.id);
        node.addChildren(state.response);
        updateFlow();
      }
    }
  }, [state]);

  return (
    <div className={(props.data.complete ? "opacity-50 " : "opacity-100 ") + (active[0] ? "cursor-auto " : "") + "w-96 h-52 flex justify-center content-center text-center bg-neutral-100 border-4 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-4xl"}>
      <AnimatePresence>
        {active[0]?.id == props.id &&
          <Animated initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="w-full z-10 p-4 flex flex-col justify-between content-center nowheel">
            <div className="flex justify-between content-center gap-2">
              <button onClick={toggleActive} disabled={isPending} title="Back" className={"p-1" + (isPending ? " opacity-50" : " hover:cursor-pointer")}><HiArrowSmallLeft className="size-5 fill-neutral-700 dark:fill-neutral-400" /></button>
              <p className="text-lg select-text overflow-x-auto text-nowrap">{props.data.title}</p>
              {props.id == "0" ?
                <div className="m-1 size-5 opacity-0"></div>
              :
                <button onClick={deleteNode} disabled={isPending} title="Delete" className={"p-1" + (isPending ? " opacity-50" : " hover:cursor-pointer")}><HiOutlineTrash className="size-5 stroke-neutral-700 dark:stroke-neutral-400" /></button>
              }
            </div>
            <Description>{props.data.description}</Description>
            <div className="flex justify-between content-center">
              <form action={formAction} style={{ all: "inherit" }}>
                <input type="text" name="query" value={props.data.title} readOnly className="hidden" />
                <button
                  type="submit"
                  title="Generate children"
                  disabled={isPending}
                  className={"px-[0.3rem] py-[0.2rem] text-[0.5rem] bg-neutral-300 border border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-md" + (isPending ? " opacity-50" : " hover:cursor-pointer")}
                >Generate children</button>
              </form>
              <div onClick={isPending ? () => {} : toggleComplete} className={"flex content-center gap-2 mt-auto mb-auto" + (isPending ? " opacity-50" : " hover:cursor-pointer")}>
                <div className="size-4 flex justify-center content-center border border-black dark:border-neutral-400 rounded-sm">{props.data.complete && <GiCheckMark className="size-3 m-auto stroke-1 stroke-neutral-700 dark:stroke-neutral-300" />}</div>
                <p className="text-[0.5rem] mt-auto mb-auto">Mark as complete</p>
              </div>
            </div>
          </Animated>
        }
      </AnimatePresence>
      <Title onClick={toggleActive} id={props.id} complete={props.data.complete}>{props.data.title}</Title>
      <Handle type="source" position="bottom" className={(active[0] ? "!cursor-default " : "!cursor-grab ") + (props.data.type == "end" ? "opacity-0 " : "") + handleStyle} />
      <Handle type="target" position="top" className={(active[0] ? "!cursor-default " : "!cursor-grab ") + (props.data.type == "start" ? "opacity-0 " : "") + handleStyle} />
    </div>
  )
}

function Animated(props) {
  return <motion.div {...props} transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} />
}

function Title({ children, onClick, id, complete }) {
  const [active] = useContext(MyContext);
  const titleRef = useRef(null);
  useEffect(() => {
    let i = 4;
    while (titleRef.current.clientHeight > 144 && i > 0) {
      // its the only way :(
      switch (i) {
        // case 5:
        //   titleRef.current.children[0].style.fontSize = "var(--text-5xl)";
        //   break;
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
    <Animated ref={titleRef} variants={{ active: { opacity: 0 }, inactive: { opacity: 1 } }} animate={active[0]?.id == id ? "active" : "inactive"} exit={{ opacity: 0 }} className="w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 wrap-break-word">
      <p style={{ fontSize: "var(--text-5xl)" }} className={(active[0] ? "" : "hover:cursor-pointer ") + (complete ? "line-through" : "")} onClick={active[0] ? () => {} : onClick}>{children}</p>
    </Animated>
  )
}

function Description({ children }) {
  const descRef = useRef(null);
  useEffect(() => {
    let i = 1;
    while (descRef.current.clientHeight > 90 && i > 0) {
      switch (i) {
        case 1:
          descRef.current.style.fontSize = "0.5rem";
          break;
      }
      i--;
    }
  }, []);

  return <p ref={descRef} style={{ fontSize: "var(--text-xs)" }} className="select-text wrap-break-word overflow-auto max-h-[95px]">{children}</p>
}