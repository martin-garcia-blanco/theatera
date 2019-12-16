import React from 'react'
import './index.sass'
import moment from 'moment'

export default function({comment:{date,description,user, _id}, myId}){
    
    return<> {  <section  className={user._id===myId ?"comment comment--mine" : "comment"}>
    <img className="comment__image" src={user.image} alt="profile image" />
    <div className="comment__text text">
        <p className="text__user-name">{user.name}</p>
        <p className="text__user-info">{user.info}</p>
        <p className="text__date">{moment(date).format("D/MM/YYYY HH:MM")}</p>
        <p className="text__comment">{description}</p>
    </div>
</section>
    }</>
}
