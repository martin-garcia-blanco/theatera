import React, {useState} from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
import { toggleLikePost } from '../../logic'
import Feedback from '../Feedback'
import moment from 'moment'


function PostItem({history, post:{post:{body,comments,date,likes,id:postId}, user:{image, introduction,name, id:userId}}, onRender}){

    const {token} = sessionStorage
    const [error, setError] = useState()
 
    function onGoAccount(e){
        e.stopPropagation()
        history.push(`/users/${userId}`)
    }


    function handleGoPostDetail(e){
        e.preventDefault()
        history.push(`/posts/${postId}`)
    }

    async function  handleGiveLike(e){
        e.preventDefault()
        try{
            await toggleLikePost(postId, token)
            onRender()
         } catch(error){
            setError(error.message)
        }
    }
    

return <section className="post" id={postId}>
<div className="post__header" onClick={onGoAccount}>
    <img className="post-image" src={image} alt="profile " />
    <div className="header-info">
        <p className="header-item header__user-username">{name}</p>
        <p className="header-item header__user-introduction">{introduction}</p>
        <p className="header-item header__date">{moment(date).format("D/MM/YYYY")}</p>
    </div>
</div>

<p className="post__main">{body}</p>

<div className="post__interactions">
    <p className="post-interactions__likes">{likes.length} likes</p>
    <p className="post-interactions__comments">{comments.length} comments</p>
</div>

<form action=" " className="post__nav " onSubmit={function(event){
    event.preventDefault()
}}>
    <button className="post-button "><i className="material-icons"  onClick={handleGiveLike}>thumb_up_alt</i></button>
    <button className="post-button "><i className="material-icons " onClick={handleGoPostDetail}>comment</i></button>
{/*     <button className="post-button "><i className="material-icons " onClick={}>share</i></button>
 */}</form>
     {error && <Feedback text={error} />}               
</section>
}

export default withRouter(PostItem)
