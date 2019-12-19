import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './index.sass'
import Feedback from '../Feedback'
import {createChat, checkFriendRequest} from '../../logic'

function AccountResume({history, account:{id:accountId, name, image, introduction}, connections,fromFriends, onRemoveConection}){

    const {token, id} = sessionStorage
    const [error, setError]= useState()
    const [connected, setConnected] = useState(false)
    let friendRequest


    useEffect(()=>{
        connections && connections.forEach(con=>{
            if(con.id===accountId) setConnected(true)
        })
    })

    function handleGoToUser(e){
        e.preventDefault()
        history.push(`/users/${accountId}`)  
    }

    async function handleChat(e){     
        try{
            e.stopPropagation()
            const chatId = await createChat(token, accountId)
            history.push(`/chat/${chatId}`)
        }catch(error){
            setError(error.message)
        }
    }

    async function handleSendFriendRequest(e){
        e.preventDefault()
        try{
            friendRequest = await checkFriendRequest(token, accountId)
        } catch(error){
            setError(error.message)
        }
    }

    async function handleRemoveFriend(e){
        try{
            e.preventDefault()
            onRemoveConection(accountId)
        } catch(error){
            setError(error.message)
        }
    }

    return  <div className="acc-resume">
                <img className=" acc-resume__image" src={image} alt="profile"  onClick={handleGoToUser}/>
                <div className=" acc-resume__info info" onClick={handleGoToUser}>
                    <p className=" info__username ">{name}</p>
                    <p className=" info__description ">{introduction}</p>
                </div>
                {!fromFriends &&
                 <form className="acc-resume__form " action="">
                    {connected ?
                    <button className="button" onClick={handleRemoveFriend}>
                    <i className="material-icons">remove_circle_outline</i>
                </button>:
                   <button className="button" onClick={handleSendFriendRequest}>
                   <i className="material-icons">add_circle_outline</i>
               </button>
                    }
                    <button className="button" onClick={handleChat}>
                            <i className="material-icons">comment</i>
                    </button>
                </form>}
                {error && <Feedback text={error} />}
            </div>
}


export default withRouter(AccountResume)