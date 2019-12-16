import React, {useEffect, useState} from 'react'
import PostItem from '../Post-Item'
import { withRouter } from 'react-router-dom'
import './index.sass'
import {retrieveUserPosts} from '../../logic'
import Feedback from '../Feedback'


function Posts({history, userId}){

    const[render, setRender] = useState(true)
    const [error, setError] = useState()
    const { token } = sessionStorage
    const [postsList, setPostsList] = useState([])


    useEffect( () => {
        (async()=>{
            try{
                const {posts}= await retrieveUserPosts(token, userId)
                setPostsList(posts)
            }catch( error ){
                setError(error.message)
            }
        })()
        
    } , [setPostsList, render] )    

    function handleRender(){
        setRender(!render)
    }


    return  <section className="posts">  
         <ul >
        {postsList && postsList.map(post => <li className="post-list__item" key={post.post.id}> <PostItem post={post} onRender={handleRender} /></li>)}
        </ul> 
        {error && <Feedback text={error} />}  
        </section>
}
           
export default withRouter(Posts)