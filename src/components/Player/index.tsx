import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActions,
    CardHeader,
    Theme,
    Box,
} from "@mui/material";
import { useParams } from "react-router-dom";
import "../Player/style.css";
import { Video } from "../../types/video";
import VideoCard from "../VideoCard";
import { convertTimeStamp } from "../../lib/convertTimeStamp";
import { api } from "../../api";
import Loader from "../../lib/loader";
import { commonStyles } from "../../lib/styles";
import { useIsSmallHeight, useIsSmallWidth, useWidth } from "../App";
import TagBtn from "../../lib/tagBtn";
import CategoryBtn from "../../lib/categoryBtn";
import videojs, { VideoJsPlayer } from "video.js";
import VideoJS from "../videojs/videoJS";

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
    title: {
        color: "#FCFCFC",
    },
};

function VideoPlayer() {
    const [relatedVideos, setRelatedVideos] = useState<Video[] | null>(null);
    const [popularVideos, setPopularVideos] = useState<Video[] | null>(null);
    const [video, setVideo] = useState<Video | null>(null);
    const [playerRef, setPlayerRef] = React.useState<VideoJsPlayer | null>(null);

    const params = useParams();
    const videoId = params.id;

    const isSmallHeight = useIsSmallHeight();
    const isSmallWidth = useIsSmallWidth();
    const [width] = useWidth();

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

    const handlePlayerReady = (player: VideoJsPlayer) => {
        setPlayerRef(player);

        // You can handle player events here, for example:
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
    };

    return (
        <Box sx={commonStyles.main}>
            {!video ? (
                <Loader sx={{ marginTop: 5 }} />
            ) : (
                <React.Fragment>
                    <Box sx={{ display: "flex", marginTop: 5 }}>
                        <Card sx={styles.VideoCard}>
                            <CardHeader
                                sx={styles.title}
                                title={video?.videoDisplayName}
                            ></CardHeader>
                            <CardActions>
                                <CardMedia
                                    sx={commonStyles.CardMedia}
                                    component={VideoJS}
                                    fullWidth={!isSmallWidth}
                                    options={{
                                        autoplay: true,
                                        controls: true,
                                        responsive: true,
                                        sources: [
                                            {
                                                src: video.videoUrl,
                                                type: "video/mp4",
                                            },
                                        ],
                                        fluid: false,
                                        poster: video.videoPreviewImage,
                                        width: isSmallWidth
                                            ? width - 80
                                            : width * 0.7 - 70,
                                        height: isSmallWidth ? undefined : 450,
                                        bigPlayButton: true,
                                        playbackRates: [1, 1.5, 2, 3],
                                        nativeControlsForTouch: true,
                                        preload: "auto",
                                    }}
                                    onReady={handlePlayerReady}
                                />
                            </CardActions>
                            <CardContent style={{ color: "#FCFCFC" }}>
                                <Typography gutterBottom variant="h6" component="div">
                                    上載時間： {convertTimeStamp(video?.uploadTime)}
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    觀看次數： {video?.viewCount}
                                </Typography>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                        <TagBtn tag={value} key={index} />
                                    ))}
                                </Box>
                                <Box sx={{ display: "flex", alignItems: "center" }}>
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
                                    <CategoryBtn category={video?.category} />
                                </Box>
                            </CardContent>
                        </Card>
                        {!isSmallWidth && (
                            <Paper
                                sx={{
                                    width: "30vw",
                                    maxHeight: "700px",
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
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }

    function getPopularVideos() {
        api.get(`/videos?limit=20&filter=popular`)
            .then((res: { data: { videos: Video[] } }) => {
                setPopularVideos(
                    res.data.videos.filter((value) => value.videoId !== videoId)
                );
            })
            .catch((err) => {
                alert(err?.response?.data?.error);
            });
    }
}

export default VideoPlayer;
