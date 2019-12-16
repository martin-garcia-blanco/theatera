import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import './index.sass'
import {retrieveSummaryUser} from '../../logic'
import Feedback from '../Feedback'
import moment from 'moment'


function Message({history, message:{user:userId, body, date}}){
    const {token, id} = sessionStorage
    const [userData, setUserData] = useState()
    const [error, setError] = useState()

    useEffect(()=>{
        (async()=>{
            try{ setUserData(await retrieveSummaryUser(userId,token)) }
            catch(error){ setError(error.message) }
        })()
    },[setUserData])
 
    function handleGoProfile(e){
        e.preventDefault()
        history.push(`/users/${userId}`)
    }



    return<> {userData && id !== userId &&  <section  className={userId===id ?"comment comment--mine" : "comment"}>
            <img className="comment__image " src={userData.image} alt="profile" onClick={handleGoProfile} />
                <div className="comment__text text ">
                    <p className="text__user-name ">{userData.name}</p>
                    <p className="text__date ">{date}</p>
                    <p className="text__comment ">{body}</p>
                </div>
            </section>
    } 
    {userData && id === userId &&  <section  className={userId===id ?"comment comment--mine" : "comment"}>
                <div className="comment__text text ">
                    <p className="text__user-name ">{userData.name}</p>
                    <p className="text__date ">{moment(date).format("D/MM/YYYY HH:MM")}</p>
                    <p className="text__comment ">{body}</p>
                </div>
            <img className="comment__image " src={userData.image} alt="profile" onClick={handleGoProfile} />
            </section>
    }
        {error && <Feedback text={error} />}               

    </>
}
export default withRouter(Message)