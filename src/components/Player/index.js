import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardActionArea, CardMedia, CardContent } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import ReactPlayer from 'react-player'
import Bar from '../Bar'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    },

    videoName: {
        paddingTop: '20px',
        paddingBottom: '10px',
        fontSize: '20px'
    },
    Tag: {
        width: theme.spacing.unit * 10,

        backgroundColor: "#FFC0CB",
        textAlign: 'center',
        borderRadius: '10px',
        borderColor: '#ffffff',
        borderStyle: 'solid'
    },
    Card: {
        marginTop: theme.spacing.unit * 2,
        height: theme.spacing.unit * 40

    },
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1
    }

})

function Player(props) {

    const { classes } = props
    const [relatedVideo, setRelatedVideo] = useState([])

    useEffect(() => {
        getVideoByTag()
    }, [])

    return (

        <main className={classes.main}>
            <Bar></Bar>
            <Paper className={classes.paper}>
                <Typography className={classes.videoName} component="h2" variant="h5" align='left'>
                    {props.location.state.videoName}
                </Typography>
                <ReactPlayer
                    className="react-player"
                    config={{ file: { attributes: { controlsList: 'nodownload' } } }}
                    onContextMenu={e => e.preventDefault()}
                    url={props.location.state.url}
                    controls={true}
                    width="100%">
                </ReactPlayer>
                {/* <div className="row">
                    <div className="col-md-4">
                        <label>Category</label>
                    </div>
                    <div className="col-md-8">

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">
                        <div className={classes.Tag}>
                        {props.location.state.category}
                        </div>
                    </div>
                    <div className="col-md-8">

                    </div>
                </div> */}
            </Paper>
            <Paper className={classes.paper}>
                <Typography className={classes.videoName} component="h2" variant="h5" align='left'>相關影片</Typography>
                <div className="row">
                    {relatedVideo.map(function (value, index) {
                        return (
                            <div className="col-md-3">
                                <Card className={classes.Card}>
                                    <CardActionArea component={Link} to={{
                                        pathname: "/player",
                                        state: {
                                            url: value.url,
                                            videoName: value.fileName,
                                            category: value.category,
                                            timestamp: value.timestamp
                                        }
                                    }}>
                                        <CardMedia
                                            className={classes.CardMedia}
                                            component="video"
                                            alt="video"
                                            width="100%"
                                            height='200'
                                            title={value.fileName}
                                            src={value.url}

                                        />
                                        <CardContent>
                                            <Typography gutterBottom variant="h8" component="div">
                                                {value.fileName}
                                            </Typography>
                                            <Typography gutterBottom variant="h8" component="div">
                                                {convertTimeStamp(value.timestamp)}
                                            </Typography>
                                            <Typography gutterBottom variant="h8" component="div">
                                                <div className={classes.Tag}>
                                                    {value.category}
                                                </div>
                                            </Typography>
                                        </CardContent>
                                    </CardActionArea>

                                </Card>
                            </div>
                        )
                    })}
                </div>
            </Paper>
        </main>

    )

    function convertTimeStamp(timestamp) {
        var date = new Date(timestamp)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        var day = date.getDate()

        if (day < 10) {
            day = '0' + day
        }
        if (month < 10) {
            month = '0' + month
        }

        var newDate = year + '-' + month + '-' + day

        return newDate
    }


    function getVideoByTag() {
        var filterArray = []
        firebase.db.ref("VideoList/").orderByChild('category').equalTo(props.location.state.category).limitToFirst(20).on('value', function (snapshot) {
            if (snapshot.exists()) {

                snapshot.forEach(function (result) {
                    filterArray.push(result.val())
                })
                console.log(filterArray)
                setRelatedVideo(filterArray)
            }
        })
    }
}


export default withRouter(withStyles(styles)(Player))