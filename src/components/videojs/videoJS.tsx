import React from "react";
import videojs, { VideoJsPlayer, VideoJsPlayerOptions } from "video.js";
import "video.js/dist/video-js.css";
import "videojs-seek-buttons/dist/videojs-seek-buttons.css";
import "videojs-seek-buttons";
import "videojs-mobile-ui/dist/videojs-mobile-ui.css";
import "videojs-mobile-ui";
import "./videojs.scss";

export const VideoJS = (props: {
    options: VideoJsPlayerOptions;
    onReady: (player: VideoJsPlayer) => void;
}) => {
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const [playerRef, setPlayerRef] = React.useState<VideoJsPlayer | null>(null);
    const { options, onReady } = props;

    React.useEffect(() => {
        // Make sure Video.js player is only initialized once
        if (!playerRef) {
            const videoElement = videoRef.current;

            if (!videoElement) return;

            const player = videojs(videoElement, options, () => {
                videojs.log("player is ready");
                onReady && onReady(player);
            });
            player.seekButtons({
                forward: 15,
                back: 15,
            });
            player.mobileUi();
            setPlayerRef(player);

            // You could update an existing player in the `else` block here
            // on prop change, for example:
        } else {
            // const player = playerRef.current;
            // player.autoplay(options.autoplay);
            // player.src(options.sources);
        }
    }, [onReady, options, playerRef, videoRef]);

    // Dispose the Video.js player when the functional component unmounts
    React.useEffect(() => {
        const player = playerRef;

        return () => {
            if (player) {
                player.dispose();
                setPlayerRef(null);
            }
        };
    }, [playerRef]);

    return (
        <div data-vjs-player>
            <video
                ref={videoRef}
                className="video-js vjs-sublime-skin vjs-big-play-centered"
            />
        </div>
    );
};

export default VideoJS;
