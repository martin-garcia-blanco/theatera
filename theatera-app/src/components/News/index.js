import React, {useEffect, useState} from 'react'
import NewsItem from '../NewsItem'
import { withRouter } from 'react-router-dom'
import './index.sass'
import { retrieveNews } from '../../logic'
import Feedback from '../Feedback'
import {removeNews, checkFriendRequest} from '../../logic'





function News({history}){

    const {token} = sessionStorage
    const [news, setNews] = useState()
    const [error, setError] = useState() 
    const [render, setRender] = useState(true)
    let connectionsRefresher
   

    useEffect(()=>{
        if (typeof connectionsRefresher !== 'number' ) connectionsRefresher = setInterval(()=>{
            (async()=>{
                try{
                    setNews(await retrieveNews(token))
                } catch(error){
                    setError(error.message)
                }
            })()
        }, 1000);
        (async()=>{
            try{
                setNews(await retrieveNews(token))
            } catch(error){
                setError(error.message)
            }
        })()
        return ()=>{clearInterval(connectionsRefresher)}
    },[setNews,setError])


    async function handleAddContact(userId, newsId){
        try{
            await checkFriendRequest(token, userId)
            await removeNews(token, newsId)
            setRender(!render)
        } catch(error){
            setError(error.message)
        }

    }

    async function handleDeniedFriendRequest(newsId){
        try{
            await removeNews(token, newsId)
            setRender(!render)
        } catch(error){
            setError(error.message)
        }
    }

   
    return <div className="connections__container">   
       { news &&  <ul >
            {news.length>0 ?news.map(element => <li  key={element._id} > <NewsItem news={element}  onAddContact={handleAddContact} onDeniedFriendRequest={handleDeniedFriendRequest} /></li>)
            :
            <section className="post">
            <p className="post__main">still no notifications
</p>
            </section>}
        </ul>
         }
            {error && <Feedback text={error} />}               
    </div>
}
           
export default withRouter(News)