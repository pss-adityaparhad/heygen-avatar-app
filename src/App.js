import React from 'react';
import HeyGenAvatar from './components/HeyGenAvatar';
import styles from './styles/App.module.css';

function App() {
  return (
    <div className={styles.container}>
      {/* <h1 className={styles.heading}>HeyGen Speaking Avatar App</h1> */}
      <HeyGenAvatar />
    </div>
  );
}

export default App;
