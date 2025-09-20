// import React, { useEffect, useState } from 'react'
// import profile from '../assets/images/IMG_7885.JPG'
// import axios from 'axios'
// import axiosInstance from '../settings/axiosInstance'
// import { URL } from '../settings/apiUrl'

// const UserList = () => {

//     useEffect(()=>{
//     axiosInstance.get(URL.user.getUserList).then((data:any)=>{
//          setUserList(data)
//          console.log(data,"data")
//     })
//     },[])

//     const[userList,setUserList]=useState([])
//     const usersArr=[{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'}]
//   return (
//     <div style={{width:'30%',minWidth:'250px'}}>
//         <section id='listNavBar'>
//             <h4>WhatsApp</h4>
//             <div id='threeDot'>
//                 <h3 className='dot'>.</h3>
//                 <h3 className='dot'>.</h3>
//                 <h3 className='dot'>.</h3>
//             </div>
//         </section>
//         <section id='userList'>

//             <div id='userListContain'>

//                 {usersArr.map((data,id)=>{
//                 return(
//                    <div id='user'>
//                   <div style={{display:'flex',gap:'15px',alignItems:'center'}}>
//                     <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%', cursor: 'pointer'}} alt="profile img" />
//                     <div style={{marginTop:'12px'}}>
//                         <h5>{data.name}</h5>
//                         <p>{data.recentMessage}</p>
//                     </div>
//                     </div>
//                     <p style={{marginTop:'12px'}}>{data.time}</p>
//                    </div>
                   
//                 )
//             })}

//             </div>

            
//         </section>
//     </div>
//   )
// }

// export default UserList


import { useEffect, useRef, useState } from 'react';
import profile from '../assets/images/IMG_7885.JPG';
import axiosInstance from '../settings/axiosInstance';
import { URL } from '../settings/apiUrl';
import { useChat } from '../context/ChatContext';
import { IoIosLogOut } from "react-icons/io";
import { useNavigate } from 'react-router-dom';

const UserList = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const [logOutModel, setLogOutModel] = useState<boolean>();
  const { setSelectedUser, selectedUser,flag,setMessage,setMessages } = useChat();
  const logoutRef = useRef<HTMLDivElement>(null);
  const navigate=useNavigate()

  useEffect(() => {
    axiosInstance.get(URL.user.getUserList).then((res: any) => {
        console.log("resssss",selectedUser, res.data.userList)
      setUserList(res.data.userList || []);
      localStorage.setItem('LoginId',res.data.loginUserId)
    });
    const handleClickOutside = (event: MouseEvent) => {
    if (logoutRef.current && !logoutRef.current.contains(event.target as Node)) {
      setLogOutModel(false); 
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
  }, [flag]);

  console.log(userList,"userList");
  
const onClickSelectedUser = (user: any) => {
  setSelectedUser(user);
  setMessage('')
  setMessages([])
};

  return (
    <div style={{ width: window.innerWidth<=768?'100%':'30%', minWidth: '350px' }}>
      <section id='listNavBar'>
        <h4>WhatsApp</h4>
        <div id='threeDot' ref={logoutRef}  style={{position:'relative'}} onClick={()=>setLogOutModel(prev=>!prev)}>
          <h3 className='dot'>.</h3>
          <h3 className='dot'>.</h3>
          <h3 className='dot'>.</h3>

          {logOutModel && (
  <ul className="deleteModel" onClick={() => {localStorage.removeItem('token'),navigate('/Auth')}}>
    <span>
      <IoIosLogOut
        style={{ marginTop: "3px",height:'20px', cursor: "pointer" }}
      />
    </span>
    <li style={{fontWeight:700}}>Logout</li>
    
  </ul>
)}
        </div>
      </section>
      <section id='userList'>
        <div id='userListContain'>
          {userList.map((user, id) => (
            <div
              id='user'
              key={id}
              onClick={() => {onClickSelectedUser(user.user)}}
              style={{ background: selectedUser?._id === user.user._id ? '#333' : 'transparent', cursor: 'pointer',borderRadius:'10px' }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                
  <img 
    src={profile} 
    style={{ height: '50px', width: '50px', borderRadius: '100%' }} 
    alt="profile img" 
  />
  <div style={{ marginTop: '12px' }}>
    <h5 className="truncate">{user.user.name}</h5>
    <p className="truncate" style={{ color: 'white' }}>
      {user?.recentMessage?.chat ? (
    <>
      {user?.recentMessage?.fromId === localStorage.getItem("LoginId")
        ? "you"
        : user?.user?.name}
      : {user?.recentMessage?.chat}
    </>
  ) : (
    ""
  )}
    </p>
  </div>
</div>
             { user?.recentMessage?.time&&<p style={{ marginTop: '12px',color:'white' }}>{new Date(user?.recentMessage?.time).toLocaleTimeString([], { 
   hour: '2-digit', 
   minute: '2-digit' 
})}</p>}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserList;
