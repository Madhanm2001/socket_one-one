import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import ChatSpace from './component/ChatSpace';
import UserList from './component/UserList';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChatProvider, useChat } from './context/ChatContext';

function AppContent() {
  const { selectedUser } = useChat();

  return (
    window.innerWidth > 768 ? (
      <div style={{ display: 'flex', color: 'white' }}>
        <UserList />
        <ChatSpace />
      </div>
    ) : (
      <div>
        {selectedUser?._id ? <ChatSpace /> : <UserList />}
      </div>
    )
  );
}

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/auth");
    }
  }, []);

  return (
    <ChatProvider>
      <AppContent />  {/* ✅ useChat is now safely inside provider */}
    </ChatProvider>
  );
}

export default App;
