import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
    IconButton,
} from "@material-ui/core";
import queryString from "query-string";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import Bar from "../Bar";
import "../Bar/index.css";
import { useCategories } from "../App";

const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.space * 3,
        marginRight: theme.space * 3,
        marginTop: theme.space * 5,
        [theme.breakpoints.up("auto" + theme.space * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    },
    paper: {
        marginTop: theme.space * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${
            theme.space * 3
        }px`,
        backgroundColor: "#222",
    },

    Card: {
        marginTop: theme.space * 2,
        height: theme.space * 45,
        backgroundColor: "#222",
    },
    Tag: {
        width: theme.space * 10,

        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "10px",
        borderColor: "#ffffff",
        borderStyle: "solid",
    },
    Pagination: {
        marginTop: theme.space * 2,
    },
    CardMedia: {
        paddingLeft: theme.space * 1,
        paddingRight: theme.space * 1,
        paddingTop: theme.space * 1,
    },
    submit: {
        marginTop: theme.space * 3,
        color: "white",
        fontSize: "20px",
    },
    TimeTag: {
        width: theme.space * 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
});

function Search(props) {
    const { classes } = props;
    const [videoList, setVideoList] = useState([]);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);

    const categoryArray = useCategories();
    const query = queryString.parse(window.location.search).q || "";

    useEffect(() => {
        getVideoByQuery();
    }, [pageNumber, totalDataCount]);

    return (
        <div className={classes.main}>


            <div className="row">
                <div className="col-md-3">
                    <Paper className={classes.paper}>
                        <Typography
                            component="h1"
                            variant="h5"
                            style={{ color: "#FCFCFC" }}
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
                    <div className="row" style={{ marginTop: "20px" }}>
                        {videoList.map(function (value, index) {
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
                                                className={classes.CardMedia}
                                                component={
                                                    value.previewUrl ? "img" : "video"
                                                }
                                                alt="video"
                                                width="100%"
                                                height="200"
                                                title={value.fileName}
                                                src={`${
                                                    value.previewUrl || value.url
                                                }#t=0.5`}
                                            />
                                        </CardActionArea>
                                        <CardContent style={{ color: "white" }}>
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
                                            onClick={() => setPageNumber(i)}
                                        >
                                            <a className="page-link" href="#">
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

    function getVideoByQuery() {
        var videoArray = [];
        var reversedArray = [];
        firebase
            .database()
            .ref("VideoList/")
            .orderByChild("fileName")
            .startAt(query)
            .endAt(query + "\uf8ff")
            .on("value", function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(function (value) {
                        if (value.val()) {
                            videoArray.push(value.val());

                            reversedArray = [...videoArray].reverse();
                            setVideoList(
                                paginate(reversedArray, dataRange, pageNumber + 1)
                            );
                        }
                    });
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

export default withRouter(withStyles(styles)(Search));
