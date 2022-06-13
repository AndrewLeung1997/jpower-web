import React, { useState, useEffect } from "react";
import {
    Paper,
    Button,
    Typography,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    Table,
    TableBody,
    TablePagination,
    IconButton,
    Box,
} from "@mui/material";
import { Link, Navigate } from "react-router-dom";
import {
    InsertLink as InsertLinkIcon,
    Publish as PublishIcon,
} from "@mui/icons-material";
import "../Player/style.css";
import { useUser } from "../App";
import { Delete } from "@mui/icons-material";
import { Theme } from "@mui/material";
import { Video } from "../../types/video";
import { api } from "../../api";
import { convertTimeStamp } from "../../lib/convertTimeStamp";
import { commonStyles } from "../../lib/styles";

const styles = {
    form: (theme: Theme) => ({
        width: "100%", // Fix IE 11 issue.
        border: "2px",
        marginTop: theme.space,
        paddingBottom: "10px",
    }),
    submit: {
        marginTop: 3,
        width: "200px",
    },
    tableHeader: {
        fontSize: "15px",
    },
};

function Dashboard() {
    const [video, setVideo] = useState<Video[]>([]);
    const [pageNumber, setPageNumber] = useState(0);
    const [totalDataCount, setTotalDataCount] = useState(0);
    const [dataRange, setDataRange] = useState(5);
    const [newCategory, setNewCategory] = useState("");
    const [user] = useUser();

    const createNewCategory = () => {
        if (newCategory) {
            api.post("/category/create", {
                categoryName: newCategory,
            }).then(() => {
                alert("Category added!");
            });
            setNewCategory("");
        }
    };

    useEffect(() => {
        fetchAllVideo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, totalDataCount, dataRange]);

    if (user?.role !== "admin") {
        // not logged in
        alert("Unauthorized.");
        return <Navigate to="/login" />;
    }

    return (
        <Box sx={commonStyles.main}>
            {/* Add category */}
            <Paper sx={commonStyles.paper} style={{ marginTop: 90 }}>
                <Typography style={{ alignSelf: "flex-start" }}>
                    <h4>Add new category</h4>
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "row", width: "100%" }}>
                    <input
                        className="form-control"
                        style={{ marginRight: 10 }}
                        id="tags"
                        type="text"
                        placeholder="Add category"
                        onChange={(e) => setNewCategory(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") createNewCategory();
                        }}
                    />
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            createNewCategory();
                        }}
                    >
                        Add
                    </Button>
                </Box>
            </Paper>
            <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                <Table sx={styles.tableHeader}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">上載日期</TableCell>
                            <TableCell align="center">連結</TableCell>
                            <TableCell align="center">影片標題</TableCell>
                            <TableCell align="center">類別</TableCell>
                            <TableCell align="center">標籤</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {video.map((value, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{value.videoId}</TableCell>
                                <TableCell align="center">
                                    {convertTimeStamp(value.uploadTime)}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton component={Link} to={value.videoUrl}>
                                        <InsertLinkIcon color="primary" />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    {value.videoDisplayName}
                                </TableCell>
                                <TableCell align="center">
                                    {value.category.categoryName}
                                </TableCell>
                                <TableCell align="center">
                                    <div className="box">
                                        {value.videoTag &&
                                            value.videoTag.map((value, index) => (
                                                <div className="tag">
                                                    <button
                                                        id={String(index)}
                                                        style={{
                                                            paddingLeft: "2px",
                                                        }}
                                                    >
                                                        {value}
                                                    </button>
                                                </div>
                                            ))}
                                    </div>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton component={Link} to={`/updateVideoInfo`}>
                                        <PublishIcon color="primary" />
                                    </IconButton>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    "Are you sure to delete this video?"
                                                )
                                            )
                                                api.delete(`/videos/${value.videoId}`)
                                                    .then(() => {
                                                        alert("Video deleted!");
                                                        fetchAllVideo();
                                                    })
                                                    .catch((err) => {
                                                        alert(
                                                            err?.response?.data ||
                                                                err?.response?.data
                                                        );
                                                    });
                                        }}
                                    >
                                        <Delete color="primary" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalDataCount}
                    onPageChange={handlePageChange}
                    onRowsPerPageChange={handleRowsPerPageChange}
                    page={pageNumber}
                    rowsPerPage={dataRange}
                    rowsPerPageOptions={[5, 10]}
                />
            </TableContainer>
        </Box>
    );

    function handlePageChange(
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        page: number
    ) {
        setPageNumber(page);
    }

    function handleRowsPerPageChange(event: React.ChangeEvent<HTMLInputElement>) {
        setDataRange(Number(event.target.value));
    }

    function fetchAllVideo() {
        api.get(`/videos?sort=latest&page=${pageNumber + 1}&limit=${dataRange}`).then(
            ({ data }) => {
                setTotalDataCount(data.videos.length);
                setVideo(data.videos);
            }
        );
    }
}

export default Dashboard;
