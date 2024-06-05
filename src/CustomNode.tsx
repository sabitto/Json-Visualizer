import { memo } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import "./CustomNodeTable.css";

const CustomNodeTable = ({ id, data }: NodeProps) => {
  const rows = Array.from({ length: data.keysSpisok.length });

  const renderValue = (key: string) => {
    const value = data.data[key];
    const type = data.schema[key].type;

    if (type === "jpg") {
      return null; 
    }

    if (typeof value === "object" && value !== null) {
      return null;
    }

    return value;
  };

  return (
    <div style={{ border: "1px solid #777", margin: 10, padding: 0, borderRadius: 5, width: "250px" }}>
      <p style={{ margin: 0, padding: "10px", borderBottom: "1px solid #ddd" }}>{data.label}</p>
      <hr style={{ margin: 0 }} />
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <tbody>
          {rows.map((_, index) => {
            const key = data.keysSpisok[index];
            const value = renderValue(key);
            return (
              <tr
                key={index}
                style={{
                  borderBottom: index < rows.length - 1 ? "1px solid #ddd" : "none",
                }}
              >
                <td style={{ position: "relative", padding: "10px", width: "100%" }}>
                  <Handle
                    type="source"
                    position={Position.Right}
                    id={`source-${id}-${index}`}
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: -8,
                    }}
                  />
                  <Handle
                    type="target"
                    position={Position.Left}
                    id={`target-${id}-${index}`}
                    style={{
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: -8 }}
                  />

                  <div className="node-row">
                    <span className="key">{key}</span>
                    {value !== null && <span className="value">{value}</span>}
                    <span className="type">{data.schema[key].type}</span>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default memo(CustomNodeTable);
