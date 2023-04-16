import { Button } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import "../styles/Banner.css"


function Banner() {

    let history = useHistory()
    
    const loginRedirect = () => {
        history.push("/predict")
    }

    const registerRedirect = () => {
        history.push("/predict") //暂时用predict替代
    }


    return (
        <div className="banner">
            <div className="banner__title">
                <div className="banner__title_head">
                    Stance<font>AI</font>
                </div>
                <div className="banner__title_tail">
                    <div className="typing">
                        <p>A Machine Learning based Web Application for Stance Detection</p>
                        </div>

                    <div className="banner__buttons">
                        <Button onClick={loginRedirect} className="banner__button">Login</Button>
                        <Button onClick={registerRedirect} className="banner__button">Register</Button>
                    </div>
                </div>  
            </div>
        </div>
    )
}

export default Banner