import React, { useEffect, useState } from 'react'
import { Typography, Paper, Card, CardMedia, CardContent, CardActionArea } from '@material-ui/core'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import withStyles from '@material-ui/core/styles/withStyles'
import { Link, withRouter } from 'react-router-dom'
import firebase from 'firebase'
import '../../../node_modules/bootstrap/dist/css/bootstrap.css'
import Bar from '../Bar'

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 3,
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
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    Card: {
        marginTop: theme.spacing.unit * 2,
        height: theme.spacing.unit * 40

    },
    Tag: {
        width: theme.spacing.unit * 7,
        backgroundColor: "#FFC0CB",
        textAlign: 'center',
        borderRadius: '10px',
        borderColor: '#ffffff',
        borderStyle: 'solid'
    },
    Pagination: {
        marginTop: theme.spacing.unit * 2
    },
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1
    }
})

function Home(props) {

    const { classes } = props
    const [videoList, setVideoList] = useState([])
    const [totalDataCount, setTotalDataCount] = useState(0)
    const [dataRange] = useState(20)
    const [pageNumber, setPageNumber] = useState(0)
    const [data, setData] = useState('')
    const [selected, setSelected] = useState(props)
   

    useEffect(() => {
        getAllMedia()
    }, [pageNumber, totalDataCount])

    return (
        <main className={classes.main}>
            <Bar></Bar>
            <Paper className={classes.paper}>
                <Typography variant="h5" align={'left'}>
                    所有視頻
                </Typography>
                <div className="row">
                    {videoList.map(function (value, index) {
                        return (
                            <div className="col-md-3">
                                <Card className={classes.Card}>
                                    <CardActionArea component={Link} to={{pathname: `/Player/videoURL/${value.url}`}}>
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
                                                {console.log(value.fileName.length)}
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
                <nav className={classes.Pagination}>
                    <ul className="pagination pagination-sm pg-blue ">
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
            </Paper>
        </main>
    )

    function paginate(array, page_size, page_number) {

        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function partentToChild(){
        setData("This is data from parent component to the child component")
    }

    function getAllMedia() {
        firebase.database().ref('VideoList/').on('value', function (snapshot) {
            if (snapshot.val()) {
                var keys = Object.keys(snapshot.val()).sort()
                setTotalDataCount(keys.length)
                var videoArray = []
                var key = keys[pageNumber * dataRange]
                firebase.database().ref('VideoList/').orderByKey().limitToFirst(dataRange).startAt(key).on('value', function (snapshot) {
                    if (snapshot.val()) {
                        console.log(snapshot.val())
                        snapshot.forEach(function (video) {
                            videoArray.push(video.val())
                        })
                        setVideoList(videoArray)
                    }
                })
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