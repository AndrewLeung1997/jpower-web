import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardActionArea, CardMedia, CardContent, Button } from '@material-ui/core'
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

    relatedVideoPaper:{
        
            marginTop: theme.spacing.unit * 3,
            marginBottom: theme.spacing.unit *6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
        
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        marginBottom: theme.spacing.unit *6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
    },

    videoName: {
        marginTop: theme.spacing.unit * 3,

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
    VideoCard: {

        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'left',
        padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,
        height: theme.spacing.unit * 60
    },
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1
    },
    titleBar: {
        display: 'block',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: 'normal'
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },

})

function Player(props) {

    const { classes } = props
    const [relatedVideo, setRelatedVideo] = useState([])
    const categoryArray = ['偷拍', 'Deepfake', 'JAV', '無修正', '素人', '巨乳', '校生', '人妻', '熟女', 'SM', '中國', '香港', '日本', '韓國', '台灣', '亞洲', '其他']

    useEffect(() => {
        getVideoByTag()
    }, [])

    return (

        <main className={classes.main}>
            <Bar></Bar>

            <div className="row">
                <div className="col-md-6">
                    <Card className={classes.VideoCard}>
                        <CardMedia
                            className={classes.CardMedia}
                            component="video"
                            alt="video"
                            width="50%"
                            height='300'
                            title={props.location.state.videoName}
                            src={props.location.state.url}
                            controls={true}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {props.location.state.videoName}
                            </Typography>
                            <Typography gutterBottom variant="h8" component="div">
                                {convertTimeStamp(props.location.state.timestamp)}
                            </Typography>
                            <Button type="submit"
                                variant="contained"
                                color="secondary"
                                component
                                ={Link} to={{pathname: `/filter/category/${props.location.state.category}`,
                                state: {
                                    category: props.location.state.category
                                }
                            }}
                                className={classes.submit}>
                                {props.location.state.category}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
                <div className="col-md-6">
                    <Paper className={classes.paper}>
                        <Typography component="h1" variant="h5">所有標籤</Typography>
                        <div className="well" >
                            {categoryArray.map(function (value, index) {
                                return (
                                    <Button className={classes.submit}
                                        id={index} component={Link} to={{
                                            pathname: `/filter/category/${value}`,
                                            state: {
                                                category: value
                                            }
                                        }}>{value}</Button>
                                )
                            })}
                        </div>
                    </Paper>

                </div>
            </div>


            <Paper className={classes.relatedVideoPaper}>
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