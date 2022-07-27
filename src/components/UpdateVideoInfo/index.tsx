import { Image } from "@mui/icons-material";
import {
    Breakpoint,
    Theme,
    Paper,
    Button,
    Typography,
    Box,
    TextField,
    Chip,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";
import humanizeDuration from "humanize-duration";
import random from "random";
import React, { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api } from "../../api";
import Loader from "../../lib/loader";
import { commonStyles } from "../../lib/styles";
import { uploadPreview } from "../../lib/uploadFiles";
import { Video } from "../../types/video";
import { useCategories, useUser } from "../App";
import "../UpdateVideoInfo/style.css";
import VideoPlayer from "../VideoPlayer";

const styles = {
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.space * 3,
        marginRight: theme.space * 3,
        marginBottom: theme.space * 2,
        [theme.breakpoints.up(("auto" + theme.space * 3 * 2) as Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
    }),
    paper: (theme: Theme) => ({
        marginTop: theme.space * 3,
        display: "flex",
        flexDirection: "column",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
    }),
    form: (theme: Theme) => ({
        width: "100%", // Fix IE 11 issue.
        border: "2px",
        marginTop: theme.space,
        paddingBottom: "10px",
    }),
    submit: (theme: Theme) => ({
        width: "200px",
        margin: 2,
        marginTop: theme.space * 3,
    }),
};

function UpdateProfile() {
    const videoId = useParams().id;
    const [tags, setTags] = useState<string[]>([]);
    const [inputTag, setInputTag] = useState<string>("");
    const [preview, setPreview] = useState<File | null>(null);
    const categories = useCategories();
    const [user] = useUser();
    const [video, setVideo] = useState<Video | null>(null);
    const [fileName, setFileName] = useState("");
    const [category, setCategory] = useState<number>(0);
    const navigate = useNavigate();

    useEffect(() => {
        api.get(`/videos/${videoId}`).then((res: { data: { video: Video } }) => {
            setVideo(res.data.video);
            setFileName(res.data.video.videoDisplayName);
            setCategory(res.data.video.category.categoryId);
            setTags(res.data.video.videoTag);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (!user) {
        // not logged in
        alert("Please login first");
        navigate("/login", { replace: true });
        return null;
    }

    return (
        <Box sx={{ ...commonStyles.main, display: "flex", justifyContent: "center" }}>
            <Paper
                sx={{ ...commonStyles.paper, width: "900px" }}
                component="form"
                onSubmit={onSubmit}
            >
                <Typography component="h1" variant="h5" style={{ paddingBottom: "15px" }}>
                    更新影片資料
                </Typography>
                {!video ? (
                    <Loader position="center" />
                ) : (
                    <Box>
                        <VideoPlayer video={video} noFooter noTitle />

                        <TextField
                            label="影片連結"
                            value={video.videoUrl}
                            fullWidth
                            variant="standard"
                            sx={{ marginTop: 2, marginBottom: 1 }}
                        />

                        <TextField
                            label="ID"
                            value={video.videoId}
                            variant="standard"
                            sx={{ marginTop: 1, marginBottom: 1 }}
                        />

                        <TextField
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                            variant="outlined"
                            label="影片名稱"
                            sx={{ marginTop: 2, marginBottom: 2 }}
                            fullWidth
                        />

                        <FormControl fullWidth sx={{ marginTop: 2, marginBottom: 2 }}>
                            <InputLabel>類別</InputLabel>
                            <Select
                                value={category}
                                onChange={(e) => setCategory(Number(e.target.value))}
                                label="類別"
                                variant="outlined"
                            >
                                {categories.map((value) => (
                                    <MenuItem value={value.categoryId}>
                                        {value.categoryName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <label style={{ marginTop: 1 }} htmlFor="tags">
                            Tags
                        </label>
                        <Box
                            sx={{
                                display: "flex",
                                marginBottom: 1,
                                alignItems: "center",
                            }}
                        >
                            {tags.map((value, index) => (
                                <Chip
                                    color="primary"
                                    sx={{ margin: "3px" }}
                                    key={index}
                                    onDelete={() => {
                                        deleteTag(index);
                                    }}
                                    label={value}
                                />
                            ))}
                            <TextField
                                sx={{ marginLeft: "8px" }}
                                value={inputTag}
                                onKeyDown={onKeyDown}
                                onChange={handleTextFieldInput}
                                variant="outlined"
                                label="Add tags"
                            />
                        </Box>

                        <TextField
                            value={humanizeDuration(video.videoDuration * 1000, {
                                language: "zh_TW",
                            })}
                            label="影片長度"
                            variant="standard"
                            sx={{ marginTop: 1, marginBottom: 1 }}
                        />

                        <br />

                        <FormControl sx={{ marginTop: 1, marginBottom: 1 }}>
                            <label>預覽圖</label>
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                }}
                            >
                                <Button
                                    variant="contained"
                                    component="label"
                                    sx={{
                                        marginTop: 1,
                                        marginRight: 1,
                                    }}
                                >
                                    <Image />
                                    上傳預覽圖
                                    <input
                                        type="file"
                                        accept="image/*"
                                        hidden
                                        onChange={(e) => {
                                            setPreview(e.target?.files?.[0] || null);
                                        }}
                                    />
                                </Button>
                                {preview?.name}
                            </Box>
                        </FormControl>
                    </Box>
                )}
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={styles.submit}
                    >
                        儲存
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/dashboard"
                        sx={styles.submit}
                    >
                        返回
                    </Button>
                </Box>
            </Paper>
        </Box>
    );

    function handleTextFieldInput(e: ChangeEvent<HTMLInputElement>) {
        const inputTag = e.target.value;
        setInputTag(inputTag);
    }

    function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
        const { key } = e;
        const trimmedInput = inputTag.trim();

        if (key === "," && trimmedInput.length && !tags.includes(trimmedInput)) {
            e.preventDefault();
            setTags((prevState) => [...prevState, trimmedInput]);
            setInputTag("");
        }

        if (key === "Backspace" && !inputTag.length && tags.length) {
            e.preventDefault();
            const tagsCopy = [...tags];
            const poppedTag = tagsCopy.pop();

            setTags(tagsCopy);
            setInputTag(poppedTag || "");
        }
    }

    function deleteTag(index: number) {
        setTags((prevState) => prevState.filter((tag, i) => i !== index));
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const id = random.int(100000, 999999);
        let previewUrl: string | null = null;

        if (preview) {
            previewUrl = await uploadPreview({ preview, id });
            if (!previewUrl) {
                alert("上傳預覽圖失敗");
                return;
            }
        }

        try {
            await api.put(`/videos/modify`, {
                videoId,
                videoDisplayName: fileName,
                categoryId: category,
                videoTag: tags,
                ...(previewUrl && { videoPreviewImage: previewUrl }),
            });
            alert("修改成功");
        } catch {
            alert("修改失敗");
        }
    }
}

export default UpdateProfile;
