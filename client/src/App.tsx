// import './App.css'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import ChatSpace from './component/ChatSpace';
// import UserList from './component/UserList';
// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// function App() {
//   const navigate=useNavigate()
//   useEffect(() => {
//       if (!localStorage.getItem("token")) {
//         navigate("/auth");
//       }
//     }, []);
//   return (
//     <div style={{display:'flex',color:'white'}}> 
//     <UserList/>
//     <ChatSpace/>
//     </div>
//   );
// }

// export default App;

import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatSpace from './component/ChatSpace';
import UserList from './component/UserList';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatProvider } from './context/ChatContext';

function App() {
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, []);

  return (
    <ChatProvider>
      <div style={{ display: 'flex', color: 'white' }}>
        <UserList />
        <ChatSpace />
      </div>
    </ChatProvider>
  );
}

export default App;
