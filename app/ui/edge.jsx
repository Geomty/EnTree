import { BaseEdge, getBezierPath } from "@xyflow/react";

export default function Edge({ id, sourceX, sourceY, targetX, targetY }) {
  const [path] = getBezierPath({ sourceX, sourceY, targetX, targetY, borderRadius: 40, offset: 40 });

  return <BaseEdge id={id} path={path} className="!stroke-4 !stroke-banana-900 dark:!stroke-banana-700" />
}