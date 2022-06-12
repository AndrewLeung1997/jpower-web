import React, { useEffect, useState } from "react";
import { Theme, Breakpoint, Box } from "@mui/material";
import { useCategories } from "../App";
import CategoryList from "../categoryList";
import VideoCard from "../VideoCard";
import PaginateButtons from "../../lib/paginateButtons";
import { Navigate, useParams } from "react-router-dom";
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
};

function Home() {
    const [videoList, setVideoList] = useState([]);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange] = useState(15);
    const [pageNumber, setPageNumber] = useState(0);

    const categories = useCategories();

    const params = useParams();
    const categoryId = Number(params.category);

    useEffect(() => {
        if (categoryId) getCategoryMedia();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, totalDataCount, categories]);

    if (!categoryId) {
        alert("category id invalid.");
        return <Navigate to="/" />;
    }

    return (
        <Box sx={styles.main}>
            <div className="row">
                <CategoryList />
                <div className="col-md-9">
                    <div className="row" style={{ marginTop: "20px" }}>
                        {videoList.map((value, index) => (
                            <VideoCard video={value} key={index} />
                        ))}
                    </div>
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
        api.get(`/videos?cat=${categoryId}&page=${pageNumber + 1}&limit=${dataRange}`).then(({ data }) => {
            setVideoList(data.videos);
            setTotalDataCount(data.count);
        })
    }
}

export default Home;
