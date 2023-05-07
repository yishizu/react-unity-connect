import React, { useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";



function App() {
  const [count, setCount] = useState(0)
  const [mode, setMode] = useState("edit");
  const [selectedGeometry, setSelectedGeometry] = useState("Box");
  const [selectedObjectId, setSelectedObjectId] = useState(null);
  const [width, setWidth] = useState(1);
  const [height, setHeight] = useState(1);
  const [depth, setDepth] = useState(1);
  const [color, setColor] = useState({ r: 1, g: 1, b: 1, a: 1 });

  const { unityProvider,sendMessage } = useUnityContext({
    loaderUrl: '/unity/Build/Build.loader.js',
  dataUrl: '/unity/Build/Build.data',
  frameworkUrl: '/unity/Build/Build.framework.js',
  codeUrl: '/unity/Build/Build.wasm',
  });

  const handleChangeScale = () => {
    sendMessage("GeometryManager", "SetObjectScale", `${width},${height},${depth}`);
  };

  

  const handleModeChange = () => {
    setMode((prevMode) => (prevMode === "edit" ? "create" : "edit"));
    sendMessage("GeometryManager", "SetCreateMode", (mode === "create").toString());
  };

  const handleGeometrySelect = (e) => {
    sendMessage("GeometryManager", "SetGeometryType", e.target.value);
  };

  const handleCreateGeometry = () => {
    if (mode === "create") {
      sendMessage("GeometryManager", "CreateGeometry", selectedGeometry);
    }
  };

  const handleSelectObject = (objectId) => {
    setSelectedObjectId(objectId);
  };

  const handleRotateObject = () => {
    if (selectedObjectId) {
      sendMessage("GeometryManager", "RotateObject", selectedObjectId.toString());
    }
  };

  const handleDeleteObject = () => {
    if (selectedObjectId) {
      sendMessage("GeometryManager", "DeleteObject", selectedObjectId.toString());
      setSelectedObjectId(null);
    }
  };
  const handleScaleChange = (e) => {
    const scaleValue = parseFloat(e.target.value);
    const newScale = { x: scaleValue, y: scaleValue, z: scaleValue };
    if (selectedObjectId) {
        sendMessage("GeometryManager", "ChangeObjectScale", JSON.stringify(newScale ));
    }
};

const handleColorChange = (e) => {
    const color = e.target.value;
    if (selectedObjectId) {
        sendMessage("GeometryManager", "SetObjectColor", JSON.stringify(color ));
    }
};

  return (
    <>
      <Unity unityProvider={unityProvider} style={{ width: 800, height: 600 }}/>
      <button onClick={handleModeChange}>{mode === "edit" ? "Switch to Create Mode" : "Switch to Edit Mode"}</button>
      <select value={selectedGeometry} onChange={handleGeometrySelect}>
        <option value="Box">Box</option>
        <option value="Sphere">Sphere</option>
        <option value="Cylinder">Cylinder</option>
      </select>
      
        <div>
          <button onClick={handleRotateObject}>Rotate</button>
          <button onClick={handleDeleteObject}>Delete</button>
          
                
        </div>
        <div>
        <input type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
        <input type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
        <input type="number" value={depth} onChange={(e) => setDepth(e.target.value)} />
        <button onClick={handleScaleChange}>Change Scale</button>
      </div>
      <div>
        <input type="color" onChange={(e) => setColor({ ...color, ...hexToRgbA(e.target.value) })} />
        <button onClick={handleColorChange}>Change Color</button>
      </div>
    </>
  )
}

export default App
