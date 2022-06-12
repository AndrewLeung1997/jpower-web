import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    CardMedia,
    SxProps,
    Theme,
    Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { convertTime } from "../lib/convertTime";
import { convertTimeStamp } from "../lib/convertTimeStamp";
import { Video } from "../types/video";

const styles: { [key: string]: SxProps<Theme>; } = {
    Card: {
        marginTop: 2,
        height: "100%",
        width: "100%",
        backgroundColor: "#222",
    },
    Tag: (theme: Theme) => ({
        width: 10 * theme.space,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    }),
    TimeTag: (theme: Theme) => ({
        width: 8 * theme.space,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    }),
    CardMedia: {
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 2,
        height: "100%",
        maxHeight: "200px",
        minHeight: "200px",
        borderRadius: "15px",
    },
    typography: {
        fontSize: 14,
        color: "white",
        textDecoration: "none",
        "&:hover": {
            color: "white",
        },
    },
};

export default function VideoCard(props: { video: Video }) {
    const { video } = props;
    return (
        <Box className="col-sm-6 col-md-4 col-lg-4">
            <Card sx={styles.Card}>
                <Box sx={styles.TimeTag}>{convertTime(video.videoDuration)}</Box>
                <CardActionArea component={Link} to={`/player/id/${video.videoId}`}>
                    <CardMedia
                        preload="metadata"
                        id="video"
                        sx={styles.CardMedia}
                        component={video.videoPreviewImage ? "img" : "video"}
                        alt="video"
                        width="100%"
                        height={200}
                        title={video.videoDisplayName}
                        muted={true}
                        src={`${video.videoPreviewImage || video.videoUrl}#t=0.5`}
                    />
                </CardActionArea>
                <CardContent style={{ color: "#FCFCFC" }}>
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={styles.typography}
                        component={Link}
                        to={`/player/id/${video.videoId}`}
                    >
                        {video.videoDisplayName}
                    </Typography>
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={styles.typography}
                        component="div"
                    >
                        {convertTimeStamp(video.uploadTime)}
                    </Typography>
                    <Typography
                        gutterBottom
                        variant="h6"
                        sx={{ ...styles.typography, color: "black" }}
                        component="div"
                    >
                        <Box sx={styles.Tag}>{video.category.categoryName}</Box>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
