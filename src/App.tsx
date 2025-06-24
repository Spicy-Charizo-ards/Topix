import Dashboard from './components/Dashboard';
import './App.css';
import { useEffect } from 'react';
import { wsClient } from './wsClient';

function App() {
  //* this use effect is just to demo the wsClient module. It can be removed and migrated over to individual chat components
  // useEffect(()=>{
  //   wsClient();
  // }, [])

  return (
    <div>
      <Dashboard />
    </div>
  );
}

export default App;
