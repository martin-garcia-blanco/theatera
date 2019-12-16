import React, {useEffect, useState} from 'react'
import PostItem from '../Post-Item'
import { withRouter } from 'react-router-dom'
import './index.sass'
import {retrieveLatestPosts} from '../../logic'
import Feedback from '../Feedback'


function Posts({history}){

    const[render, setRender]= useState(true)

    const { token } = sessionStorage
    const [error, setError] = useState()
    const [postsList, setPostsList] = useState([])


    useEffect( () => {
        (async()=>{
            try{
                const {posts} = await retrieveLatestPosts(token)
                setPostsList(posts)
            }catch(error){
                setError(error.message)
            }
        })()
        
    } , [setPostsList, render] )    

    function handleRender(){
        setRender(!render)
    }


    return  <section className="posts">  
        <ul >
        {postsList.length>0 ?postsList.map(post => <li className="post-list__item" key={post.post.id}> <PostItem post={post} onRender={handleRender} /></li>):
        <section className="post">
        <p className="post__main">Add friends to see some post</p>
        </section>
    }
        </ul>
        {error && <Feedback text={error} />}  
        </section>
}
           
export default withRouter(Posts)