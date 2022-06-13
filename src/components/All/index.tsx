import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "../Bar/index.css";
import { Video } from "../../types/video";
import VideoCard from "../VideoCard";
import { api } from "../../api";
import Loader from "../../lib/loader";
import CategoryList from "../categoryList";
import { commonStyles } from "../../lib/styles";
import PaginateButtons from "../../lib/paginateButtons";

function All() {
    const [videoList, setVideoList] = useState<Video[] | null>(null);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);

    useEffect(() => {
        setVideoList(null);
        getAllMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber]);

    return (
        <Box sx={commonStyles.main}>
            <Box className="row">
                <CategoryList />
                <Box className="col-md-9">
                    <Box className="row" style={{ marginTop: "20px" }}>
                        {videoList ? (
                            videoList.map((value, index) => (
                                <VideoCard video={value} key={index} />
                            ))
                        ) : (
                            <Loader sx={{ marginTop: 5 }} />
                        )}
                    </Box>
                </Box>
                <PaginateButtons
                    totalDataCount={totalDataCount}
                    dataRange={dataRange}
                    setPageNumber={setPageNumber}
                />
            </Box>
        </Box>
    );

    function getAllMedia() {
        api.get(`/videos?page=${pageNumber + 1}&limit=${dataRange}`).then(({ data }) => {
            setTotalDataCount(data.count);
            setVideoList(data.videos);
        });
    }
}

export default All;
