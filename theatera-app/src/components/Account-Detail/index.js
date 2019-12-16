import React, { useState, useEffect } from 'react'
import './index.sass'
import { withRouter } from 'react-router-dom'
import {  retrieveCompleteUser } from '../../logic'
import SkillItem from '../SkillItem'
import {removeSkillItem,createChat,removeConnection, checkFriendRequest,createSkillItem, removeExperienceItem, createExperienceItem} from '../../logic'
import ExperienceItem from '../Experience-Item'
import Feedback from '../Feedback'


function AccountDetail({userId , history}) {

    const [user, setUser] = useState()
    const { token, id } = sessionStorage
    const [render, setRender] = useState(true)
    let skillInput = React.createRef()
    const [error, setError]= useState()
    let titleInput = React.createRef()
    let startDateInput = React.createRef()
    let endDateInput = React.createRef()
    let descriptionInput = React.createRef()


    let myAccount
 
    useEffect(()=>{
        (async()=>{
            try{
                setUser(await retrieveCompleteUser(userId,token))
                setError(undefined)
            } catch(error){
                setError(error.message)
            }
        })()

        if(user) id === user.id ? myAccount=true: myAccount=false
        
    }, [setUser, render])

   
    async function handleCreateSkill(e){
        e.preventDefault()
        try{
            const { newSkill:{value:newSkill} } = e.target
            await createSkillItem(token, newSkill)
            skillInput.current.value = ""
            setRender(!render)
        } catch(error){
            setError('Take care, empty field')
        }

    }

    async function handleCreateExperienceItem(e){
        e.preventDefault()
        try{
            const { title:{value:title}, dateStart:{value:dateStart}, dateEnd:{value:dateEnd}, description:{value:description}, type:{value:type} } = e.target
            await createExperienceItem(token, title, description, dateStart, dateEnd, type)
            titleInput.current.value = ""
            startDateInput.current.value = ""
            endDateInput.current.value = ""
            descriptionInput.current.value = "" 
            setRender(!render)
        } catch(error){
            setError(error.message)
        }
    }

    async function handleRemoveSkill(skillName){
        try{
            await removeSkillItem(token, skillName)
            setRender(!render)
        } catch(error){
            setError(error.message)
        }
    }

    async function handleRemoveExperience(expId){
        try{
            await removeExperienceItem(token, expId)
            setRender(!render)
        } catch(error){
            setError(error.message)
        }
    }

    function handleGoInfo(e){
        e.preventDefault()
        history.push(`/info/${user.id}`)
    }

    function handleGoUserPosts(e){
        e.preventDefault()
        history.push(`/usersPosts/${user.id}`)
    }

    function handleLogOut(e){
        e.preventDefault()
        sessionStorage.clear()
        history.push('/')
    }

    async function handleChat(e){
        e.preventDefault()
        try{
            const chatId = await createChat(token, userId)
            history.push(`/chat/${chatId}`)
        } catch(error){
            setError(error.message)
        }
    }

    function handleGoFriends(e){
        e.preventDefault()
        history.push(`/friend-connections/${userId  }`)
    }

    async function handleRemoveFriend(e){
        try{
            e.preventDefault()
            removeConnection(token,user.id)
            history.push('/')
        } catch(error){
            setError(error.message)
        }
    }

    async function handleSendFriendRequest(e){
        e.preventDefault()
        try{
            await checkFriendRequest(token, user.id)
        } catch(error){
            setError(error.message)
        }
    }
        

    return  <>{user  &&  <section className="account-details">
    <section className="account-details__header">
        <div className="account-details__principal principal">
            <img className="principal__image principal-item" src={user.image} alt="profile" />
            <p className="principal__name principal-item">{user.name}</p>

            <p className="principal__introduction principal-item">{user.introduction}</p>
            <p className="principal__address principal-item">{user.city}</p>
            <p className="principal__description principal-item">{user.description}</p>


        </div>

        <nav className="account-details__header__nav  buttons">
        {!user.connected && userId!==id ? <button className="buttons__home button" onClick={handleSendFriendRequest}>
                        <p className="button__text">Connect</p>
                    </button> 
                    :userId!==id && user.connected&&
                    <button className="buttons__home button" onClick={handleRemoveFriend}>
                        <p className="button__text">Disconnect</p>
                    </button> 
        }

        {(user.connected || userId===id) && <button className="buttons__contacs button" onClick={handleGoInfo}>
                        <p className="button__text">Info</p>
                    </button>
        }
                    {user.connected &&  <button className="buttons__post button" onClick={handleChat}>
                        <p className="button__text">message</p>
                    </button>
                    }
            
            <button className="buttons__notifications button" onClick={handleGoUserPosts}>
                        <p className="button__text">Posts</p>
                    </button>
            <button className="buttons__jobs button"  onClick={handleGoFriends}>
                        <p className="button__text">Friends</p>
                    </button>
                    {userId === id && <button className="buttons__home button" onClick={handleLogOut}>
                        <p className="button__text">LogOut</p>
                    </button>
}
        </nav>
    </section>

    {user.rol==='COMPANY' && <section className="skills">
        <h2 className="skills__title">{user.rol}</h2>
    </section>}

    <section className="skills">
        <h2 className="skills__title">Personal skills</h2>
        <ul className="skills__list">
                {user.skills.map((skill, index)=>  <li key={index} className="skill-item"> <SkillItem accountId={user.id} onRemoveSkillItem={handleRemoveSkill} skill={skill}/> </li>)} 

        </ul>
       { user.id===id ? <form action="" className="skill__more more" onSubmit={handleCreateSkill}>
            <input className="more__input" ref={skillInput} name="newSkill" type="text" placeholder="new skill" />
            <button className="more__button" >
                        <i className="material-icons">add_circle_outline</i>
                </button>
        </form> : <></>}
    </section>


    <section className="experience">
        <h2 className="experience__title">Experience</h2>

        <ul className="experiences">
        {user.experience.map((experience, index)=>  <li key={index} className="skill-item"> <ExperienceItem accountId={user.id} onRemoveExperienceItem={handleRemoveExperience} experience={experience} type={'EDUCATION'}/> </li>)} 
        </ul>
        


       { userId === id && <form className="experience__more more" onSubmit={handleCreateExperienceItem}>
            <label className="more__label">
                <input type="text" name="title" ref={titleInput} placeholder="title here ..." required />
            </label>
            <label className="more__label">
                    <input type="date" name="dateStart" ref={startDateInput} required />
                </label>
            <label className="more__label">
                        <input type="date" name="dateEnd" ref={endDateInput} required />
                    </label>
            <label className="more__label">
                            <textarea  name="description" id=" " cols="30" ref={descriptionInput} rows="3" placeholder="describe me here ... "></textarea>
                        </label>
              <button className="more__button">
                    <i className="material-icons">add_circle_outline</i>
            </button>
            <input type="text" name="type" value="EDUCATION" hidden/>
            
        </form>
}
    </section>



    <section className="experience">
        <h2 className="experience__title">Education</h2>

        <ul className="experiences">
        {user.experience.map((experience, index)=>  <li key={index} className="skill-item"> <ExperienceItem accountId={user.id} onRemoveExperienceItem={handleRemoveExperience} experience={experience} type={'JOB'}/> </li>)} 
        </ul>

        { userId === id && <form className="experience__more more" onSubmit={handleCreateExperienceItem}>
            <label className="more__label">
                <input type="text" name="title" ref={titleInput} placeholder="title here ..." required />
            </label>
            <label className="more__label">
                    <input type="date" name="dateStart" ref={startDateInput} required />
                </label>
            <label className="more__label">
                        <input type="date" name="dateEnd" ref={endDateInput} required />
                    </label>
            <label className="more__label">
                            <textarea  name="description" id=" " cols="30" ref={descriptionInput} rows="3" placeholder="describe me here ... "></textarea>
                        </label>
              <button className="more__button">
                    <i className="material-icons">add_circle_outline</i>
            </button>
            <input type="text" name="type" value="JOB" hidden/>
            
        </form>
}


    </section>     
        {error && <Feedback text={error} />}
    </section>

}</> }


export default withRouter(AccountDetail)
    