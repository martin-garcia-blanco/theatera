import React from 'react'
import {withRouter} from 'react-router-dom'

function SkillItem({skill, accountId, onRemoveSkillItem}) {

    const { id }= sessionStorage
    let myAccount
    id === accountId ? myAccount = true: myAccount=false


    return <> <p>{skill}</p>
                <form action="" className="skill__less less">
                    <button className="less__button">
                        { myAccount && <i className="material-icons" onClick={function(e){
                            e.preventDefault()
                            onRemoveSkillItem(skill)
                        }}>remove_circle_outline</i>}
                    </button>
                </form>
            </>
}

export default withRouter(SkillItem)