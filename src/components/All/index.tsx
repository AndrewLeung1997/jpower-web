import React, { useEffect, useState } from "react";
import { Box } from "@mui/material";
import "../Bar/index.css";
import { useCategories } from "../App";
import { Breakpoint, Theme } from "@mui/material";
import { Video } from "../../types/video";
import VideoCard from "../VideoCard";
import { api } from "../../api";
import Loader from "../../lib/loader";
import CategoryList from "../categoryList";
import { commonStyles } from "../../lib/styles";

const styles = {
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: 3,
        marginRight: 3,
        marginTop: 7,
        [theme.breakpoints.up(("auto" + theme.space * 3 * 2) as Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    }),
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
                <Box style={commonStyles.Pagination}>
                    <ul className="pagination pg-blue justify-content-center">
                        {[...Array(Math.ceil(totalDataCount / dataRange))].map(function (
                            _,
                            i
                        ) {
                            return (
                                <Box
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
                                </Box>
                            );
                        })}
                    </ul>
                </Box>
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
