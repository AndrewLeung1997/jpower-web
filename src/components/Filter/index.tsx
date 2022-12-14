import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useCategories } from "../App";
import CategoryList from "../categoryList";
import VideoCard from "../VideoCard";
import PaginateButtons from "../../lib/paginateButtons";
import { Navigate, useParams } from "react-router-dom";
import { api } from "../../api";
import { commonStyles } from "../../lib/styles";
import { Video } from "../../types/video";
import Loader from "../../lib/loader";
import HashTag from "../../lib/hashtag";

function Home() {
    const [videoList, setVideoList] = useState<Video[] | null>(null);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);

    const categories = useCategories();

    const params = useParams();
    const categoryId = Number(params.category);

    useEffect(() => {
        setTotalDataCount(0);
        setPageNumber(0);
    }, [categoryId]);

    useEffect(() => {
        if (categoryId) {
            setVideoList(null);
            getCategoryMedia();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, categoryId]);

    if (!categoryId) {
        alert("category id invalid.");
        return <Navigate to="/" />;
    }

    return (
        <Box sx={commonStyles.main}>
            <div className="row">
                <CategoryList />
                <div className="col-md-9">
                    <Box className="row" sx={{ marginTop: 4 }}>
                        <Typography variant="h4" sx={{ color: "white" }}>
                            <HashTag />
                            {
                                categories.find(
                                    (category) => category.categoryId === categoryId
                                )?.categoryName
                            }
                        </Typography>
                        {videoList ? (
                            videoList.map((value, index) => (
                                <VideoCard video={value} key={index} />
                            ))
                        ) : (
                            <Loader position="flex-start" />
                        )}
                    </Box>
                </div>
                <PaginateButtons
                    totalDataCount={totalDataCount}
                    dataRange={dataRange}
                    setPageNumber={setPageNumber}
                />
            </div>
        </Box>
    );

    function getCategoryMedia() {
        api.get(
            `/videos?cat=${categoryId}&page=${pageNumber + 1}&limit=${dataRange}`
        ).then(({ data }) => {
            setVideoList(data.videos);
            setTotalDataCount(data.count);
        });
    }
}

export default Home;
