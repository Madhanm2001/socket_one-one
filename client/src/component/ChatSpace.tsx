// import { useEffect, useState } from 'react';
// import { io } from 'socket.io-client';
// import '../App.css'
// import doubleTick from '../assets/images/doubleTick.png'
// import profile from '../assets/images/IMG_7885.JPG'
// import 'bootstrap/dist/css/bootstrap.min.css';
// import send from '../assets/images/send.png'

// const socket = io("http://localhost:4000/socket_one-one", {
//   auth: { token: localStorage.getItem("token") },
// });

// function ChatSpace() {
//   const [message, setMessage] = useState('');
//   const [chat, setChat] = useState([{ msg: '', sender: '' }]);

//   useEffect(() => {

//     const map=new Map()

//     const SET=map.set('hsjhdjsd',"sashhjas")
//     console.log(SET);



//     const handleReceiveMessage = (data: string) => {
//       displayMessage(data, 'server');
//     };

//     socket.on('receive_message', handleReceiveMessage);

//     const chatDiv = document.querySelector('#chatContain');
//     if (chatDiv){ 
//       chatDiv.scrollTop = chatDiv.scrollHeight;
//     }
//     return () => {
//       socket.off('receive_message', handleReceiveMessage);
//     };
//   }, [chat]);

//   const displayMessage = (msg: string, sender: string) => {
//     const CurrentMsg = { msg, sender };
//     setChat(prev => [...prev, CurrentMsg]);
//   };

//   const sendMessage = () => {
//     if (message.trim()) {
//       socket.emit('send_message', message);
//       displayMessage(message, 'client')
//       setMessage('');
//       console.log(chat);
//     }
//   };

//   return (
//     <div style={{width:'80%',borderLeft:'1px grey solid',zIndex:10}}>

//       {/* <img src={bgImage} alt="" className='vh-100 d-none d-md-block' style={{borderLeft:'.5px white solid',borderRight:'.5px white solid'}}/> */}
//       <div id='navBar' style={{ width: '100%' }}>

//         <div className="d-flex gap-3 py-2 px-3 sticky-top" style={{ backgroundColor: '#161616' }}>
//           <div>
//             <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%', cursor: 'pointer' }} alt="" />
//           </div>
//           <div style={{marginTop:'2.5px'}}>
//             <p className='text-white m-0' style={{ fontWeight: 600,fontSize:'16px' }}>Mr.Maddy (you)</p>
//             <p className='m-0' style={{ color: 'grey', fontSize: '13px' }}>Message Yourself</p>
//           </div>
//         </div>

//         <div id='chatSpace'>
// <div id="chatContain">
//   {chat.length > 1 && chat.map((data, i) => (
//             (data.msg && <div style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: (data.sender == 'client' ? 'flex-end' : 'flex-start') }}>
//               <div key={i} style={{ color: 'white', backgroundColor: (data.sender == 'client' ? 'rgb(0, 116, 71)' : '#161616'), padding: '5px 10px', borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', fontSize: '15px', gap: '5px' }}>
//                 <div style={{ wordWrap: 'break-word', paddingRight: '70px' }}>{data.msg}</div>
//                 <div style={{ display: 'flex', justifyContent: 'flex-end' ,gap:'5px'}}>
//                   <div id='Time'>10:30 AM</div>
//                   <img src={doubleTick} id='doubleTick' alt="" />
//                 </div>
//               </div>
//             </div>)
//           ))}

// </div>



// <div id='InputWrapTop'>
// <div id='inputBoxWrap'>
//             <div id='inputBox' style={{position:'relative'}}>
//               <input
//                 value={message}
//                 onChange={(e) => setMessage(e.target.value)}
//                 placeholder="Type message"
//                 className='py-2 rounded-5 inputBox'
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter') {
//                     sendMessage();
//                   }
//                 }}
//               />
//               {/* <button className='btn btn-primary' onClick={sendMessage}>Send</button> */}
//               {message&&<img src={send} onClick={sendMessage} style={{position:'absolute',left:'68.5%',bottom:'4px'}} alt="" id='sendButton' />}
//             </div>
//           </div>
// </div>




//         </div>

//       </div>
//     </div>
//   );
// }

// export default ChatSpace;


import { useEffect, useRef, useState } from 'react';
import '../App.css';
import doubleTick from '../assets/images/doubleTick.png';
import profile from '../assets/images/IMG_7885.JPG';
import 'bootstrap/dist/css/bootstrap.min.css';
import send from '../assets/images/send.png';
import { useChat } from '../context/ChatContext';
import { FaAngleDown } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaAngleLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

