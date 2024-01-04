import { useState, useEffect } from 'react'
import './App.css'

function App() {

  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('http://localhost:8000/test-api/')
        .then(response => response.json())
        .then(data => { 
          console.log(data)
          setData(data);
        })
        .catch(error => console.error('Error:', error));
}, []);

  return (
    <div>
        {data ? (
            <div>
                <p>{data.message}</p>
            </div>
        ) : (
            <p>Loading or Error...</p>
        )}
    </div>
  )
}

export default App
