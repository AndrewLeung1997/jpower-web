import React, { useState } from 'react'
import { Typography, Paper, Avatar, Button, FormControl, Input, InputLabel, LinearProgress,Select, MenuItem } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
            width: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
    },

    submit: {
        marginTop: theme.spacing.unit * 3,
    },

})


function File(props) {

    const { classes } = props

    const [file, setFile] = useState([])
    const [url, setUrl] = useState('')
    const [process, setProcess] = useState(0)
    const [uploadStatus, setUploadStatus] = useState(false)
    const [category, setCategory] = useState('')
    const [fileName, setFileName] = useState('')
    const [id, setID] = useState('')
    

    if (!firebase.auth().currentUser) {
		// not logged in
		alert('Please login first')
		props.history.replace('/login')
		return null
	}

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    上傳文件
                </Typography>
                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <div className="row">
                        <div className="col-sm-12">
                            <FormControl margin="normal" required fullWidth>
                                <input
                                    style={{ display: "none" }}
                                    id="contained-button-file"
                                    onChange={(e) => { onChangeFile(e) }}
                                    type="file"
                                />

                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                        Upload
                                    </Button>
                                    {file.map(function(value, index){
                                        console.log(value)
                                        return(
                                            <label style={{ marginLeft: '10px', fontWeight: 'bold' }} htmlFor="filename">{file !== '' ? value.name : '請上傳你的影片'}</label>
                                        )
                                    })}
                                </label>
                            </FormControl>
                        </div>
                    </div>
                    {uploadStatus == true ? <div className="row">
                        <div className="col-sm-12">
                            <LinearProgress variant="determinate" value={process} />
                        </div>
                    </div> : <div></div>}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={uploadFiles}
                        className={classes.submit}>
                        上傳
                    </Button>

                </form>
            </Paper>
        </main>
    )

    function onChangeFile(e){
        for(var i=0; i<e.target.files.length; i++){
            const video = e.target.files[i]
            setFile(prevState => [...prevState, video])
        }
    }

    function uploadFiles(){
       file.map(function(value, index){
           uploadFile(value)
       })
    }

    function generateVideoID(){
        var unix = Math.round(new Date()/1000000000)
        var randomDigit = (Math.floor(Math.random()*90000) + 10000).toString()
        var videoID =  unix + randomDigit
        setID(videoID)
    }

    async function uploadFile(file) {
        if (file == null) {
            return
        } else {

            setUploadStatus(true)
            setFileName(file.name)
            generateVideoID()
            var storage = firebase.storage()
            var storageRef = storage.ref()
            var uploadTask = storageRef.child('folder/' + file.name).put(file);
            uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
                (snapshot) => {
                    var progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)) * 100
                    console.log(process)
                    setProcess(progress)
                }, (error) => {
                    throw error
                }, () => {

                    uploadTask.snapshot.ref.getDownloadURL().then((url) => {
                        setUrl(url)
                        console.log(url)
                        var timestamp = new Date().toISOString()
                        firebase.database().ref('VideoList/').push({
                            url,
                            category,
                            timestamp,
                            fileName,
                            id
                        })
                    })
                    alert("成功上傳")

                    setUploadStatus(false)
                    setFile([])
                    setFileName('')
                    setID('')
                    setCategory('')
                    setUrl('')
                    
                }
            )

        }
    }

    
}

export default withRouter(withStyles(styles)(File))