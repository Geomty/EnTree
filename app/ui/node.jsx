import { useActionState, useCallback, useContext, useEffect, useRef } from "react";
import { Handle, useReactFlow } from "@xyflow/react";
import { motion, AnimatePresence } from "motion/react";
import { HiArrowSmallLeft, HiOutlineTrash } from "react-icons/hi2";
import { GiCheckMark } from "react-icons/gi";
import { MyContext } from "@/app/lib/context";
import { updateTree, generateChildren } from "@/app/lib/actions";

const handleStyle = "!bg-olive-900 dark:!bg-olive-700 !size-6 !border-4 !border-white dark:!border-neutral-950";

export default function Node(props) {
  let [active, tree, slug, reset, timeout, showError] = useContext(MyContext);
  const reactFlow = useReactFlow();

  const toggleActive = useCallback(n => {
    if (active[0]) {
      reactFlow.setViewport(active[0].pos, { duration: 1000 });
      active[1](null);
    } else {
      if (n == 1) return;
      reactFlow.fitView({ duration: 1000, nodes: [{ id: props.id }] });
      setTimeout(() => active[1]({ id: props.id, pos: reactFlow.getViewport() }), 1); // optimal solution!
    }
  }, [active]);

  const updateFlow = useCallback(() => {
    toggleActive(1);
    if (reset[0]) tree.current.organize();
    const result = tree.current.toFlow();
    reactFlow.setNodes(result.nodes);
    reactFlow.setEdges(result.edges);
    updateTree("1", slug, JSON.stringify(tree.current));
  }, [tree, reset, toggleActive]);

  const toggleComplete = useCallback(() => {
    reactFlow.updateNodeData(props.id, { complete: !props.data.complete });
    tree.current.findChild(props.id).complete = !props.data.complete;
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => updateTree("1", slug, JSON.stringify(tree.current)), 3000);
  }, [tree, props.data.complete]);

  const deleteNode = useCallback(() => {
    let arr = props.id.split("_");
    let i = arr.pop();
    tree.current.findChild(arr.join("_")).children.splice(i, 1);
    updateFlow();
  }, [tree, updateFlow]);

  const [result, formAction, isPending] = useActionState(generateChildren, null);
  useEffect(() => {
    if (result) {
      if (result.error) {
        showError();
      } else {
        tree.current.addChildren(props.id, result.response);
        updateFlow();
      }
    }
  }, [result]);

  return (
    <div className={(props.data.complete ? "opacity-50 " : "opacity-100 ") + (active[0] ? "cursor-auto " : "") +
      "w-96 h-52 flex justify-center content-center text-center bg-neutral-100 border-4 border-olive-900 dark:bg-neutral-800 dark:border-olive-700 rounded-4xl"
    }>
      <AnimatePresence>
        {active[0]?.id == props.id &&
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "tween", duration: 0.5, ease: "easeInOut" }}
            className="w-full z-10 p-4 flex flex-col justify-between content-center nowheel"
          >
            <div className="flex justify-between content-center gap-2">
              <motion.button
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 1.1 }}
                onClick={toggleActive}
                disabled={isPending}
                title="Back"
                className={"p-1" + (isPending ? " opacity-50" : " hover:cursor-pointer")}
              >
                <HiArrowSmallLeft className="size-5 fill-banana-800 dark:fill-banana-500" />
              </motion.button>
              <p className="animColor text-lg select-text overflow-x-auto text-nowrap">{props.data.title}</p>
              {props.id == "0" ?
                <div className="m-1 size-5 opacity-0"></div>
              :
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.1 }}
                  onClick={deleteNode}
                  disabled={isPending}
                  title="Delete"
                  className={"" + (isPending ? " opacity-50" : " hover:cursor-pointer")}
                >
                  <HiOutlineTrash className="size-5 stroke-banana-800 dark:stroke-banana-500" />
                </motion.button>
              }
            </div>
            <Description>{props.data.description}</Description>
            <div className="flex justify-between content-center">
              <form action={formAction} style={{ all: "inherit" }}>
                <input type="text" name="query" value={props.data.title} readOnly className="hidden" />
                <motion.button
                  whileHover={{ scale: isPending ? 1 : 1.1 }}
                  whileTap={{ scale: isPending ? 1 : 1.05 }}
                  type="submit"
                  title="Generate children"
                  disabled={isPending}
                  className={"animColor px-[0.3rem] py-[0.2rem] text-[0.5rem] bg-olive-800 !text-white dark:bg-olive-600 dark:!text-black rounded-md" +
                    (isPending ? " opacity-50" : " hover:cursor-pointer")
                  }
                >Generate children</motion.button>
              </form>
              <div onClick={isPending ? () => {} : toggleComplete} className={"flex content-center gap-1 mt-auto mb-auto" +
                (isPending ? " opacity-50" : " hover:cursor-pointer")
              }>
                <motion.button
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 1.1 }}
                  className={"size-3 flex justify-center content-center border border-banana-800 dark:border-banana-500 rounded-sm" +
                    (isPending ? "" : " hover:cursor-pointer")
                  }
                >
                  {props.data.complete && <GiCheckMark className="size-2 m-auto fill-banana-800 dark:fill-banana-500" />}
                </motion.button>
                <p className="animColor text-[0.5rem]">Mark as complete</p>
              </div>
            </div>
          </motion.div>
        }
      </AnimatePresence>
      <Title onClick={toggleActive} id={props.id} complete={props.data.complete}>{props.data.title}</Title>
      <Handle
        type="source"
        position="bottom"
        className={(active[0] ? "!cursor-default " : "!cursor-grab ") + (props.data.type == "end" ? "opacity-0 " : "") + handleStyle}
      />
      <Handle
        type="target"
        position="top"
        className={(active[0] ? "!cursor-default " : "!cursor-grab ") + (props.data.type == "start" ? "opacity-0 " : "") + handleStyle}
      />
    </div>
  )
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
    <motion.button
      ref={titleRef}
      whileHover={{ scale: active[0] ? 1 : 1.1 }}
      whileTap={{ scale: active[0] ? 1 : 1.05 }}
      animate={{ opacity: active[0]?.id == id ? 0 : 1 }}
      transition={{
        opacity: { type: "tween", duration: 0.5, ease: "easeInOut" },
        scale: { type: "tween", duration: 0.3, ease: "backOut" }
      }}
      className={"w-80 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 wrap-break-word " +
        (active[0] ? "" : "hover:cursor-pointer")
      }
      onClick={active[0] ? () => {} : onClick}
    >
      <p
        style={{ fontSize: "var(--text-5xl)" }}
        className={"animColor " +
          (complete ? "line-through" : "")
        }
      >{children}</p>
    </motion.button>
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

  return <p ref={descRef} style={{ fontSize: "var(--text-xs)" }} className="animColor select-text wrap-break-word overflow-auto max-h-[95px]">{children}</p>
}