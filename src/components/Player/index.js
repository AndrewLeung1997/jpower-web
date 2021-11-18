import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardActionArea, CardMedia, CardContent, Button, CardActions } from '@material-ui/core'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from '../../firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import Bar from '../Bar'
import bcmaster from '../../file/bcmaster.gif'
import bc from '../../file/huangchao.mp4'
import huangchao from '../../file/new.jpeg'
import huangchaoNew from '../../file/new1.jpeg'
import draw from '../../file/draw.jpeg'

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

    relatedVideoPaper: {

        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 6,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 1}px ${theme.spacing.unit * 2}px ${theme.spacing.unit * 2}px`,

    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        marginBottom: theme.spacing.unit * 6,
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
        height: theme.spacing.unit * 80
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
    adView: {
        position: 'absolute',
        left: 50,
        top: 50,


    }

})

function Player(props) {

    const { classes } = props
    const [relatedVideo, setRelatedVideo] = useState([])
    const categoryArray = ['偷拍', 'Deepfake', 'JAV', '無修正', '素人', '巨乳', '校生', '人妻', '熟女', 'SM', '中國', '香港', '日本', '韓國', '台灣', '亞洲', '其他']
    const [video, setVideo] = useState([])
    const [controlVideo, setControlVideo] = useState(true)
    const [url, setUrl] = useState('')
    const [count, setCount] = useState(0)
    const [intervalID, setIntervalID] = useState(-1)
    const [category, setCategory] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [videoName, setVideoName] = useState('')
    const [timestamp, setTimeStamp] = useState('')
    const id = props.match.params.id

    console.log(id)

    function startInterval() {
        setIntervalID(setInterval(() => {
            setCount(prev => (prev + 1))
            setUrl(bc)
            setControlVideo(true)
        }, 1000))

    }

    function stopInterval() {

        if (count >= 10) {
            clearInterval(intervalID)
            setIntervalID(-1)
            setCount(0)
            setUrl(videoUrl)
            setControlVideo(false)
        }
    }

    useEffect(() => {
        startInterval()
        getVideoByID()

    }, [])


    return (

        <main className={classes.main}>
            <Bar></Bar>
            <div className="row">
                <div className="col-md-6">
                    <Card className={classes.VideoCard}>
                        <CardActions>
                            <CardMedia
                                className={classes.CardMedia}
                                component="video"
                                alt="video"
                                width="50%"
                                height='300'
                                title={videoName}
                                src={url}
                                controls={true}
                                autoPlay={controlVideo}

                            />
                        </CardActions>
                        <CardContent>
                            <div className="row">
                                <div className="col-md-12">
                                    <a href="https://www.dc8880.com/?uagt=jpower666&path=promotions" target="_blank">
                                        <img src={draw} style={{ width: '100%', height: '180px', paddingTop: '20px', paddingLeft:'50px',paddingRight:'40px' }}></img>
                                    </a>

                                </div>
                            </div>
                            <Typography gutterBottom variant="h5" component="div">
                                {videoName}
                            </Typography>
                            <Typography gutterBottom variant="h8" component="div">
                                {convertTimeStamp(timestamp)}
                            </Typography>
                            <Button type="submit"
                                variant="contained"
                                color="secondary"
                                component
                                ={Link} to={{
                                    pathname: `/filter/category/${category}`,
                                    state: {
                                        category: category
                                    }
                                }}
                                className={classes.submit}>
                                {category}
                            </Button>
                            {controlVideo ? <Button type="submit"
                                variant="contained"
                                color="primary"
                                onClick={stopInterval}
                                className={classes.submit}
                                style={{ marginLeft: '20px' }}
                            >
                                略過廣告
                            </Button> : <div></div>}
                        </CardContent>
                    </Card>
                </div>

                < div className="col-md-6" >
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
                    <div className="row">
                        <div className="col-md-12">
                            <a href="https://www.dc8880.com/?uagt=jpower666&path=signup" target="_blank">
                                <img src={huangchao} style={{ width: '70%', height: '150px' }}></img>
                            </a>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12">
                            <a href="https://www.dc8880.com/?uagt=jpower666&path=root" target="_blank">
                                <img src={huangchaoNew} style={{ width: '70%', height: '150px', paddingTop: '20px' }}></img>
                            </a>
                        </div>
                    </div>
                </div>

            </div >

            <Paper className={classes.relatedVideoPaper}>
                <Typography className={classes.videoName} component="h2" variant="h5" align='left'>相關影片</Typography>
                <div className="row">
                    {relatedVideo.map(function (value, index) {
                        return (
                            <div className="col-md-3">
                                <Card className={classes.Card}>
                                    <CardActionArea component={Link} to={{
                                        pathname: `/player/id/${value.id}`
                                    }} target="_blank">
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

    function getVideoByID() {

        const videoArray = []
        firebase.db.ref("VideoList/").orderByChild('id').equalTo(id).on('value', function (snapshot) {
            if (snapshot.exists()) {

                snapshot.forEach(function (result) {
                    videoArray.push(result.val())
                })
                setVideo(videoArray)
                videoArray.map(function (value, index) {
                    setVideoUrl(value.url)
                    setCategory(value.category)
                    setVideoName(value.fileName)
                    setTimeStamp(value.timestamp)

                    getVideoByTag(value.category)
                })
            }
        })
    }


    function getVideoByTag(category) {


        var filterArray = []
        firebase.db.ref("VideoList/").orderByChild('category').equalTo(category).limitToFirst(20).on('value', function (snapshot) {
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