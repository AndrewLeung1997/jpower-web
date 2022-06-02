import React, { useEffect, useState, useRef } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
    Theme,
    Breakpoint,
    Box,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import queryString from "query-string";
import "../Home/index.css";
import { useCategories } from "../App";
import { Video } from "../../types/video";
import { api } from "../../api";

const styles = {
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: 3,
        marginRight: 3,
        marginTop: 5,
        [theme.breakpoints.up(("auto" + theme.space * 3 * 2) as Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    }),
    paper: (theme: Theme) => ({
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
        backgroundColor: "#222",
    }),
    Card: (theme: Theme) => ({
        marginTop: 2,
        height: 42,
        backgroundColor: "#222",
    }),
    Tag: (theme: Theme) => ({
        width: 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    }),
    TimeTag: (theme: Theme) => ({
        width: 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    }),
    Pagination: {
        marginTop: 2 * 8,
        marginBottom: 3 * 8,
    },
    CardMedia: (theme: Theme) => ({
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
    }),
    submit: {
        marginTop: 3,
        color: "white",
        fontSize: "20px",
    },
};

function Home() {
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
        // <div sx={styles.root}>
        <Box sx={styles.main}>
            <Bar></Bar>
            <div className="row">
                <div className="col-md-3">
                    <Paper sx={styles.paper}>
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
                                        <li key={index}>
                                            <Button
                                                sx={styles.submit}
                                                id={String(index)}
                                                component={Link}
                                                to={`/filter/category/${value.categoryId}`}
                                            >
                                                {value.categoryName}
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
                                    <Card sx={styles.Card}>
                                        <Box sx={styles.TimeTag}>
                                            {convertTime(value.videoDuration)}
                                        </Box>
                                        <CardActionArea
                                            component={Link}
                                            to={`/player/id/${value.videoId}`}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                sx={styles.CardMedia}
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
                                                <Box sx={styles.Tag}>
                                                    {value.category.categoryName}
                                                </Box>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            <nav style={styles.Pagination}>
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
                                    <Card sx={styles.Card}>
                                        <Box sx={styles.TimeTag}>
                                            {convertTime(value.videoDuration)}
                                        </Box>
                                        <CardActionArea
                                            component={Link}
                                            to={`/player/id/${value.videoId}`}
                                        >
                                            <CardMedia
                                                preload="metadata"
                                                ref={ref}
                                                id="video"
                                                sx={styles.CardMedia}
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
                                                <Box sx={styles.Tag}>
                                                    {value.category.categoryName}
                                                </Box>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <nav style={styles.Pagination}>
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
                                        key={i}
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
        </Box>
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

export default Home;
