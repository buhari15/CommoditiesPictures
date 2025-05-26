'use client';
import { useState } from 'react';

export default function Home() {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch('http://localhost:8000/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: query }),
    });
    const data = await res.json();
    setResponse(data.response);
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>LangChain Assistant</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ width: '80%', padding: '10px' }}
          placeholder="Ask something..."
        />
        <button type="submit" style={{ padding: '10px 20px' }}>Send</button>
      </form>
      <div style={{ marginTop: 20 }}>
        <strong>Response:</strong>
        <pre>{response}</pre>
      </div>
    </main>
  );
}
