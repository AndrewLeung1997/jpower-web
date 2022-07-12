import {
    Box,
    Card,
    CardActions,
    CardContent,
    CardHeader,
    CardMedia,
    Theme,
    Typography,
    SxProps,
} from "@mui/material";
import { convertTimeStamp } from "../lib/convertTimeStamp";
import { commonStyles } from "../lib/styles";
import TagBtn from "../lib/tagBtn";
import CategoryBtn from "../lib/categoryBtn";
import { useIsSmallWidth, useWidth } from "./App";
import VideoJS from "./videojs/videoJS";
import { Video } from "../types/video";
import videojs, { VideoJsPlayer } from "video.js";

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
    title: {
        color: "#FCFCFC",
    },
};

export default function VideoPlayer(props: {
    video: Video;
    noFooter?: boolean;
    noTitle?: boolean;
    sx?: SxProps<Theme>;
}) {
    const { video, noFooter, noTitle, sx } = props;
    const isSmallWidth = useIsSmallWidth();
    const [width] = useWidth();

    const handlePlayerReady = (player: VideoJsPlayer) => {
        // You can handle player events here, for example:
        player.on("waiting", () => {
            videojs.log("player is waiting");
        });

        player.on("dispose", () => {
            videojs.log("player will dispose");
        });
    };

    return (
        <Card
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "left",
                padding: `8px 16px 16px`,
                height: "auto",
                backgroundColor: "#222",
                width: "100%",
                ...sx,
            }}
        >
            {!noTitle && (
                <CardHeader
                    sx={styles.title}
                    title={video?.videoDisplayName}
                ></CardHeader>
            )}
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
                        width: isSmallWidth ? width - 80 : width * 0.7 - 70,
                        height: isSmallWidth ? undefined : 450,
                        bigPlayButton: true,
                        playbackRates: [1, 1.5, 2, 3],
                        nativeControlsForTouch: true,
                        preload: "auto",
                    }}
                    onReady={handlePlayerReady}
                />
            </CardActions>
            {!noFooter && (
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
            )}
        </Card>
    );
}
