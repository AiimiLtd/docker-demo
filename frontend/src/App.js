import React, { useState, useEffect } from 'react';

function App({ initialData }) {
  const [message, setMessage] = useState(initialData || 'Loading...');
  const [serverTime, setServerTime] = useState('');

  useEffect(() => {
    if (!initialData) {
      fetch('/api/data')
        .then((res) => res.json())
        .then((data) => setMessage(data.message))
        .catch(err => console.error("Failed to fetch initial data:", err));
    }

    fetch('/api/time')
      .then((res) => res.json())
      .then((data) => setServerTime(data.time))
      .catch(err => console.error("Failed to fetch time:", err));
  }, [initialData]);

  return (
    <div>
      <h1>Hello from React!</h1>
      <p>Message from server: {message}</p>
      <p>Current Server Time: {serverTime}</p>
    </div>
  );
}

export default App;