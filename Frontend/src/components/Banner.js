import { Button } from '@material-ui/core'
import React from 'react'
import { useHistory } from 'react-router'
import "../styles/Banner.css"


function Banner() {

    let history = useHistory()

    const signInRedirect = () => {
        history.push("/signin")
    }

    const registerRedirect = () => {
        history.push("/signup") //暂时用predict替代
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
                        <Button onClick={registerRedirect} className="banner__button">Sign Up</Button>
                        <Button onClick={signInRedirect} className="banner__button">Sign In</Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Banner