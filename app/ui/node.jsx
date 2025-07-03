import { Handle as FlowHandle, useReactFlow } from "@xyflow/react";

export default function Node(props) {
  const reactFlow = useReactFlow();

  return (
    <div className={(props.data.complete ? "opacity-50" : "opacity-100") + " px-6 py-3 bg-neutral-100 border border-black dark:bg-neutral-800 dark:border-neutral-500 rounded-lg"}>
      <p className="text-md text-black dark:text-neutral-200 hover:cursor-pointer" onClick={() => {
        reactFlow.updateNodeData(props.id, { complete: props.data.complete ? false : true });
      }}>{props.data.label}</p>
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  )
}

function Handle(props) {
  return <FlowHandle {...props} className="!cursor-grab !bg-black dark:!bg-neutral-500 !border-white dark:!border-neutral-950" />
}