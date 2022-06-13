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
    Box,
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
import Loader from "../../lib/loader";
import { commonStyles } from "../../lib/styles";
import { useIsSmallHeight, useIsSmallWidth } from "../App";

const styles = {
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
    videoName: {
        marginTop: 3,
        fontSize: "20px",
    },
    VideoCard: (theme: Theme) => ({
        display: "flex",
        flexDirection: "column",
        alignItems: "left",
        padding: `${theme.space * 1}px ${theme.space * 2}px ${theme.space * 2}px`,
        height: "auto",
        backgroundColor: "#222",
        width: "100%",
    }),
    category: {
        marginTop: 1,
        color: "#FCFCFC !important",
        textDecoration: "none",
        textTransform: "none",
    },
    title: {
        color: "#FCFCFC",
    },
};

function VideoPlayer() {
    const [relatedVideos, setRelatedVideos] = useState<Video[] | null>(null);
    const [popularVideos, setPopularVideos] = useState<Video[] | null>(null);
    const [video, setVideo] = useState<Video | null>(null);

    const params = useParams();
    const videoId = params.id;

    const isSmallHeight = useIsSmallHeight();
    const isSmallWidth = useIsSmallWidth();

    useEffect(() => {
        if (video) getVideoByCategory();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [video]);

    useEffect(() => {
        setVideo(null);
        setRelatedVideos(null);
        getVideoByID();
        getPopularVideos();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoId]);

    return (
        <Box sx={commonStyles.main}>
            {!video ? (
                <Loader sx={{ marginTop: 11 }} />
            ) : (
                <React.Fragment>
                    <Box className="row">
                        <Box className="col-md-12" sx={{ display: "flex", marginTop: 7 }}>
                            <Card sx={styles.VideoCard}>
                                <CardHeader
                                    sx={styles.title}
                                    title={video?.videoDisplayName}
                                ></CardHeader>
                                <CardActions>
                                    {/* @ts-ignore */}
                                    <CardMedia
                                        sx={commonStyles.CardMedia}
                                        component={Player}
                                        poster={video?.videoPreviewImage}
                                        preload="metadata"
                                        src={video?.videoUrl}
                                        fluid={!isSmallHeight}
                                        width={"100%"}
                                        height={450}
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
                                    <Typography gutterBottom variant="h6" component="div">
                                        觀看次數： {video?.viewCount}
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
                                                    sx={{
                                                        paddingLeft: "2px",
                                                        textDecoration: "none",
                                                        textTransform: "none",
                                                        color: "#FCFCFC !important",
                                                    }}
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
                            {!isSmallWidth && (
                                <Paper
                                    sx={{
                                        width: "30vw",
                                        maxHeight: "450px",
                                        overflow: "auto",
                                        backgroundColor: "#222",
                                        marginTop: 9,
                                    }}
                                >
                                    {relatedVideos ? (
                                        relatedVideos.map((value, index) => (
                                            <VideoCard
                                                video={value}
                                                key={index}
                                                sx={{ width: "100%" }}
                                            />
                                        ))
                                    ) : (
                                        <Loader />
                                    )}
                                </Paper>
                            )}
                        </Box>
                    </Box>
                    <Paper sx={styles.relatedVideoPaper}>
                        <Typography
                            sx={styles.videoName}
                            component="h2"
                            variant="h5"
                            align="left"
                        >
                            {isSmallWidth ? "相關影片" : "熱門影片"}
                        </Typography>
                        <Box className="row" sx={{ width: "90vw" }}>
                            {(() => {
                                const videos = isSmallWidth
                                    ? relatedVideos
                                    : popularVideos;
                                return videos ? (
                                    videos.map((value, index) => (
                                        <VideoCard video={value} key={index} />
                                    ))
                                ) : (
                                    <Loader position={"flex-start"} />
                                );
                            })()}
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
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }

    function getVideoByCategory() {
        api.get(`/videos?cat=${video?.category?.categoryId}&limit=20`)
            .then((res: { data: { videos: Video[] } }) => {
                setRelatedVideos(
                    res.data.videos.filter((value) => value.videoId !== videoId)
                );
                res.data.videos.filter((value) => value.videoId !== videoId)
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }

    function getPopularVideos() {
        api.get(`/videos?limit=20&filter=popular`)
            .then((res: { data: { videos: Video[] } }) => {
                setPopularVideos(res.data.videos);
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }
}

export default VideoPlayer;
