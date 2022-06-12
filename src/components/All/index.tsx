import React, { useEffect, useState } from "react";
import { Typography, Paper, Button, Box } from "@mui/material";
import { Link } from "react-router-dom";
import "../Bar/index.css";
import { useCategories } from "../App";
import { Breakpoint, Theme } from "@mui/material";
import { Video } from "../../types/video";
import VideoCard from "../VideoCard";
import { api } from "../../api";
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
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
        backgroundColor: "#222",
    }),
    Card: {
        marginTop: 2,
        height: 45,
        backgroundColor: "#222",
    },
    Tag: {
        width: 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "10px",
        borderColor: "#ffffff",
        borderStyle: "solid",
    },
    Pagination: {
        marginTop: 16,
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
    TimeTag: {
        width: 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
};

function All() {
    const [videoList, setVideoList] = useState<Video[] | null>(null);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);
    const categories = useCategories();

    useEffect(() => {
        getAllMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, totalDataCount, categories]);

    return (
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
                                {categories.map(function (value, index) {
                                    return (
                                        <Button
                                            sx={styles.submit}
                                            component={Link}
                                            key={index}
                                            to={`/filter/category/${value}`}
                                        >
                                            {value.categoryName}
                                        </Button>
                                    );
                                })}
                            </ul>
                        </div>
                    </Paper>
                </div>
                <div className="col-md-9">
                    <div className="row" style={{ marginTop: "20px" }}>
                        {videoList ? videoList.map((value, index) => (
                            <VideoCard video={value} key={index} />
                        )) : <Loader />}
                    </div>
                </div>
                <nav style={styles.Pagination}>
                    <ul className="pagination pg-blue justify-content-center">
                        {[...Array(Math.ceil(totalDataCount / dataRange))].map(function (
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
        </Box>
    );

    function getAllMedia() {
        api.get(`/videos?page=${pageNumber + 1}&limit=${dataRange}`).then(({ data }) => {
            setTotalDataCount(data.videos.length);
            setVideoList(data.videos);
        });
    }
}

export default All;
