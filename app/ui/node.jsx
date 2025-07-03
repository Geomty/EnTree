import { useCallback, useContext } from "react";
import { Handle as FlowHandle, useReactFlow } from "@xyflow/react";
import { ActiveContext } from "@/app/lib/context";

export default function Node(props) {
  const reactFlow = useReactFlow();
  const active = useContext(ActiveContext);
  const onClick = useCallback(() => {
    reactFlow.fitView({ duration: 1000, nodes: [{ id: props.id }] });
    setTimeout(() => {
      if (active[0] == props.id) {
        active[1](null);
      } else if (active[0] == null) {
        active[1](props.id);
      }
    }, 1); // optimal solution!
    reactFlow.updateNodeData(props.id, { complete: props.data.complete ? false : true });
  }, [active]);

  return (
    <div className={(props.data.complete ? "opacity-50" : "opacity-100") + " px-6 py-3 bg-neutral-100 border border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg"}>
      <p className="text-md text-black dark:text-neutral-200 hover:cursor-pointer" onClick={onClick}>{props.data.label}</p>
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  )
}

function Handle(props) {
  return <FlowHandle {...props} className="!cursor-grab !bg-black dark:!bg-neutral-500 !border-white dark:!border-neutral-950" />
}