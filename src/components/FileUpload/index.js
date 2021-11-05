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


function FileUpload(props) {

    const { classes } = props

    const [file, setFile] = useState('')
    const [url, setUrl] = useState('')
    const [process, setProcess] = useState(0)
    const [uploadStatus, setUploadStatus] = useState(false)
    const [category, setCategory] = useState('')
    const [fileName, setFileName] = useState('')
    const categoryArray = ['偷拍', 'Deepfake', 'JAV', '無修正','素人', '巨乳', '女子校生', '人妻','熟女','SM','中國','香港','日本','韓國','台灣','亞洲','其他']

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
                                    onChange={(e) => { setFile(e.target.files[0]) }}
                                    type="file"
                                />

                                <label htmlFor="contained-button-file">
                                    <Button variant="contained" color="primary" component="span">
                                        Upload
                                    </Button>
                                    <label style={{ marginLeft: '10px', fontWeight: 'bold' }} htmlFor="filename">{file !== '' ? file.name : '請上傳你的影片'}</label>
                                </label>
                            </FormControl>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="category">AV 類型</InputLabel>
                                <Select name="category" id="category" autoComplete="off" value={category} onChange={e => setCategory(e.target.value)}>
                                    {categoryArray.map(function (value) {
                                        return (
                                            <MenuItem value={value}>{value}</MenuItem>
                                        )
                                    })}
                                </Select>
                            </FormControl>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="fileName">AV標題</InputLabel>
                                <Input type="text" id="fileName" name="fileName" autoComplete="off" autoFocus onChange={(e) => setFileName(e.target.value)}></Input>
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
                        onClick={uploadFile}
                        className={classes.submit}>
                        上傳
                    </Button>

                </form>
            </Paper>
        </main>
    )

    async function uploadFile() {
        if (file == null) {
            return
        } else {
            setUploadStatus(true)
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
                            fileName
                        })
                    })
                    alert("成功上傳")

                    setUploadStatus(false)

                }
            )

        }
    }
}

export default withRouter(withStyles(styles)(FileUpload))