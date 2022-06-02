import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Button,
    CardActions,
    CardHeader,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import "../Player/style.css";
import "../Bar/index.css";

const styles = (theme) => ({
    root: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        [theme.breakpoints.up("auto" + theme.space * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    },
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.space * 2,
        marginRight: theme.space * 2,
        [theme.breakpoints.up("auto" + theme.space * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    },

    relatedVideoPaper: {
        marginTop: theme.space * 2,
        // marginBottom: theme.space * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${
            theme.space * 2
        }px`,
        backgroundColor: "#222",
        color: "white",
    },
    paper: {
        marginTop: theme.space * 8,
        marginBottom: theme.space * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${
            theme.space * 2
        }px`,
        backgroundColor: "#222",
    },

    videoName: {
        marginTop: theme.space * 3,

        fontSize: "20px",
    },
    Tag: {
        width: theme.space * 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "10px",
        borderColor: "#ffffff",
        borderStyle: "solid",
    },
    Card: {
        marginTop: theme.space * 2,
        height: theme.space * 45,
        backgroundColor: "#222",
        color: "white",
    },
    VideoCard: {
        marginTop: theme.space * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${
            theme.space * 2
        }px`,
        height: "auto",
        backgroundColor: "#222",
    },
    CardMedia: {
        paddingLeft: theme.space * 1,
        paddingRight: theme.space * 1,
        paddingTop: theme.space * 1,
    },
    titleBar: {
        display: "block",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "normal",
    },
    submit: {
        marginTop: theme.space * 3,
        color: "white",
    },
    adView: {
        position: "absolute",
        left: 50,
        top: 50,
    },
    category: {
        marginTop: theme.space * 1,
        color: "#FCFCFC",
    },
    title: {
        color: "#FCFCFC",
    },
    TimeTag: {
        width: theme.space * 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
});

function Player(props) {
    const { classes } = props;
    const [relatedVideo, setRelatedVideo] = useState([]);
    const [controlVideo, setControlVideo] = useState(true);
    const [url, setUrl] = useState("");
    const [count, setCount] = useState(0);
    const [intervalID, setIntervalID] = useState(-1);
    const [category, setCategory] = useState("");
    const [videoUrl, setVideoUrl] = useState("");
    const [videoName, setVideoName] = useState("");
    const [timestamp, setTimeStamp] = useState("");
    const [tags, setTags] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [watchCount, setWatchCount] = useState(0);
    const id = props.match.params.id;

    useEffect(() => {
        // startInterval()
        getVideoByID();
    }, []);

    return (
        <div className={classes.main}>

            <div className="row">
                <div className="col-md-12">
                    <Card className={classes.VideoCard}>
                        <CardHeader
                            className={classes.title}
                            title={videoName}
                        ></CardHeader>
                        <CardActions>
                            <CardMedia
                                className={classes.CardMedia}
                                component="video"
                                alt="video"
                                preload="metadata"
                                width="50%"
                                height="500"
                                title={videoName}
                                src={videoUrl}
                                controls={true}
                                onContextMenu={(e) => e.preventDefault()}
                                config={{
                                    file: { attributes: { controlsList: "nodownload" } },
                                }}
                            />
                        </CardActions>
                        <CardContent style={{ color: "#FCFCFC" }}>
                            <Typography gutterBottom variant="h8" component="div">
                                上載時間： {convertTimeStamp(timestamp)}
                            </Typography>
                            <div className="box">
                                <Typography
                                    gutterBottom
                                    variant="h8"
                                    component="div"
                                    style={{
                                        color: "#FCFCFC",
                                        paddingTop: "12px",
                                        paddingRight: "10px",
                                    }}
                                >
                                    標籤:
                                </Typography>
                                {tags.map(function (value, index) {
                                    return (
                                        <div>
                                            <div className="tag">
                                                <button
                                                    id={index}
                                                    style={{ paddingLeft: "2px" }}
                                                    component={Link}
                                                    to={{
                                                        pathname: `/filter/category/${category}`,
                                                        state: {
                                                            tag: value,
                                                        },
                                                    }}
                                                >
                                                    {value}
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <Typography
                                gutterBottom
                                variant="h8"
                                component="div"
                                style={{
                                    color: "#FCFCFC",
                                    paddingTop: "12px",
                                    paddingRight: "10px",
                                }}
                            >
                                類別:
                            </Typography>
                            <Button
                                type="submit"
                                variant="contained"
                                color="secondary"
                                component={Link}
                                to={{
                                    pathname: `/filter/category/${category}`,
                                    state: {
                                        category: category,
                                    },
                                }}
                                className={classes.category}
                            >
                                {category}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Paper className={classes.relatedVideoPaper}>
                <Typography
                    className={classes.videoName}
                    component="h2"
                    variant="h5"
                    align="left"
                >
                    相關影片
                </Typography>
                <div className="row">
                    {relatedVideo.map(function (value, index) {
                        console.log(value.previewUrl);
                        return (
                            <div className="col-md-4">
                                <Card className={classes.Card}>
                                    <div className={classes.TimeTag}>
                                        {convertTime(value.duration)}
                                    </div>
                                    <CardActionArea
                                        component={Link}
                                        to={{
                                            pathname: `/player/id/${value.id}`,
                                        }}
                                        target="_blank"
                                    >
                                        <CardMedia
                                            className={classes.CardMedia}
                                            component={value.previewUrl ? "img" : "video"}
                                            preload="metadata"
                                            alt={value.previewUrl ? "image" : "video"}
                                            width="100%"
                                            height="200"
                                            title={value.fileName}
                                            src={`${value.previewUrl || value.url}#t=0.5`}
                                        />
                                    </CardActionArea>
                                    <CardContent>
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
            </Paper>
        </div>
    );

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

    function getVideoByID() {
        firebase.db
            .ref("VideoList/")
            .orderByChild("id")
            .equalTo(id)
            .on("value", function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach(function (value) {
                        setVideoUrl(value.val().url);
                        setCategory(value.val().category);
                        setVideoName(value.val().fileName);
                        setTimeStamp(value.val().timestamp);

                        if (value.val().tag) {
                            setTags(value.val().tag);
                        }
                        if (value.val().watchCount) {
                            setWatchCount(value.val().watchCount);
                        }

                        getVideoByCategory(value.val().category);
                    });
                }
            });
    }

    function getVideoByCategory(category) {
        var filterArray = [];
        var reversedArray = [];
        firebase.db
            .ref("VideoList/")
            .orderByChild("category")
            .equalTo(category)
            .limitToLast(20)
            .on("value", function (snapshot) {
                if (snapshot.exists()) {
                    snapshot.forEach(function (result) {
                        filterArray.push(result.val());
                    });
                    reversedArray = [...filterArray].reverse();
                    console.log(filterArray);
                    setRelatedVideo(reversedArray);
                }
            });
    }
}

export default withRouter(withStyles(styles)(Player));
