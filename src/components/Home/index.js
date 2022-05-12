import React, {useEffect, useState, useRef} from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import {Link, withRouter} from "react-router-dom";
import firebase from "firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import give from "../../file/give.jpeg";
import {useHistory, useLocation} from "react-router-dom";
import queryString from "query-string";
import "../Home/index.css";
import {useCategories} from "../App"

const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        marginTop: theme.spacing.unit * 5,
        [theme.breakpoints.up("auto" + theme.spacing.unit * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#210548",
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
            theme.spacing.unit * 3
        }px`,
        backgroundColor: "#210548",
    },

    Card: {
        marginTop: theme.spacing.unit * 2,
        height: theme.spacing.unit * 42,
        backgroundColor: "#210548",
    },
    Tag: {
        width: theme.spacing.unit * 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
    TimeTag: {
        width: theme.spacing.unit * 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
    Pagination: {
        marginTop: theme.spacing.unit * 2,
        marginBottom: theme.spacing.unit * 3,
    },
    CardMedia: {
        paddingLeft: theme.spacing.unit * 1,
        paddingRight: theme.spacing.unit * 1,
        paddingTop: theme.spacing.unit * 1,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
        color: "white",
        fontSize: "20px",
    },
});

function Home(props) {
    const {classes} = props;
    const ref = useRef(null);
    const location = useLocation();
    const history = useHistory();
    const path = window.location.pathname;
    const initialQueryString = queryString.parse(location.search);
    const initialPageNumber = Number(initialQueryString.page) || 0;

    const [videoList, setVideoList] = useState([]);
    const [latestVideo, setLatestVideo] = useState([]);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(18);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [totalRecommendVideo, setTotalRecommendVideo] = useState(0);
    const [currentRecommendVideoPage, setCurrentRecommendVideoPage] = useState(0);

    const categoryArray = useCategories();

    useEffect(() => {
        getAllMedia();
        getLatestMedia();
        props.history.push(`${path}?page=${pageNumber}`);
    }, [pageNumber, totalDataCount, totalRecommendVideo, currentRecommendVideoPage]);

    return (
        // <div className={classes.root}>

        <div className={classes.main}>
            <Bar></Bar>
            <div className="row">
                <div className="col-md-3">
                    <Paper className={classes.paper}>
                        <Typography
                            component="h1"
                            variant="h5"
                            style={{color: "#FCFCFC"}}
                        >
                            所有類別
                        </Typography>
                        <div className="well">
                            <ul className="list-group">
                                {categoryArray.map(function (value, index) {
                                    return (
                                        <li>
                                            <Button
                                                className={classes.submit}
                                                id={index}
                                                component={Link}
                                                to={{
                                                    pathname: `/filter/category/${value}`,
                                                    state: {
                                                        category: value,
                                                    },
                                                }}
                                            >
                                                {value}
                                            </Button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </Paper>
                </div>
                <div className="col-md-9">
                    <div className="row" style={{marginTop: "20px"}}>
                        <Typography
                            component="h3"
                            variant="h5"
                            style={{color: "#FCFCFC", marginTop: "20px"}}
                        >
                            最新視頻
                        </Typography>
                        {latestVideo.map(function (value, index) {
                            return (
                                <div className="col-sm-4 col-md-3 col-lg-3">
                                    <Card className={classes.Card}>
                                        <div className={classes.TimeTag}>
                                            {convertTime(value.duration)}
                                        </div>

                                        <CardActionArea
                                            component={Link}
                                            to={{
                                                pathname: `/player/id/${value.id}`,
                                                state: {
                                                    url: value.url,
                                                    videoName: value.fileName,
                                                    category: value.category,
                                                    timestamp: value.timestamp,
                                                    id: value.id,
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                className={classes.CardMedia}
                                                component={
                                                    value.previewUrl ? "img" : "video"
                                                }
                                                alt="video"
                                                width="100%"
                                                height="200"
                                                title={value.fileName}
                                                muted={true}
                                                src={`${
                                                    value.previewUrl || value.url
                                                }#t=0.5`}
                                                // onMouseOver={(e) => onMouseOver(e)}
                                                // onMouseOut={(e) => onMouseOut(e)}
                                                // loop
                                                // playsinline
                                            />
                                        </CardActionArea>
                                        <CardContent style={{color: "#FCFCFC"}}>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                {value.fileName}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                {convertTimeStamp(value.timestamp)}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                <div className={classes.Tag}>
                                                    {value.category}
                                                </div>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <nav className={classes.Pagination}>
                <ul className="pagination pg-blue justify-content-center">
                    {Array(Math.ceil(totalRecommendVideo / dataRange))
                        .fill()
                        .map(function (_, i) {
                            return (
                                <div
                                    className="pagination"
                                    style={{
                                        borderRadius: "20px",
                                        paddingLeft: "5px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    <li
                                        className="page-item"
                                        key={i}
                                        onClick={(e) => {
                                            setCurrentRecommendVideoPage(i);
                                            e.preventDefault();
                                        }}
                                    >
                                        <a className="page-link" href="!#">
                                            {i + 1}
                                        </a>
                                    </li>
                                </div>
                            );
                        })}
                </ul>
            </nav>
            <div className="row">
                <div className="col-md-3"></div>
                <div className="col-md-9">
                    <div className="row" style={{marginTop: "20px"}}>
                        <Typography
                            component="h3"
                            variant="h5"
                            style={{color: "#FCFCFC"}}
                        >
                            所有視頻
                        </Typography>
                        {videoList.map(function (value, index) {
                            return (
                                <div className="col-sm-6 col-md-4 col-lg-4">
                                    <Card className={classes.Card}>
                                        <div className={classes.TimeTag}>
                                            {convertTime(value.duration)}
                                        </div>
                                        <CardActionArea
                                            component={Link}
                                            to={{
                                                pathname: `/player/id/${value.id}`,
                                                state: {
                                                    url: value.url,
                                                    videoName: value.fileName,
                                                    category: value.category,
                                                    timestamp: value.timestamp,
                                                    id: value.id,
                                                },
                                            }}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                className={classes.CardMedia}
                                                component="video"
                                                alt="video"
                                                width="100%"
                                                height="200"
                                                title={value.fileName}
                                                muted={true}
                                                src={`${value.url}#t=0.5`}
                                            />
                                        </CardActionArea>
                                        <CardContent style={{color: "#FCFCFC"}}>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                {value.fileName}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                {convertTimeStamp(value.timestamp)}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h8"
                                                component="div"
                                            >
                                                <div className={classes.Tag}>
                                                    {value.category}
                                                </div>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <nav className={classes.Pagination}>
                    <ul className="pagination pg-blue justify-content-center">
                        {Array(Math.ceil(totalDataCount / dataRange))
                            .fill()
                            .map(function (_, i) {
                                return (
                                    <div
                                        className="pagination"
                                        style={{
                                            borderRadius: "20px",
                                            paddingLeft: "5px",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        <li
                                            className="page-item"
                                            key={i}
                                            onClick={(e) => {
                                                setPageNumber(i);
                                                e.preventDefault();
                                            }}
                                        >
                                            <a className="page-link" href="!#">
                                                {i + 1}
                                            </a>
                                        </li>
                                    </div>
                                );
                            })}
                    </ul>
                </nav>
            </div>
        </div>
    );

    function onMouseOver(e) {
        e.target.play();
    }

    function onMouseOut(e) {
        e.target.pause();
    }

    function convertTime(num) {
        var minutes = Math.floor(num / 60);
        var seconds = Math.round(num % 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        var timestamp = minutes + ":" + seconds;

        return timestamp;
    }

    function paginate(array, page_size, page_number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function getAllMedia() {
        var reversedVideoArray = [];
        var videoArray = [];
        firebase
            .database()
            .ref("VideoList/")
            .on("value", function (snapshot) {
                if (snapshot.val()) {
                    var keys = Object.keys(snapshot.val()).sort();
                    setTotalDataCount(keys.length);
                    snapshot.forEach(function (video) {
                        videoArray.push(video.val());
                    });
                    reversedVideoArray = [...videoArray].reverse();
                    setVideoList(paginate(reversedVideoArray, dataRange, pageNumber + 1));
                }
            });
    }

    function getLatestMedia() {
        var latestVideoArray = [];
        var reversedVideoArray = [];
        firebase
            .database()
            .ref("VideoList")
            .orderByChild("category")
            .equalTo("香港")
            .on("value", function (snapshot) {
                if (snapshot.val()) {
                    var keys = Object.keys(snapshot.val()).sort().reverse();
                    setTotalRecommendVideo(keys.length);
                    snapshot.forEach(function (video) {
                        latestVideoArray.push(video.val());
                    });
                    reversedVideoArray = [...latestVideoArray].reverse();
                    setLatestVideo(
                        paginate(
                            reversedVideoArray,
                            dataRange,
                            currentRecommendVideoPage + 1
                        )
                    );
                }
            });
    }

    function convertTimeStamp(timestamp) {
        var date = new Date(timestamp);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

        var newDate = year + "-" + month + "-" + day;

        return newDate;
    }
}

export default withRouter(withStyles(styles)(Home));
