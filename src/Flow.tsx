import  { useState, useCallback, useEffect } from 'react';
import ReactFlow, {
  Node,
  addEdge,
  Background,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
} from 'reactflow';

import CustomNodeTable from './CustomNode';
import CustomNodeImage from './CustomNodeImage';
import DataEditor from './DataEditor';
import 'reactflow/dist/style.css';
import jsonSchema1 from './schema.json';
import initialJsonData from './data.json';

interface JsonSchema {
  [key: string]: any;
}

interface JsonData {
  [key: string]: any;
}

interface NodeType extends Node {
  type: string;
  data: {
    [key: string]: any;
  };
}

function generateNodesAndEdges(schema: JsonSchema, data: JsonData) {
  const nodes: NodeType[] = [];
  const edges: Edge[] = [];

  const nodeHeight = 100;
  let yOffset = 0;

  const createNodesAndEdges = (schema: JsonSchema, data: JsonData, parentId?: string) => {
    const nodeId = parentId || schema.id;

    nodes.push({
      id: nodeId,
      type: 'custom1',
      data: {
        keysSpisok: Object.keys(schema.properties),
        schema: schema.properties,
        label: schema.title || 'no title',
        data: data || {},
      },
      position: { x: 400 + yOffset * 300, y: 200 + yOffset * nodeHeight },
    });

    yOffset++;

    let index = 0;
    for (const key in schema.properties) {
      const childSchema = schema.properties[key];
      const childId = `${nodeId}-${key}`;

      if (childSchema.type === 'object') {
        createNodesAndEdges(childSchema, data ? data[key] : {}, childId);
        edges.push({
          id: `${parentId}-${key}`,
          source: nodeId,
          target: childId,
          sourceHandle: `source-${nodeId}-${index}`,
          targetHandle: `target-${childId}-0`,
          animated: true,
        });
      } else if (childSchema.type === 'jpg') {
        nodes.push({
          id: childId,
          type: 'imageNode',
          data: {
            id: childId,
            src: data[key],
          },
          position: { x: 700, y: 200 + yOffset * nodeHeight },
          style: { opacity: 1 },
        });
        edges.push({
          id: `${parentId}-${key}`,
          source: nodeId,
          target: childId,
          sourceHandle: `source-${nodeId}-${index}`,
          targetHandle: `target-${childId}-0`,
          animated: true,
        });
      }
      index++;
    }
  };

  createNodesAndEdges(schema, data);

  return { nodes, edges };
}

const nodeTypes = {
  custom1: CustomNodeTable,
  imageNode: CustomNodeImage,
};

const BasicFlow = () => {
  const [jsonData, setJsonData] = useState(initialJsonData);
  const { nodes: initialNodes, edges: generatedEdges } = generateNodesAndEdges(jsonSchema1, jsonData);
  const initialEdgesWithGenerated = [...generatedEdges];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdgesWithGenerated);

  useEffect(() => {
    const { nodes, edges } = generateNodesAndEdges(jsonSchema1, jsonData);
    setNodes(nodes);
    setEdges(edges);
  }, [jsonData]);

  const onConnect = useCallback(
    (params: Edge | Connection) => {
      const newEdge = {
        ...params,
        id: `e${params.source}-${params.target}`,
      } as Edge;
      setEdges((els) => addEdge(newEdge, els));
      console.log('New edge added:', newEdge);
    },
    [setEdges]
  );

  const handleEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Edge | Connection) => {
      const updatedEdge = {
        ...newConnection,
        id: oldEdge.id,
      } as Edge;
      const updatedEdges = edges.map((edge) =>
        edge.id === oldEdge.id ? updatedEdge : edge
      );
      setEdges(updatedEdges);
      console.log('Edge updated:', updatedEdge);
    },
    [edges, setEdges]
  );

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onEdgeUpdate={handleEdgeUpdate}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
        </ReactFlow>
      </div>
      <div style={{ width: '400px', padding: '10px', borderLeft: '1px solid #ddd' }}>
        <DataEditor data={jsonData} setData={setJsonData} />
      </div>
    </div>
  );
};

export default BasicFlow;
