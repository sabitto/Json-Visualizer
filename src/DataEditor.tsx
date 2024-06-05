import React from 'react';

type DataEditorProps = {
  data: any;
  setData: React.Dispatch<React.SetStateAction<any>>;
};

const DataEditor: React.FC<DataEditorProps> = ({ data, setData }) => {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const updatedData = JSON.parse(e.target.value);
      setData(updatedData);
    } catch (err) {
      console.error("Invalid JSON");
    }
  };

  return (
    <div>
      <h3>Data Editor</h3>
      <textarea value={JSON.stringify(data, null, 2)} onChange={handleChange} rows={30} cols={40} />
    </div>
  );
};

export default DataEditor;
