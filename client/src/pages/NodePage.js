import React, { useEffect, useState } from 'react';

function NodePage() {

  const [nodeData, setNodeData] = useState([{}]);
  useEffect(() => {
    fetch("http://localhost:5000/api/nodes").then(
      response => response.json()
    ).then(
      data => setNodeData(data)
    )
  }, []);

  return (
    <div>
          <h1>ALL NODES</h1>
          {(typeof nodeData === 'undefined') ? (
            <p>LOADING...</p>
          ): (
            <ul>
              {nodeData.map((node, i) => (
                //console.log(i, JSON.stringify(node));
                <li key={i}>{JSON.stringify(node)}</li>
              ))}
            </ul>
          )}
    </div>
  )
}

export default NodePage;