function ChatSpace() {
  const { selectedUser, messages,setSelectedUser, sendMessage, deleteMessage,setFlag } = useChat();
  const [message, setMessage] = useState('');
  const [delId, setDelId] = useState('');
  const [deleteModel, setDeleteModel] = useState(false);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const delRef = useRef<HTMLUListElement | null>(null);
  const navigate=useNavigate()

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    const handleClickOutside = (event: MouseEvent) => {
    if (delRef.current && !delRef.current.contains(event.target as Node)) {
      setDeleteModel(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
    
  }, [messages]);

  console.log("mes", messages)

  if (!selectedUser) {
    return (
      <div style={{ width: window.innerWidth>992?'80%':'100%', borderLeft: '1px grey solid', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      console.log("sendmsg", message);
      setFlag(prev=>!prev)

      sendMessage(message);
      setMessage('');
    }
  };

  const deleteHandle = (id: any) => {
    console.log("sendmsg", message);
    deleteMessage(id);
    setDeleteModel(false)
  };
  return (
    <div style={{ width:window.innerWidth>992?'80%':'100%', borderLeft: '1px grey solid', zIndex: 10 }}>
      <div id='navBar' style={{ width: '100%' }}>
        <div className="d-flex gap-3 py-2 px-3 sticky-top" style={{ backgroundColor: '#161616' }}>
          <div style={{display:'flex',gap:'10px'}}>
            {window.innerWidth<=992&&<FaAngleLeft style={{height:'25px',color:'white',marginTop:'12px'}} onClick={()=>{setSelectedUser('')}}/>}
            <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%' }} alt="" />
          </div>
          <div style={{ marginTop: '2.5px' }}>
            <p className='text-white m-0' style={{ fontWeight: 600, fontSize: '16px' }}>{selectedUser.name}</p>
            <p className='m-0' style={{ color: 'grey', fontSize: '13px' }}>Chat with {selectedUser.name}</p>
          </div>
        </div>
        <div id='chatSpace'>
          <div id="chatContain" ref={chatRef}>
            {/* {messages
              .filter(m => m.userId === selectedUser._id || !m.userId) // only relevant messages
              .map((data, i) => (
                data.msg && (
                  <div key={i} style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: (data.sender === 'client' ? 'flex-end' : 'flex-start') }}>
                    <div style={{ color: 'white', backgroundColor: (data.sender === 'client' ? 'rgb(0, 116, 71)' : '#161616'), padding: '5px 10px', borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', fontSize: '15px', gap: '5px' }}>
                      <div style={{ wordWrap: 'break-word', paddingRight: '70px' }}>{data.msg}</div>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                        <div id='Time'>10:30 AM</div>
                        <img src={doubleTick} id='doubleTick' alt="" />
                      </div>
                    </div>
                  </div>
                )
              ))} */}
            {messages
              // .filter(m => m.userId === selectedUser._id) 
              .map((data: any, i: any) => (
                <div key={i} style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: (localStorage.getItem('LoginId') == data.fromId ? 'flex-end' : 'flex-start') }}>
                  <div className="msgContainer" style={{ color: 'white', backgroundColor: (localStorage.getItem('LoginId') == data.fromId ? 'rgba(0, 48, 29, 1)' : '#161616'), padding: '5px 10px',marginTop:'10px', borderRadius: '10px', maxWidth: '80%', wordWrap:'break-word', fontSize: '15px', gap: '5px' }}>
                    <div style={{ display: 'flex', position: 'relative' }} >
                      <div style={{ wordWrap: 'break-word',display:'flex',flexWrap:'wrap',wordBreak:"break-all", paddingRight: '70px' }}>{data.msg}</div>

                      {localStorage.getItem('LoginId') === data.fromId && (
  <div style={{ position: 'relative' }}>
    <FaAngleDown 
      onClick={() => setDelId(prev => prev === data._id ? null : data._id)} 
      id="dowArr" 
    />

    {delId === data._id && (
      <ul className="deleteModel" ref={delRef} onClick={() => deleteHandle(data._id)}>
        <li>Delete</li>
        <span>
          <RiDeleteBinLine style={{ marginTop: '3px', cursor: 'pointer' }} />
        </span>
      </ul>
    )}
  </div>
)}

                    </div>


                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '5px' }}>
                      <div id='Time'>{new Date(data?.time).toLocaleTimeString([], { 
   hour: '2-digit', 
   minute: '2-digit' 
})}</div>
                      <img src={doubleTick} id='doubleTick' alt="" />
                      {/* {localStorage.getItem('LoginId')==data.fromId&&<FaAngleDown onClick={()=>deleteHandle(data._id)}/>} */}


                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div id='InputWrapTop'>
            <div id='inputBoxWrap'>
              <div id='inputBox' style={{ position: 'relative',left:window.innerWidth>1100?'2%':'0'}}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message"
                  style={{width:window.innerWidth>992?'65%':'100%'}}
                  className='py-2 rounded-5 inputBox'
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                {message && <img src={send} onClick={handleSend} style={{ position: 'absolute',right:window.innerWidth<=992?'1%':"35.5%", bottom: '4px' }} alt="" id='sendButton' />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSpace;
