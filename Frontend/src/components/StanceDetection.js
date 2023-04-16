import React, { useState } from 'react'
import { Button, TextField } from '@material-ui/core';
import api from "../api/stanceAPI"
import Alert from '@material-ui/lab/Alert';

import Loading from './Loading';
import Output from './Output';





function StanceDetection() {

    const [formData, setFormData] = useState({
        target:"",
        text:"",
    })

    const [predictionResult, setPredictionResult] = useState({})

    const [loadingStatus, setLoadingStatus] = useState(false)

    const handleChange = (e) => {
        let newData = {...formData}
        newData[e.target.id] = e.target.value //获得触发变化的element的id和值
        setFormData(newData)
    }

    const handleClick = async () => {

        setLoadingStatus(true) //上传
        
        const request = new FormData()

        for(let key in formData) {
            request.append(key, formData[key])
        }

        const response = await api.post(
            "/predict",
            request
        )
        const responseData = JSON.parse(response.data);
        console.log(typeof responseData)
        setPredictionResult(responseData)
        console.log(predictionResult)
        setLoadingStatus(false)
        console.log(loadingStatus)
    }

    
    if(predictionResult.label) {
        console.log("Output.....")
        return <Output predictedStance={predictionResult.label} predictedProbs={predictionResult.probs} clearResult={setPredictionResult}/>;
    }


    else if(loadingStatus) {
        console.log("loading")

        return <Loading />

    }

    else return (
        <div className="form">
            <div className="form__form_group">
                {
                    predictionResult.error && 
                    <Alert style={{marginTop:"20px"}} severity="error"> { predictionResult.error } </Alert>
                }
                <center><div className="form__title">Stance Detection</div></center>
                <TextField onChange={(e) => handleChange(e)} value={formData.target} className="form__text_field" id="target" name="target" variant="filled" label="Stance target" />
                <TextField onChange={(e) => handleChange(e)} value={formData.text} className="form__text_field" id="text" name="text" variant="filled" label="input text" />
                <Button onClick={()=>handleClick()} className="form__button" color="primary" variant="contained">Stance Detection</Button>
            </div>
        </div>
    )
}

export default StanceDetection
