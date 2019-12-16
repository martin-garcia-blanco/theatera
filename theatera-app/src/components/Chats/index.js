import React, {useEffect, useState} from 'react'
import ChatItem from '../Chat-Item'
import { withRouter } from 'react-router-dom'
import './index.sass'
import { retrieveChats } from '../../logic'



function Chats({history}){

    const {token, id} = sessionStorage
    const [chats, setChats] = useState()
    let chatsRefresher
   

    useEffect(()=>{
        if (typeof chatsRefresher !== 'number' ) chatsRefresher = setInterval(()=>{
            (async()=>{
                try{
                    setChats(await retrieveChats(token))
                    
                } catch(message){
                    console.log(message)
                }
            })()
        }, 30000);
        
        (async()=>{
            try{
                setChats(await retrieveChats(token))
            } catch(message){
                console.log(message)
            }
        })()
        return ()=>{clearInterval(chatsRefresher)}
    },[setChats])

   
    return <div className="connections__container">   
       { chats && chats.length>0 && <ul >
            {chats.map(chat => <li  key={chat._id} > <ChatItem chatId={chat._id} account={chat.users[0]}/></li>)}
        </ul>}
        </div>
}
           
export default withRouter(Chats)