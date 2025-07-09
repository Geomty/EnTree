import { useCallback, useContext, useEffect, useRef } from "react";
import { Handle as FlowHandle, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { ActiveContext } from "@/app/lib/context";

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
  const reactFlow = useReactFlow();
  const active = useContext(ActiveContext);
  const onClick = useCallback(() => {
    if (active[0]) {
      reactFlow.setViewport(active[0].pos, { duration: 1000 });
      active[1](null);
    } else {
      reactFlow.fitView({ duration: 1000, nodes: [{ id: props.id }] });
      setTimeout(() => active[1]({ id: props.id, pos: reactFlow.getViewport() }), 1); // optimal solution!
    }
    // reactFlow.updateNodeData(props.id, { complete: props.data.complete ? false : true });
  }, [active]);

  return (
    <div className={(props.data.complete ? "opacity-50 " : "opacity-100 ") + (active[0]?.id == props.id ? "cursor-auto " : "") + "w-96 h-52 flex justify-center content-center text-center bg-neutral-100 border-4 border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-4xl"}>
      <AnimatePresence>
        {active[0]?.id == props.id &&
          <Animated className="p-4 w-full flex flex-col justify-between content-center nodrag">
            <p className="text-xl select-text overflow-x-auto text-nowrap">{props.data.title}</p>
            <p className="text-sm select-text">{props.data.description}</p>
            <div className="flex justify-end content-center gap-4">
              <Button value="Mark as complete" />
              <Button value="Back" onClick={onClick} />
            </div>
          </Animated>
        }
      </AnimatePresence>
      <AnimatePresence>
        {active[0]?.id != props.id && <Title onClick={onClick} value={props.data.title} />}
      </AnimatePresence>
      {pos != "bottom" && <Handle type="source" position="bottom" />}
      {pos != "top" && <Handle type="target" position="top" />}
    </div>
  )
}

function Handle(props) {
  const active = useContext(ActiveContext);

  return <FlowHandle {...props} className={(active[0] ? "!cursor-default " : "!cursor-grab ") + "!bg-black dark:!bg-neutral-500 !size-6 !border-4 !border-white dark:!border-neutral-950"} />
}

function Animated({ ref, children, className }) {
  return <motion.div ref={ref} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }} className={className}>{children}</motion.div>
}

function Title({ value, onClick }) {
  const myRef = useRef(null);
  useEffect(() => {
    let i = 5;
    while (myRef.current.clientHeight > 180 && i > 0) {
      // its the only way :(
      switch (i) {
        case 5:
          myRef.current.children[0].style.fontSize = "var(--text-5xl)";
          break;
        case 4:
          myRef.current.children[0].style.fontSize = "var(--text-4xl)";
          break;
        case 3:
          myRef.current.children[0].style.fontSize = "var(--text-3xl)";
          break;
        case 2:
          myRef.current.children[0].style.fontSize = "var(--text-2xl)";
          break;
        case 1:  
          myRef.current.children[0].style.fontSize = "var(--text-xl)";
          break;
      }
      i--;
    }
  }, []);

  return (
    <Animated ref={myRef} className="w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 wrap-break-word">
      <p style={{ fontSize: "var(--text-6xl)" }} className="text-center hover:cursor-pointer" onClick={onClick}>{value}</p>
    </Animated>
  )
}

function Button({ value, onClick = () => {} }) {
  return <button type="button" className="px-[0.4rem] py-[0.2rem] text-[0.6rem] bg-neutral-300 border border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-md hover:cursor-pointer" onClick={onClick}>{value}</button>
}