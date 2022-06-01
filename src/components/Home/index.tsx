import React, { useEffect, useState, useRef } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
} from "@material-ui/core";
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import queryString from "query-string";
import "../Home/index.css";
import { useCategories } from "../App";
import { Breakpoint, Theme } from "@mui/material";
import { Video } from "../../types/video";
import { api } from "../../api";

const styles = (theme: Theme) =>
    ({
        main: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            marginLeft: Number(theme.spacing()) * 3,
            marginRight: Number(theme.spacing()) * 3,
            marginTop: Number(theme.spacing()) * 5,
            [theme.breakpoints.up(("auto" + Number(theme.spacing()) * 3 * 2) as Breakpoint)]:
                {
                    width: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                },
            backgroundColor: "#210548",
        },
        paper: {
            marginTop: Number(theme.spacing()) * 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${Number(theme.spacing()) * 2}px ${Number(theme.spacing()) * 3}px ${
                Number(theme.spacing()) * 3
            }px`,
            backgroundColor: "#210548",
        },

        Card: {
            marginTop: Number(theme.spacing()) * 2,
            height: Number(theme.spacing()) * 42,
            backgroundColor: "#210548",
        },
        Tag: {
            width: Number(theme.spacing()) * 10,
            backgroundColor: "#FFC0CB",
            textAlign: "center",
            borderRadius: "6px",
            borderColor: "#ffffff",
        },
        TimeTag: {
            width: Number(theme.spacing()) * 8,
            backgroundColor: "#808080",
            textAlign: "center",
            borderRadius: "6px",
            borderColor: "#ffffff",
        },
        Pagination: {
            marginTop: Number(theme.spacing()) * 2,
            marginBottom: Number(theme.spacing()) * 3,
        },
        CardMedia: {
            paddingLeft: Number(theme.spacing()) * 1,
            paddingRight: Number(theme.spacing()) * 1,
            paddingTop: Number(theme.spacing()) * 1,
        },
        submit: {
            marginTop: Number(theme.spacing()) * 3,
            color: "white",
            fontSize: "20px",
        },
    } as Styles<Theme, {}, never>);

function Home(props: { classes: any }) {
    const { classes } = props;
    const ref = useRef(null);
    const path = window.location.pathname;
    const initialQueryString = queryString.parse(window.location.search);
    const initialPageNumber = Number(initialQueryString.page) || 0;

    const [videoList, setVideoList] = useState<Video[]>([]);
    const [latestVideo, setLatestVideo] = useState<Video[]>([]);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(18);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [totalRecommendVideo, setTotalRecommendVideo] = useState(0);
    const [currentRecommendVideoPage, setCurrentRecommendVideoPage] = useState(0);

    const categoryArray = useCategories();

    const navigate = useNavigate();

    useEffect(() => {
        getAllMedia();
        getLatestMedia();
        navigate(`${path}?page=${pageNumber}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        pageNumber,
        totalDataCount,
        totalRecommendVideo,
        currentRecommendVideoPage,
        navigate,
        path,
    ]);

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
                                                id={String(index)}
                                                component={Link}
                                                to={`/filter/category/${value}`}
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
                        <Typography
                            component="h3"
                            variant="h5"
                            style={{ color: "#FCFCFC", marginTop: "20px" }}
                        >
                            最新視頻
                        </Typography>
                        {latestVideo.map(function (value, index) {
                            return (
                                <div className="col-sm-4 col-md-3 col-lg-3">
                                    <Card className={classes.Card}>
                                        <div className={classes.TimeTag}>
                                            {convertTime(value.videoDuration)}
                                        </div>
                                        <CardActionArea
                                            component={Link}
                                            to={`/player/id/${value.videoId}`}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                className={classes.CardMedia}
                                                component={
                                                    value.videoPreviewImage
                                                        ? "img"
                                                        : "video"
                                                }
                                                alt="video"
                                                width="100%"
                                                height="200"
                                                title={value.videoDisplayName}
                                                muted={true}
                                                src={`${
                                                    value.videoPreviewImage ||
                                                    value.videoUrl
                                                }#t=0.5`}
                                                // onMouseOver={(e) => onMouseOver(e)}
                                                // onMouseOut={(e) => onMouseOut(e)}
                                                // loop
                                                // playsinline
                                            />
                                        </CardActionArea>
                                        <CardContent style={{ color: "#FCFCFC" }}>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                {value.videoDisplayName}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                {convertTimeStamp(value.uploadTime)}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                <div className={classes.Tag}>
                                                    {value.category.categoryName}
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
                    {[...Array(Math.ceil(totalRecommendVideo / dataRange))].map(function (
                        _,
                        i
                    ) {
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
                    <div className="row" style={{ marginTop: "20px" }}>
                        <Typography
                            component="h3"
                            variant="h5"
                            style={{ color: "#FCFCFC" }}
                        >
                            所有視頻
                        </Typography>
                        {videoList.map(function (value, index) {
                            return (
                                <div className="col-sm-6 col-md-4 col-lg-4">
                                    <Card className={classes.Card}>
                                        <div className={classes.TimeTag}>
                                            {convertTime(value.videoDuration)}
                                        </div>
                                        <CardActionArea
                                            component={Link}
                                            to={`/player/id/${value.videoId}`}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                className={classes.CardMedia}
                                                component={
                                                    value.videoPreviewImage
                                                        ? "img"
                                                        : "video"
                                                }
                                                alt="video"
                                                width="100%"
                                                height="200"
                                                title={value.videoDisplayName}
                                                muted={true}
                                                src={`${
                                                    value.videoPreviewImage ||
                                                    value.videoUrl
                                                }#t=0.5`}
                                            />
                                        </CardActionArea>
                                        <CardContent style={{ color: "#FCFCFC" }}>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                {value.videoDisplayName}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                {convertTimeStamp(value.uploadTime)}
                                            </Typography>
                                            <Typography
                                                gutterBottom
                                                variant="h6"
                                                component="div"
                                            >
                                                <div className={classes.Tag}>
                                                    {value.category.categoryName}
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
                            .fill(undefined)
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

    function convertTime(num: number) {
        let minutes: string | number = Math.floor(num / 60);
        let seconds: string | number = Math.round(num % 60);

        if (minutes < 10) {
            minutes = "0" + minutes;
        }

        if (seconds < 10) {
            seconds = "0" + seconds;
        }

        const timestamp = minutes + ":" + seconds;

        return timestamp;
    }

    function paginate(array: any[], page_size: number, page_number: number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function getAllMedia() {
        api.get(`/videos`).then(({ data }) => {
            setTotalDataCount(data.videos.length);
            setVideoList(paginate(data.videos, dataRange, pageNumber + 1));
        });
    }

    function getLatestMedia() {
        api.get(`/videos?filter=latest`).then(({ data }) => {
            setTotalRecommendVideo(data.videos.length);
            setLatestVideo(paginate(data.videos, dataRange, pageNumber + 1));
        });
    }

    function convertTimeStamp(timestamp: string) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        let month: string | number = date.getMonth() + 1;
        let day: string | number = date.getDate();

        if (day < 10) {
            day = "0" + day;
        }
        if (month < 10) {
            month = "0" + month;
        }

        const newDate = year + "-" + month + "-" + day;

        return newDate;
    }
}

export default withStyles(styles)(Home);
