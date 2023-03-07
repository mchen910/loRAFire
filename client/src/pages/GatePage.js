import React, { useEffect, useState } from 'react';

const PORT = process.env.PORT;

function GatePage() {

  const [gateData, setGateData] = useState([{}]);
  useEffect(() => {
    fetch(`http://localhost:${PORT}/api/gateways`).then(
      response => response.json()
    ).then(
      data => setGateData(data)
    )
  }, []);

  return (
    <div>
          <h1>ALL GATEWAYS</h1>
          {(typeof gateData === 'undefined') ? (
            <p>LOADING...</p>
          ): (
            <ul>
              {gateData.map((gate, i) => (
                //console.log(i, JSON.stringify(node));
                <li key={i}>{JSON.stringify(gate)}</li>
              ))}
            </ul>
          )}
    </div>
  )
}

export default GatePage;