import React, { useState, useEffect } from 'react'
import './index.sass'
import {withRouter} from 'react-router-dom'
import {createPost, retrieveUser} from '../../logic'
import Feedback from '../Feedback'

function NewPost({history}){

    const { token, id } = sessionStorage
    const [user, setUser] = useState()
    const [error, setError] = useState()

    useEffect(()=>{
        (async()=>{
            try{ setUser(await retrieveUser(token)) 
            } catch(error){ setError(error.message) }
        })()
    },[setUser])

    async function handleNewPost(e){
        e.preventDefault()
        try{
            const { jobCheckbox:{checked:jobCheckbox}, body:{value:body} } = e.target
            let job
            jobCheckbox === true ? job = 'JOB': job='ARTICLE'
            await createPost(token, body, job) 
            history.push(`/usersPosts/${id}`)
        } catch(error){ 
            setError(error.message)
         }
    }
    return<>{user && <section className="post new-post">
    <div className=" post__header ">
        <img className=" post-image " src={user.image} alt=" profile image "/>
        <div className=" header-info ">
            <p className=" header-item header__user-username ">{user.name}</p>
            <p className=" header-item header__user-introduction ">{user.introduction}</p>
        </div>
    </div>
    <form className="post__nav" id='post__nav' onSubmit={handleNewPost}>
        <textarea className="post-textarea " name="body" cols="30 " rows="15" placeholder="write here     ..."></textarea>

        <div className="post__nav__buttons">
            <button className="post-button"><i className=" material-icons ">add_circle_outline</i>Post</button>

            <label for='job' className="job-checkbox">Job
                <input className="checkbox" type="checkbox" name="jobCheckbox" />
            </label>
        </div>
    </form>
    {error && <Feedback text={error} />}               
</section>}</>
}

export default withRouter(NewPost)