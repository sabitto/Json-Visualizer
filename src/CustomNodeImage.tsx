import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import "./CustomNodeImage.css";

const CustomNodeImage = ({ id, data }: NodeProps) => {
  return (
    <div className="image-node">
      <img src={data.src} alt="image" className="node-image" />
      <Handle
        type="source"
        position={Position.Right}
        id={`source-${id}-0`}
        style={{ top: '50%', transform: 'translateY(-50%)', right: -8 }}
      />
      <Handle
        type="target"
        position={Position.Left}
        id={`target-${id}-0`}
        style={{ top: '50%', transform: 'translateY(-50%)', left: -8 }}
      />
    </div>
  );
};

export default memo(CustomNodeImage);
