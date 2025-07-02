import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

export default function Edge({ id, sourceX, sourceY, targetX, targetY }) {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, borderRadius: 10, offset: 10 });

  return <BaseEdge id={id} path={path} className="!stroke-neutral-500" />
}