import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import "../Home/index.css";
import { Video } from "../../types/video";
import { api } from "../../api";
import VideoCard from "../VideoCard";
import Loader from "../../lib/loader";
import CategoryList from "../categoryList";
import PaginateButtons from "../../lib/paginateButtons";
import { commonStyles } from "../../lib/styles";

function Home() {
    const path = window.location.pathname;
    const initialQueryString = queryString.parse(window.location.search);
    const initialPageNumber = Number(initialQueryString.page) || 0;

    const [popularVideos, setPopularVideos] = useState<Video[] | null>(null);
    const [latestVideos, setLatestVideos] = useState<Video[] | null>(null);
    const [totalPopularVideo, setTotalPopularVideo] = useState(0);
    const [dataRange] = useState(18);
    const [popularVideoPage, setPopularVideoPage] = useState(initialPageNumber);
    const [totalLatestVideo, setTotalLatestVideo] = useState(0);
    const [latestVideoPage, setLatestVideoPage] = useState(0);

    const navigate = useNavigate();

    useEffect(() => {
        getPopularVideos();
        getLatestVideos();
        navigate(`${path}?page=${popularVideoPage}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        popularVideoPage,
        totalPopularVideo,
        totalLatestVideo,
        latestVideoPage,
        navigate,
        path,
    ]);

    return (
        <Box sx={commonStyles.main}>
            <div className="row">
                <CategoryList />
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
            <PaginateButtons
                setPageNumber={setLatestVideoPage}
                dataRange={dataRange}
                totalDataCount={totalLatestVideo}
            />
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
                <PaginateButtons
                    totalDataCount={totalPopularVideo}
                    dataRange={dataRange}
                    setPageNumber={setPopularVideoPage}
                />
            </div>
        </Box>
    );

    function getPopularVideos() {
        api.get(`/videos?filter=popular&page=${popularVideoPage + 1}&limit=${dataRange}`).then(
            ({ data }) => {
                setTotalPopularVideo(data.count);
                setPopularVideos(data.videos);
            }
        );
    }

    function getLatestVideos() {
        api.get(`/videos?filter=latest&page=${popularVideoPage + 1}&limit=${dataRange}`).then(
            ({ data }) => {
                setTotalLatestVideo(data.count);
                setLatestVideos(data.videos);
            }
        );
    }
}

export default Home;
