import React from 'react'
import './index.sass'
import {withRouter} from 'react-router-dom'


function FeedBack({text}){
    return <section className="feedback">
                <p className="feedback__text">{text}</p>
            </section>
}

export default withRouter(FeedBack)

