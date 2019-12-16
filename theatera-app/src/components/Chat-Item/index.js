import React, { useState } from 'react'
import { withRouter } from 'react-router-dom'
import './index.sass'
import {createChat} from '../../logic'
import Feedback from '../Feedback'

function ChatItem({history, account:{_id:accountId, name, image, introduction}, chatId}){

    const {token} = sessionStorage
    const [error, setError] = useState()

    function onGoToUser(e){
        e.preventDefault()
        history.push(`/users/${accountId}`)  
        
    }

    async function handleChat(e){
         e.preventDefault()
        try{
            e.stopPropagation()
            const chatId = await createChat(token, accountId)
            history.push(`/chat/${chatId}`)
        }catch(error){
            setError(error.message)
        }
    }

    function handleGoChat(e){
        e.preventDefault()
        history.push(`/chat/${chatId}`)
    }

    return  <div className="acc-resume" onClick={handleGoChat} >
                <img className=" acc-resume__image" src={image} alt=" profile" onClick={onGoToUser}/>
                <div className=" acc-resume__info info">
                    <p className=" info__username ">{name}</p>
                    <p className=" info__description ">{introduction}</p>
                </div>

                <form className="acc-resume__form " action="">
                    <button className="button">
                        <i className="material-icons">remove_circle_outline</i>
                    </button>
                    <button className="button" onClick={handleChat}>
                            <i className="material-icons">comment</i>
                    </button>
                </form>
                {error && <Feedback text={error} />}
            </div>
}


export default withRouter(ChatItem)