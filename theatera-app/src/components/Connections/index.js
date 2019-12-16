import React, {useEffect, useState} from 'react'
import AccountResume from '../Account-Resume'
import { withRouter } from 'react-router-dom'
import './index.sass'
import { retrieveConnections, removeConnection } from '../../logic'
import Feedback from '../Feedback'



function Connections({history}){

    const {token} = sessionStorage
    const [connections, setConnections] = useState()
    const [error, setError] = useState() 
    const [render, setRender]= useState(true)

    useEffect(()=>{
        (async()=>{
            try{
                setConnections(await retrieveConnections(token))
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
            {connections.length>0 ? connections.map(account => <li  key={account.id} > <AccountResume connections={connections}  account={account} onRemoveConection={handleRemoveConection}/></li>) 
            :
            <section className="post">
            <p className="post__main">Search some user with the searchBar to add some friend</p>
            </section>}
        </ul>
         }
            {error && <Feedback text={error} />}               
    </div>
}
           
export default withRouter(Connections)