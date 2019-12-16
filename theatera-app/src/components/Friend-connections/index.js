import React, {useEffect, useState} from 'react'
import AccountResume from '../Account-Resume'
import { withRouter } from 'react-router-dom'
import './index.sass'
import { retrieveFriendConnections, removeConnection } from '../../logic'
import Feedback from '../Feedback'



function FriendConnections({history, userId}){

    const {token} = sessionStorage
    const [connections, setConnections] = useState()
    const [error, setError] = useState() 
    const [render, setRender]= useState(true)

    useEffect(()=>{
        (async()=>{
            try{
                setConnections(await retrieveFriendConnections(token, userId))
            } catch(error){
                setError(error.message)
            }
        })()
    },[setConnections, render])

    async function handleRemoveConection(userId){
        try{
            await removeConnection(token, userId)
            setRender(!render)
        } catch(error){
            setError(error.message)
        }
    }


   
    return <div className="connections__container">   
       { connections &&  <ul >
            {connections.map(account => <li  key={account.id} > <AccountResume connections={connections}  account={account} onRemoveConection={handleRemoveConection} fromFriends={true}/></li>)}
        </ul>
         }
            {error && <Feedback text={error} />}               
    </div>
}
           
export default withRouter(FriendConnections)