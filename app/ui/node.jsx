import { useCallback, useContext } from "react";
import { Handle as FlowHandle, useReactFlow } from "@xyflow/react";
import { ActiveContext } from "@/app/lib/context";

export default function Node(props) {
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
      {active[0]?.id == props.id ?
        <div className="m-4 w-full flex flex-col justify-between content-center nodrag">
          <p className="text-xl select-text">{props.data.title}</p>
          <p className="text-sm select-text">{props.data.description}</p>
          <div className="flex justify-end content-center gap-4">
            <Button value="Mark as complete" />
            <Button value="Back" onClick={onClick} />
          </div>
        </div>
      :
        <p className="m-auto text-6xl text-center hover:cursor-pointer" onClick={onClick}>{props.data.title}</p>
      }
      <Handle type="source" position="bottom" />
      <Handle type="target" position="top" />
    </div>
  )
}

function Handle(props) {
  const active = useContext(ActiveContext);

  return <FlowHandle {...props} className={(active[0] ? "!cursor-default " : "!cursor-grab ") + "!bg-black dark:!bg-neutral-500 !size-6 !border-4 !border-white dark:!border-neutral-950"} />
}

function Button({ value, onClick = () => {} }) {
  return <button type="button" className="px-[0.4rem] py-[0.2rem] text-[0.6rem] bg-neutral-300 border border-black dark:bg-neutral-700 dark:border-neutral-500 rounded-md hover:cursor-pointer" onClick={onClick}>{value}</button>
}