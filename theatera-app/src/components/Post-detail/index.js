import React, { useEffect, useState } from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
import {retrievePost, toggleLikePost, sendComment, retrieveUser} from '../../logic'
import CommentItem from '../Comment-Item'
import Feedback from '../Feedback'
import moment from 'moment'


function PostDetail({history, postId}){
    
    const [ owner, setOwner ] = useState()
    const [ user, setUser ] = useState(true)
    const { token } = sessionStorage
    const [error,setError] = useState()
    const [post, setPost] = useState()
    let postData
    const {id} = sessionStorage
    let messageText = React.createRef()
    let refresher
    
    
    useEffect(()=>{
        if (typeof refresher !== 'number' ) refresher = setInterval(()=>{
            (async()=>{
                try{
                    postData = await retrievePost(token, postId) 
                    setPost(postData.post)
                    setUser(postData.user)
                } catch(error){
                    setError(error.message)
                }
            })()
        }, 1000);

        (async()=>{
            try{
                postData = await retrievePost(token, postId) 
                setPost(postData.post)
                setUser(postData.user)
                setOwner(await retrieveUser(token))
            } catch(message){
                setError(error.message)
            }
        })()

        return () => { clearInterval(refresher)}
    },[setPost,setUser])
    

    async function handleGiveLike(e){
        e.preventDefault()
        try{
            await toggleLikePost(post.id, token)
            setPost(post)
        } catch(error){
            setError(error.message)
        }

    }

    async function handleSendComment(e){
        e.preventDefault()
        
        try{
            const {textarea:{value:text}} = e.target
            await sendComment(token, post.id, text)
            messageText.current.value = ""
        }catch(error){
            setError(error.message)
        }
    }

    function handleFocus(){
        messageText.current.focus()
    }
    
    function handleGoAccount(e){
        e.stopPropagation()
        history.push(`/users/${user.id}`)
    }

    return<>{user && owner && post && <section className=" post-detail ">

    <section className=" post ">
        <div className=" post__header ">
            <img className=" post-image " src={user.image} alt="profile" onClick={handleGoAccount} />
            <div className=" header-info ">
                <p className=" header-item header__user-username ">{user.name}</p>
                <p className=" header-item header__user-introduction ">{user.introduction}</p>
                <p className=" header-item header__date ">{moment(post.date).format("D/MM/YYYY HH:MM")}</p>
            </div>
        </div>

        <p className=" post__main ">{post.body}</p>

        <div className=" post__interactions ">
            <p className=" post-interactions__likes ">{post.likes.length}  &nbsp;likes</p>
            <p className=" post-interactions__comments ">{post.comments.length} &nbsp;comments</p>
        </div>

        <form className=" post__nav" onSubmit={function(e){
            e.preventDefault()
        }}>
            <button className=" post-button " onClick={handleGiveLike}><i className=" material-icons ">thumb_up_alt</i></button>
            <button className=" post-button " onClick={handleFocus}><i className=" material-icons ">comment</i></button>
        </form>
    </section>


    <section className="comments">
        <ul >
            {post.comments && post.comments.map(comment => <li key={comment._id}> <CommentItem comment={comment}  myId={id} /></li>)}
        </ul>
    </section>

    <section className="new-comment">
        <img className="new-comment__image" src={owner.image} />
        <form className="new-comment__form form" onSubmit={handleSendComment}>
            <textarea   ref={messageText} className="form__textarea" name="textarea"  cols="30" rows="2" placeholder="send a comment here ..."></textarea>
            <button className="form__button"><i className="material-icons">send</i></button>
        </form>
    </section>
    {error && <Feedback text={error} />}               
</section>}</>
}

export default withRouter(PostDetail)