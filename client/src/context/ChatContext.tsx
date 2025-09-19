// import React, { createContext, useContext, useEffect, useState } from "react";
// import { io, Socket } from "socket.io-client";

// interface Message {
//   msg: string;
//   sender: string;
//   userId?: string;
// }

// interface ChatContextType {
//   socket: Socket | null;
//   selectedUser: any;
//   setSelectedUser: (user: any) => void;
//   messages: Message[];
//   setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
//   sendMessage: (text: string) => void;
// }

// const ChatContext = createContext<ChatContextType | undefined>(undefined);

// export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [socket, setSocket] = useState<Socket | null>(null);
//   const [selectedUser, setSelectedUser] = useState<any>(null);
//   const [messages, setMessages] = useState<Message[]>([]);

//   useEffect(() => {
//     const newSocket = io("http://localhost:4000/socket_one-one", {
//       auth: { token: localStorage.getItem("token") },
//     });
//     setSocket(newSocket);

//     newSocket.on("receive_message", (data: Message) => {
//       setMessages((prev) => [...prev, { ...data, sender: "server" }]);
//     });

//     return () => {
//       newSocket.emit("disconnect_user"); // custom event to backend
//       newSocket.disconnect();
//     };
//   }, []);

//   const sendMessage = (text: string) => {
//     if (socket && selectedUser && text.trim()) {
//       const payload = { to: selectedUser._id, msg: text };
//       socket.emit("send_message", payload);
//       setMessages((prev) => [...prev, { msg: text, sender: "client", userId: selectedUser._id }]);
//     }
//   };

//   return (
//     <ChatContext.Provider value={{ socket, selectedUser, setSelectedUser, messages, setMessages, sendMessage }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => {
//   const context = useContext(ChatContext);
//   if (!context) throw new Error("useChat must be used within ChatProvider");
//   return context;
// };


import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import axiosInstance from "../settings/axiosInstance";
import { URL } from "../settings/apiUrl";

interface Message {
  msg?: string;
  fromId?: any;
  toId?:string;
  chat?:string;
  _id?:string,
  time:string
}

interface ChatContextType {
  socket: Socket | null;
  selectedUser: any;
  setSelectedUser: (user: any) => void;
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (text: string) => void;
  deleteMessage: (id: string) => void;
  setFlag:React.Dispatch<React.SetStateAction<boolean>>;
  flag:boolean;
  setMessage:React.Dispatch<React.SetStateAction<string>>;
  message: any ;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loginUser, setLoginUser] = useState('');
  const [message,setMessage] = useState('')
  const[flag,setFlag]=useState(true)

  useEffect(() => {
    const newSocket = io("http://localhost:4000/socket_one-one", {
      auth: { token: localStorage.getItem("token") },
    });
    setSocket(newSocket);
    const loginUser:any=localStorage.getItem('LoginId') ||''
    setLoginUser(loginUser)

    newSocket.on("receive_message", (data: Message) => {
      console.log(data,"rece");
      if (data.fromId == selectedUser?._id) {
        console.log('loghhh',data);
        setMessages((prev) => [...prev, { fromId:data.fromId,todId:data.toId,msg:data.chat,_id:data._id,time:data.time}]);
      }
    });

    newSocket.on("message_deleted", (data: Message) => {
      console.log(data,"rece");
      if (data.fromId == selectedUser?._id) {
        console.log('loghhh',data);
        setMessages((prev) => prev.filter((msg) => msg._id !== data._id));
      }
    });

    return () => {
      newSocket.emit("disconnect_user");
      newSocket.disconnect();
    };
  }, [selectedUser]);

  // 🔹 Load conversation history when selected user changes
  useEffect(() => {
    const fetchConversations = async () => {
      if (!selectedUser) return;
      try {
        const res = await axiosInstance.get(`${URL.conversation.getConversation}/${selectedUser._id}`);
        console.log("resva", res.data)
        const history = res.data.data.conversation.map((m: any) => ({
          msg: m?.chat || '',
          fromId: m.fromId,
          toId: m.toId,
          _id:m._id,
          time:m.time
        }));
        setMessages(history);
      } catch (err) {
        console.error("Failed to fetch conversation", err);
      }
    };

    fetchConversations();
  }, [selectedUser]);

  const sendMessage = (text: string) => {
  if (socket && selectedUser && text.trim()) {
    socket.emit(
      "send_private_message",
      selectedUser._id,
      text,
      (response: any) => {
        if (response?.error) {
          console.error("Message error:", response.error);
        } else {
          console.log("Message saved:", response.message);
        }
      }
    );

    setMessages((prev) => [
      ...prev,
      { msg: text, fromId:localStorage.getItem('LoginId'), toId: selectedUser._id,time:Date() }
    ]);
  }
};

  const deleteMessage = (id: string) => {
  if (socket) {
    socket.emit(
      "delete_private_message",
      id,
      selectedUser._id,
      (response: any) => {
        if (response?.error) {
          console.error("Message error:", response.error);
        } else {
          console.log("Message deleted:", response.message);
        }
      }
    );

    setMessages((prev) => prev.filter((msg) => msg._id !== id));

    
  }
};
console.log(loginUser,'loginUser');




  return (
    <ChatContext.Provider value={{ socket, setMessage,message, selectedUser, setSelectedUser, setFlag, flag, messages, setMessages, sendMessage, deleteMessage}}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) throw new Error("useChat must be used within ChatProvider");
  return context;
};
