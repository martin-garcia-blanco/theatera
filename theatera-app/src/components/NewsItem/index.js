import React from 'react'
import { withRouter } from 'react-router-dom'
import './index.sass'
import Feedback from '../Feedback'
import moment from 'moment'

function NewsItem({history, news:{id:newsId, body:{message,type, introduction, name,image, id:userId, date}},onRender, onAddContact,onDeniedFriendRequest}){

   
    function handleGoToUser(e){
        e.preventDefault()
        history.push(`/users/${userId}`)  
    }
  
    return <>{ type ==='REQUEST' ? <div className="acc-resume new-request">
                <img className=" acc-resume__image" src={image} alt="profile" onClick={handleGoToUser}/>
                <div className=" acc-resume__info info"onClick={handleGoToUser} >
                    <p className=" info__username ">{name}</p>
                    <p className=" info__description">New friend request</p>
                    <p className=" info__description ">{introduction}</p>
                </div>

                 <form className="acc-resume__form " action="">
                   
                    <button className="button" onClick={(e)=>{
                        e.preventDefault()
                        onAddContact(userId,newsId)
                    }}>
                        <i className="material-icons big-button">add_circle_outline</i>
                    </button>
                    
                    <button className="button" onClick={(e)=>{
                        e.preventDefault()
                        onDeniedFriendRequest(newsId)
                    }} >
                        <i className="material-icons big-button" >remove_circle_outline</i>
                    </button>
                </form>
            </div>

            :  <div className="acc-resume new-connection" onClick={handleGoToUser}>
            <img className=" acc-resume__image" src={image} alt="profile" />
            <div className=" acc-resume__info info" >
                <p className=" info__username ">{name}</p>
                <p className=" info__description ">{introduction}</p>
                <p className=" info__description ">{moment(date).format("D/MM/YYYY HH:MM")}</p>

            </div>
            <div className=" acc-resume__info info" >   
                     <p className=" info__username">New Contact</p>
            </div>
        </div>

    }</>
}


export default withRouter(NewsItem)
