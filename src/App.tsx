import React from 'react';
import logo from './logo.svg';
import './App.css';
import ChatBubble from './chat.svg'
import UChatWidget from './charComponentSrc/widget';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <UChatWidget wsUri="http://localhost:6001?company=zeejaydev" icon={ChatBubble} />
    </div>
  );
}

export default App;
