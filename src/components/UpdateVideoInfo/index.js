import React, { useState, useEffect } from 'react'
import { Paper, Button, Typography, FormControl, InputLabel } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import ReactPlayer from 'react-player'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit *2,
        [theme.breakpoints.up(800 + theme.spacing.unit * 3 * 2)]: {
            width: 800,
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
    form: {
        width: '100%', // Fix IE 11 issue.
        border: '2px',
        marginTop: theme.spacing.unit,
        paddingBottom: '10px'
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        width: '200px'
    },

});

function UpdateProfile(props) {

    const { classes } = props


    const [url, setUrl] = useState('')
    const [category, setCategory] = useState('')
    const [id, setId] = useState('')
    const [fileName, setFileName] = useState('')
    const categoryArray = ['偷拍', 'Deepfake', 'JAV', '無修正', '素人', '巨乳', '女子校生', '人妻', '熟女', 'SM', '中國', '香港', '日本', '韓國', '台灣', '亞洲', '其他']

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{ paddingBottom: '15px' }}>
                    更新影片資料
                </Typography>

                <ReactPlayer
                    width='100%'
                    controls={true}
                    url={props.location.state.url}
                />

                <form className={classes.form} onSubmit={e => e.preventDefault() && false}>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="url">AV 連結</label>
                                <input className="form-control" id="url" disabled={true} value={props.location.state.url || ''} />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input className="form-control" id="id" name="id" value={id} onChange={e => setId(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <label htmlFor="fileName">AV 標題</label>
                                <input className="form-control" id="fileName" name="fileName" value={fileName} onChange={e => setFileName(e.target.value)} />
                            </div>
                        </div>
                        <div className="col-sm-4">
                            <div className="form-group">
                                <FormControl margin="normal" required fullWidth>

                                    <select className="form-select" name="category" id="category" autoComplete="off" value={category} onChange={e => setCategory(e.target.value)}>
                                        {categoryArray.map(function (value) {
                                            return (
                                                <option value={value}>{value}</option>
                                            )
                                        })}
                                    </select>
                                </FormControl>
                            </div>
                        </div>
                    </div>

                </form>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={UpadateUserProfile}
                    className={classes.submit}>
                    儲存
                </Button>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/dashboard"
                    className={classes.submit}>
                    返回
                </Button>
            </Paper>
        </main>
    )

    function UpadateUserProfile() {
        var url = props.location.state.url
        try {
            var query = firebase.database().ref("VideoList/").orderByChild("url").equalTo(url)
            query.once("child_added", function (snapshot) {

                snapshot.ref.update({
                    id: id,
                    fileName: fileName,
                    category: category,

                })
                alert("Data Saved Successfully")
            })
        } catch (error) {
            console.error(error)
        }
    }
}

export default withRouter(withStyles(styles)(UpdateProfile))