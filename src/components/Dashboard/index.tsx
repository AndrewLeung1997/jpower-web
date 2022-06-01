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
} from "@material-ui/core";
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import { Link, Navigate, useNavigate } from "react-router-dom";
import firebase from "firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import PublishIcon from "@material-ui/icons/Publish";
import "../Player/style.css";
import { db } from "../../firebase";
import { useCategories, useUser } from "../App";
import { Delete } from "@material-ui/icons";
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
            marginBottom: Number(theme.spacing()) * 3,
            [theme.breakpoints.up(("auto" + Number(theme.spacing()) * 3 * 2) as Breakpoint)]:
                {
                    width: "auto",
                    marginLeft: "auto",
                    marginRight: "auto",
                },
        },
        paper: {
            marginTop: Number(theme.spacing()) * 6,
            marginBottom: Number(theme.spacing()) * 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${Number(theme.spacing()) * 2}px ${Number(theme.spacing()) * 3}px ${
                Number(theme.spacing()) * 3
            }px`,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            border: "2px",
            marginTop: Number(theme.spacing()),
            paddingBottom: "10px",
        },
        submit: {
            marginTop: Number(theme.spacing()) * 3,
            width: "200px",
        },
        tableHeader: {
            fontSize: "15px",
        },
    } as Styles<Theme, {}, never>);

function Dashboard(props: { classes: any }) {
    const { classes } = props;
    const categories = useCategories();

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
            }).then((res) => {
                alert("Category added!");
            });
            setNewCategory("");
        }
    };

    useEffect(() => {
        fetchAllVideo();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pageNumber, totalDataCount, dataRange]);

    if (!user) {
        // not logged in
        alert("Please login first");
        return <Navigate to="/login" />;
    }

    return (
        <main className={classes.main}>
            <Bar></Bar>
            {/* Add category */}
            <Paper className={classes.paper} style={{ marginTop: 90 }}>
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
                <Table className={classes.table}>
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
                        {video.map(function (value, key) {
                            return (
                                <TableRow key={key}>
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
                                                value.videoTag.map(function (
                                                    value,
                                                    index
                                                ) {
                                                    return (
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
                                                    );
                                                })}
                                        </div>
                                    </TableCell>
                                    <TableCell align="center">
                                        <IconButton
                                            component={Link}
                                            to={`/updateVideoInfo`}
                                        >
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
                                                ) {
                                                    const query = firebase
                                                        .database()
                                                        .ref("VideoList/")
                                                        .orderByChild("url")
                                                        .equalTo(value.videoUrl);
                                                    query.once(
                                                        "child_added",
                                                        (snapshot) => {
                                                            snapshot.ref
                                                                .remove()
                                                                .then(() => {
                                                                    alert(
                                                                        "Video removed."
                                                                    );
                                                                    fetchAllVideo();
                                                                });
                                                        }
                                                    );
                                                }
                                            }}
                                        >
                                            <Delete color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={totalDataCount}
                    onPageChange={handlePageChange}
                    onChangeRowsPerPage={handleRowsPerPageChange}
                    page={pageNumber}
                    rowsPerPage={dataRange}
                    rowsPerPageOptions={[5, 10]}
                />
            </TableContainer>
        </main>
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

    function paginate(array: any[], page_size: number, page_number: number) {
        return array.slice((page_number - 1) * page_size, page_number * page_size);
    }

    function fetchAllVideo() {
        api.get(`/videos?sort=latest`).then(({ data }) => {
            setTotalDataCount(data.videos.length);
            setVideo(paginate(data.videos, dataRange, pageNumber + 1));
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

export default withStyles(styles)(Dashboard);
