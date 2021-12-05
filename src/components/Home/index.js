import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardMedia, CardContent, CardActionArea, Button, IconButton, List, ListItemButton, ListItem } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import Bar from '../Bar'
import give from '../../file/give.jpeg'

const styles = theme => ({
    root: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        backgroundColor: 'black'
    },
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5,
        [theme.breakpoints.up('auto' + theme.spacing.unit * 3 * 2)]: {
            width: 'auto',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        backgroundColor: 'black'
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        backgroundColor: 'black'
    },

    Card: {
        marginTop: theme.spacing.unit * 2,
        height: theme.spacing.unit * 42,
        backgroundColor: 'black'

    },
    Tag: {
        width: theme.spacing.unit * 10,
        backgroundColor: "#FFC0CB",
        textAlign: 'center',
        borderRadius: '6px',
        borderColor: '#ffffff',
    },
    TimeTag: {
        width: theme.spacing.unit * 8,
        backgroundColor: "#808080",
        textAlign: 'center',
        borderRadius: '6px',
        borderColor: '#ffffff',

    },
    Pagination: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 3
    },
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        color: 'white'
    },

})

function Home(props) {

    const { classes } = props
    const [videoList, setVideoList] = useState([])
    const [latestVideo, setLatestVideo] = useState([])
    const [totalDataCount, setTotalDataCount] = useState(0)
    const [dataRange] = useState(20)
    const [pageNumber, setPageNumber] = useState(0)
    const [duration, setDuration] = useState('')

    const categoryArray = ['偷拍', 'Deepfake', 'JAV', '無修正', '素人', '巨乳', '校生', '人妻', '熟女', 'SM', '中國', '香港', '日本', '韓國', '台灣', '亞洲', '其他']

    useEffect(() => {
        getAllMedia()
    }, [pageNumber, totalDataCount])

    return (
        <root className={classes.root}>
            <Bar></Bar>
            <main className={classes.main}>
                <div className="row">
                    <div className="col-md-12">
                        <a href="https://www.dc8880.com/?uagt=jpower666&path=promotions" target="_blank">
                            <img src={give} style={{ width: '100%', height: 'auto', paddingTop: '20px', paddingLeft: '50px', paddingRight: '40px' }}></img>
                        </a>

                    </div>
                </div>
                <div className="row">
                    <div className="col-md-9">
                        <div className="row" style={{ marginTop: '20px' }}>
                            <Typography component="h3" variant="h5" style={{ color: 'white' }}>所有視頻</Typography>
                            {videoList.map(function (value, index) {
                                return (
                                    <div className="col-sm-6 col-md-4 col-lg-4">
                                        <Card className={classes.Card}>
                                            <div className={classes.TimeTag}>
                                                {convertTime(value.duration)}
                                            </div>
                                            <CardActionArea component={Link} to={{
                                                pathname: `/player/id/${value.id}`,
                                                state: {
                                                    url: value.url,
                                                    videoName: value.fileName,
                                                    category: value.category,
                                                    timestamp: value.timestamp,
                                                    id: value.id
                                                }
                                            }}>

                                                <CardMedia
                                                    id="video"
                                                    className={classes.CardMedia}
                                                    component="video"
                                                    alt="video"
                                                    width="100%"
                                                    height='200'
                                                    title={value.fileName}
                                                    src={value.url}

                                                >

                                                </CardMedia>
                                                <CardContent style={{ color: 'white' }}>
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
                    </div>
                    <div className="col-md-3">
                        <Paper className={classes.paper}>
                            <Typography component="h1" variant="h5" style={{ color: 'white' }}>所有標籤</Typography>
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
                    <nav className={classes.Pagination}>
                        <ul className="pagination pg-blue justify-content-center">
                            {
                                Array(Math.ceil(totalDataCount / dataRange)).fill().map(function (_, i) {
                                    return (

                                        <div className="pagination" style={{ borderRadius: "20px", paddingLeft: "5px", fontWeight: "bold" }}>
                                            <li className="page-item" key={i} onClick={() => setPageNumber(i)}>
                                                <a className="page-link" href="#">{i + 1}</a>
                                            </li>
                                        </div>
                                    )
                                })
                            }
                        </ul>
                    </nav>

                </div>

                {/* <Paper className={classes.paper}>
                    <Typography component="h1" variant="h5" style={{ color: 'white' }}>所有標籤</Typography>
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
                </Paper> */}
            </main>
        </root>
    )

    function convertTime(num) {
        var minutes = Math.floor(num / 60)
        var seconds = Math.round(num % 60)

        if (minutes < 10) {
            minutes = '0' + minutes
        }

        if (seconds < 10) {
            seconds = '0' + seconds
        }

        var timestamp = minutes + ":" + seconds

        return timestamp
    }

    function paginate(array, page_size, page_number) {

        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }


    function getAllMedia() {

        var videoArray = []
        firebase.database().ref('VideoList/').on('value', function (snapshot) {
            if (snapshot.val()) {
                var keys = Object.keys(snapshot.val()).sort()
                setTotalDataCount(keys.length)
                snapshot.forEach(function (video) {
                    videoArray.push(video.val())
                })
                setVideoList(paginate(videoArray, dataRange, pageNumber + 1))
            }
        })
    }

    function getLatestMedia() {
        var latestVideoArray = []
        firebase.database().ref('VideoList').orderByChild("catehory").equalTo("香港").limitToLast(20).on('value', function (snapshot) {
            if (snapshot.val()) {
                var keys = Object.keys(snapshot.val()).sort()
                setTotalDataCount(keys.length)
                snapshot.forEach(function (video) {
                    latestVideoArray.push(video.val())
                })
                setLatestVideo(paginate(latestVideoArray, dataRange, pageNumber + 1))
            }
        })
    }


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

}

export default withRouter(withStyles(styles)(Home))