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
//     const usersArr=[{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'},{userId:23,name:'maddy',recentMessage:'super bro',time:'08.08 PM'}]
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


import React, { useEffect, useState } from 'react';
import profile from '../assets/images/IMG_7885.JPG';
import axiosInstance from '../settings/axiosInstance';
import { URL } from '../settings/apiUrl';
import { useChat } from '../context/ChatContext';

const UserList = () => {
  const [userList, setUserList] = useState<any[]>([]);
  const { setSelectedUser, selectedUser } = useChat();

  useEffect(() => {
    axiosInstance.get(URL.user.getUserList).then((res: any) => {
        console.log("resssss", res.data.userList)
      setUserList(res.data.userList || []);
      localStorage.setItem('LoginId',res.data.loginUserId)
    });
  }, []);

  return (
    <div style={{ width: '30%', minWidth: '250px' }}>
      <section id='listNavBar'>
        <h4>WhatsApp</h4>
        <div id='threeDot'>
          <h3 className='dot'>.</h3>
          <h3 className='dot'>.</h3>
          <h3 className='dot'>.</h3>
        </div>
      </section>
      <section id='userList'>
        <div id='userListContain'>
          {userList.map((user, id) => (
            <div
              id='user'
              key={id}
              onClick={() => setSelectedUser(user.user)}
              style={{ background: selectedUser?._id === user.user._id ? '#333' : 'transparent', cursor: 'pointer',borderRadius:'10px' }}
            >
              <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%' }} alt="profile img" />
                <div style={{ marginTop: '12px' }}>
                  <h5>{user.user.name}</h5>
                  <p>{user.user.recentMessage || ""}</p>
                </div>
              </div>
              <p style={{ marginTop: '12px' }}>{user.user.time || ""}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserList;
