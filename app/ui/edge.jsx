import { BaseEdge, getSmoothStepPath } from "@xyflow/react";

export default function Edge({ id, sourceX, sourceY, targetX, targetY }) {
  const [path] = getSmoothStepPath({ sourceX, sourceY, targetX, targetY, borderRadius: 40, offset: 40 });

  return <BaseEdge id={id} path={path} className="!stroke-4 !stroke-neutral-500" />
}