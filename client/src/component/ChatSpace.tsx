import { useEffect, useRef, useState } from 'react';
import '../App.css';
import doubleTick from '../assets/images/doubleTick.png';
import profile from '../assets/images/profileIMG.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import send from '../assets/images/send.png';
import { useChat } from '../context/ChatContext';
import { FaAngleDown } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaAngleLeft } from "react-icons/fa6";

function ChatSpace() {
  const { selectedUser, messages, setSelectedUser, sendMessage, deleteMessage, setFlag, setMessage, message } = useChat();
  const [delId, setDelId] = useState<string | null>('');
  const chatRef = useRef<HTMLDivElement | null>(null);
  const delRef = useRef<HTMLUListElement | null>(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
    const handleClickOutside = (event: MouseEvent) => {
      if (delRef.current && !delRef.current.contains(event.target as Node)) {
        setDelId(null);
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
      <div style={{ width: window.innerWidth > 768 ? '60%' : '100%', backgroundColor: '#161616', borderLeft: innerWidth > 768 ? '1px grey solid' : 'none', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'auto' }}>
        <p>Select a user to start chatting</p>
      </div>
    );
  }

  const handleSend = () => {
    if (message.trim()) {
      console.log("sendmsg", message);
      setFlag(prev => !prev)

      sendMessage(message);
      setMessage('');
    }
  };

  const deleteHandle = (id: any) => {
    console.log("sendmsg", message);
    deleteMessage(id);
    setDelId(null);
  };
  return (
    <div style={{ width: window.innerWidth > 768 ? '60%' : '100%', borderLeft: innerWidth > 768 ? '1px grey solid' : 'none', zIndex: 10 }}>
      <div id='navBar' style={{ width: '100%' }}>
        <div className="d-flex gap-3 py-2 px-3 sticky-top" style={{ backgroundColor: '#161616' }}>
          <div style={{ display: 'flex', gap: '20px' }}>
            {window.innerWidth <= 768 && <FaAngleLeft style={{ height: '25px', color: 'white', marginTop: '12px' }} onClick={() => { setSelectedUser('') }} />}
            <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%' }} alt="" />
          </div>
          <div style={{ marginTop: '2.5px' }}>
            <p className='text-white m-0' style={{ fontWeight: 600, fontSize: '16px' }}>{selectedUser.name}</p>
            <p className='m-0' style={{ color: 'grey', fontSize: '13px' }}>Chat with {selectedUser.name}</p>
          </div>
        </div>
        <div id='chatSpace'>
          <div id="chatContain" ref={chatRef}>
            {messages
              .map((data: any, i: any) => (
                <div key={i} style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: (localStorage.getItem('LoginId') == data.fromId ? 'flex-end' : 'flex-start') }}>
                  <div className="msgContainer" style={{ color: 'white', backgroundColor: (localStorage.getItem('LoginId') == data.fromId ? 'rgba(0, 48, 29, 1)' : '#161616'), padding: '5px 10px', marginTop: '10px', borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', fontSize: '15px', gap: '5px' }}>
                    <div style={{ display: 'flex', position: 'relative' }} >
                      <div style={{ wordWrap: 'break-word', display: 'flex', flexWrap: 'wrap', wordBreak: "break-all", paddingRight: '70px' }}>{data.msg}</div>

                      {localStorage.getItem("LoginId") === data.fromId && (
                        <div style={{ position: "relative" }}>
                          <FaAngleDown
                            onClick={() =>
                              setDelId((prev) => (prev === data._id ? null : data._id))
                            }
                            id="dowArr"
                            style={{ cursor: "pointer" }}
                          />

                          {delId === data._id && (
                            <ul
                              className="deleteModel"
                              ref={delRef}
                              onClick={() => deleteHandle(data._id)}
                            >
                              <li>Delete</li>
                              <span>
                                <RiDeleteBinLine style={{ marginTop: "3px", cursor: "pointer" }} />
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
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div id='InputWrapTop'>
            <div id='inputBoxWrap'>
              <div id='inputBox' style={{ position: 'relative' }}>
                <input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type message"
                  style={{
                    width: window.innerWidth > 768 ? "59.7%" : "100%",
                  }}
                  className='py-2 rounded-5 inputBox'
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                />
                {message && <img src={send} onClick={handleSend} style={{ position: 'absolute', right: window.innerWidth <= 768 ? '1%' : "40.5%", bottom: '4px' }} alt="" id='sendButton' />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatSpace;
