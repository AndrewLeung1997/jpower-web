import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    Button,
    CardActions,
    CardHeader,
    Theme,
    Breakpoint,
    Box,
    CircularProgress,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import "../Player/style.css";
import "video-react/dist/video-react.css";
import { Video } from "../../types/video";
import VideoCard from "../VideoCard";
import { convertTimeStamp } from "../../lib/convertTimeStamp";
import { api } from "../../api";
import {
    BigPlayButton,
    ControlBar,
    ForwardControl,
    PlaybackRateMenuButton,
    Player,
    ReplayControl,
} from "video-react";

const styles = {
    root: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        [theme.breakpoints.up(("auto" + theme.space * 3 * 2) as Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    }),
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: 2,
        marginRight: 2,
        [theme.breakpoints.up(("auto" + 3 * 2) as Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    }),

    relatedVideoPaper: (theme: Theme) => ({
        marginTop: 2,
        // marginBottom: theme.space * 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${theme.space * 2}px`,
        backgroundColor: "#222",
        color: "white",
    }),
    paper: (theme: Theme) => ({
        marginTop: 10,
        marginBottom: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${theme.space * 2}px`,
        backgroundColor: "#222",
    }),

    videoName: {
        marginTop: 3,
        fontSize: "20px",
    },
    Tag: {
        width: 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "10px",
        borderColor: "#ffffff",
        borderStyle: "solid",
    },
    Card: {
        marginTop: 2,
        height: 45,
        backgroundColor: "#222",
        color: "white",
    },
    VideoCard: (theme: Theme) => ({
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${theme.space * 2}px`,
        height: "auto",
        backgroundColor: "#222",
    }),
    CardMedia: {
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
    },
    titleBar: {
        display: "block",
        width: "100%",
        overflow: "hidden",
        textOverflow: "ellipsis",
        lineHeight: "normal",
    },
    submit: {
        marginTop: 3,
        color: "white",
    },
    adView: {
        position: "absolute",
        left: 50,
        top: 50,
    },
    category: {
        marginTop: 1,
        color: "#FCFCFC",
    },
    title: {
        color: "#FCFCFC",
    },
    TimeTag: {
        width: 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
};

function VideoPlayer() {
    const [relatedVideo, setRelatedVideo] = useState<Video[]>([]);
    const [video, setVideo] = useState<Video | null>(null);

    const params = useParams();
    const videoId = params.id;

    useEffect(() => {
        setVideo(null);
        setRelatedVideo([]);
        getVideoByID();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    return (
        <Box sx={styles.main}>
            {!video ? (
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "center",
                        marginTop: 11,
                    }}
                >
                    <CircularProgress />
                </Box>
            ) : (
                <React.Fragment>
                    <div className="row">
                        <div className="col-md-12">
                            <Card sx={styles.VideoCard}>
                                <CardHeader
                                    sx={styles.title}
                                    title={video?.videoDisplayName}
                                ></CardHeader>
                                <CardActions>
                                    {/* @ts-ignore */}
                                    <CardMedia
                                        sx={styles.CardMedia}
                                        component={Player}
                                        poster={video?.videoPreviewImage}
                                        preload="metadata"
                                        src={video?.videoUrl}
                                        fluid={window.innerHeight > 600}
                                        width={"100%"}
                                        height={window.innerHeight * 0.8}
                                    >
                                        {/* @ts-ignore */}
                                        <ControlBar>
                                            {/* @ts-ignore */}
                                            <ReplayControl seconds={10} order={2.1} />
                                            {/* @ts-ignore */}
                                            <ForwardControl seconds={10} order={3.1} />
                                            <PlaybackRateMenuButton
                                                rates={[5, 2, 1, 0.5]}
                                                // @ts-ignore
                                                order={4.1}
                                            />
                                        </ControlBar>
                                        <BigPlayButton position="center" />
                                        <source src={video?.videoUrl} />
                                    </CardMedia>
                                </CardActions>
                                <CardContent style={{ color: "#FCFCFC" }}>
                                    <Typography gutterBottom variant="h6" component="div">
                                        上載時間： {convertTimeStamp(video?.uploadTime)}
                                    </Typography>
                                    <div className="box">
                                        <Typography
                                            gutterBottom
                                            variant="h6"
                                            component="div"
                                            style={{
                                                color: "#FCFCFC",
                                                paddingTop: "12px",
                                                paddingRight: "10px",
                                            }}
                                        >
                                            標籤:
                                        </Typography>
                                        {video?.videoTag?.map((value, index) => (
                                            <div className="tag" key={index}>
                                                <Button
                                                    style={{ paddingLeft: "2px" }}
                                                    component={Link}
                                                    to={`/Search/tag/${value}`}
                                                >
                                                    {value}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                    <Typography
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                        style={{
                                            color: "#FCFCFC",
                                            paddingTop: "12px",
                                            paddingRight: "10px",
                                        }}
                                    >
                                        類別:
                                    </Typography>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        color="secondary"
                                        component={Link}
                                        to={`/filter/category/${video?.category?.categoryId}`}
                                        sx={styles.category}
                                    >
                                        {video?.category?.categoryName}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                    <Paper sx={styles.relatedVideoPaper}>
                        <Typography
                            sx={styles.videoName}
                            component="h2"
                            variant="h5"
                            align="left"
                        >
                            相關影片
                        </Typography>
                        <Box className="row" sx={{ width: "90vw" }}>
                            {relatedVideo.map((value, index) => (
                                <VideoCard video={value} key={index} />
                            ))}
                        </Box>
                    </Paper>
                </React.Fragment>
            )}
        </Box>
    );

    function getVideoByID() {
        api.get(`/videos/${videoId}`)
            .then((res: { data: { video: Video } }) => {
                setVideo(res.data.video);
                getVideoByCategory(res.data.video.category.categoryId);
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }

    function getVideoByCategory(category: number) {
        api.get(`/videos?cat=${category}&limit=20`)
            .then((res: { data: { videos: Video[] } }) => {
                setRelatedVideo(
                    res.data.videos.filter((value) => value.videoId !== videoId)
                );
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }
}

export default VideoPlayer;
