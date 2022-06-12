import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Button,
    Theme,
    Breakpoint,
    Box,
    CircularProgress,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import queryString from "query-string";
import "../Home/index.css";
import { useCategories } from "../App";
import { Video } from "../../types/video";
import { api } from "../../api";
import VideoCard from "../VideoCard";
import Loader from "../../lib/loader";

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
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
        backgroundColor: "#222",
    }),
    Card: {
        marginTop: 2,
        height: 42,
        backgroundColor: "#222",
    },
    Tag: {
        width: 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
    TimeTag: {
        width: 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
    Pagination: {
        marginTop: 2 * 8,
        marginBottom: 3 * 8,
    },
    CardMedia: {
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
    },
    submit: {
        marginTop: 3,
        color: "white",
        fontSize: "20px",
    },
};

function Home() {
    const path = window.location.pathname;
    const initialQueryString = queryString.parse(window.location.search);
    const initialPageNumber = Number(initialQueryString.page) || 0;

    const [popularVideos, setPopularVideos] = useState<Video[] | null>(null);
    const [latestVideos, setLatestVideo] = useState<Video[] | null>(null);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(18);
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [totalRecommendVideo, setTotalRecommendVideo] = useState(0);
    const [currentRecommendVideoPage, setCurrentRecommendVideoPage] = useState(0);

    const categoryArray = useCategories();

    const navigate = useNavigate();

    useEffect(() => {
        getPopularVideos();
        getLatestVideos();
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
                        {latestVideos ? (
                            latestVideos.map((value, index) => (
                                <VideoCard video={value} key={index} />
                            ))
                        ) : (
                            <Loader position="flex-start" />
                        )}
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
                                key={i}
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
                            熱門視頻
                        </Typography>
                        {popularVideos ? (
                            popularVideos.map((value, index) => (
                                <VideoCard video={value} key={index} />
                            ))
                        ) : (
                            <Loader position="flex-start" />
                        )}
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

    function getPopularVideos() {
        api.get(`/videos?filter=popular&page=${pageNumber + 1}&limit=${dataRange}`).then(({ data }) => {
            setTotalDataCount(data.videos.length);
            setPopularVideos(data.videos);
        });
    }

    function getLatestVideos() {
        api.get(`/videos?filter=latest&page=${pageNumber + 1}&limit=${dataRange}`).then(
            ({ data }) => {
                setTotalRecommendVideo(data.videos.length);
                setLatestVideo(data.videos);
            }
        );
    }
}

export default Home;
