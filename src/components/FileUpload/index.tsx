import React, { useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    LinearProgress,
    Theme,
    Box,
    TextField,
    TextFieldProps,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import { Image, LockOutlined as LockOutlinedIcon, Upload } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import "../UpdateVideoInfo/style.css";
import { useCategories, useUser } from "../App";
import axios from "axios";
import { cfUrl } from "../../config";
import random from "random";
import { api } from "../../api";
import { commonStyles } from "../../lib/styles";

const styles = {
    avatar: (theme: Theme) => ({
        margin: 1,
        backgroundColor: theme.palette.secondary.main,
    }),
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: 1,
    },
    formControl: {
        margin: 1,
    },
    submit: {
        marginTop: 2,
    },
};

function FileUpload() {
    const categoryArray = useCategories();

    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState(0);
    const [uploadStatus, setUploadStatus] = useState(false);
    const [category, setCategory] = useState(categoryArray[0]?.categoryName || "");
    const [videoDisplayName, setVideoDisplayName] = useState("");
    const [preview, setPreview] = useState<File | null>(null);
    const [videoTag, setVideoTag] = useState<string[]>([]);
    const [inputTag, setInputTag] = useState("");
    const [user] = useUser();

    const navigate = useNavigate();

    if (!user) {
        // not logged in
        alert("請先登入");
        return <Navigate to="/login" replace />;
    }

    const commonProps: TextFieldProps = {
        disabled: uploadStatus,
        required: true,
        fullWidth: true,
        variant: "standard",
        sx: { marginTop: 3 },
    };

    return (
        <Box
            sx={{ ...commonStyles.main, display: "flex", justifyContent: "center" }}
            className=""
        >
            <Paper
                sx={{
                    ...commonStyles.paper,
                    width: "600px",
                    maxWidth: "90vw",
                    marginTop: 3,
                }}
            >
                <Avatar sx={styles.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    上傳文件
                </Typography>
                <form onSubmit={onSubmit} style={{ width: "100%" }}>
                    <TextField
                        label="標題"
                        {...commonProps}
                        onChange={(e) => setVideoDisplayName(e.target.value)}
                    />
                    <FormControl
                        sx={{ marginTop: 3, marginBottom: 3 }}
                        fullWidth
                        disabled={uploadStatus}
                        required
                    >
                        <InputLabel>類別</InputLabel>
                        <Select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            label="類別"
                            variant="standard"
                        >
                            {categoryArray.map((value, index) => (
                                <MenuItem value={value.categoryName} key={index}>
                                    {value.categoryName}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    {videoTag.map(function (value, index) {
                        return (
                            <Chip
                                color="primary"
                                sx={{ marginRight: 1 }}
                                label={value}
                                onDelete={() => deleteTag(index)}
                            />
                        );
                    })}
                    <TextField
                        {...commonProps}
                        sx={{ ...(videoTag.length && { marginTop: 1 }) }}
                        required={false}
                        label="標籤 (輸入後按 空格 鍵)"
                        type="text"
                        value={inputTag}
                        onKeyDown={onKeyDown}
                        onChange={handleTextFieldInput}
                    />
                    <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
                        <Button
                            sx={{ marginRight: 1 }}
                            variant="contained"
                            component="label"
                            disabled={uploadStatus}
                        >
                            <Upload />
                            影片文件
                            <input
                                required
                                type="file"
                                accept="video/*"
                                disabled={uploadStatus}
                                onChange={(e) => {
                                    setFile(e.target?.files?.[0] || null);
                                }}
                                hidden
                            />
                        </Button>
                        {file?.name || "未選擇影片"}
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", marginTop: 3 }}>
                        <Button
                            sx={{ marginRight: 1 }}
                            variant="contained"
                            component="label"
                            disabled={uploadStatus}
                        >
                            <Image />
                            預覽圖
                            <input
                                type="file"
                                accept="image/*"
                                disabled={uploadStatus}
                                onChange={(e) => {
                                    setPreview(e.target?.files?.[0] || null);
                                }}
                                hidden
                            />
                        </Button>
                        {preview?.name || "未選擇預覽圖　（可以不選）"}
                    </Box>
                    {uploadStatus && (
                        <div className="row">
                            <div className="col-sm-12">
                                <LinearProgress
                                    sx={{ marginTop: 2 }}
                                    variant="determinate"
                                    value={progress}
                                />
                            </div>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={styles.submit}
                        disabled={uploadStatus}
                    >
                        上傳
                    </Button>
                </form>
            </Paper>
        </Box>
    );

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!file) return;
        setUploadStatus(true);

        let videoPreviewImage: string = "",
            videoUrl: string = "",
            videoDuration = 0;
        const id = random.int(100000, 999999);

        if (preview) {
            const formData = new FormData();
            const name = `images/${id}-${preview.name}`;
            formData.append("key", name);
            formData.append("Content-Type", preview.type);
            formData.append("file", preview);
            try {
                await upload(formData);
                videoPreviewImage = `${cfUrl}/images/${id}-${encodeURIComponent(
                    preview.name
                )}`;
            } catch (e) {
                console.log(e);
                alert(e);
            }
        }

        const formData = new FormData();
        const name = `videos/${id}-${file.name}`;
        formData.append("key", name);
        formData.append("Content-Type", file.type);
        formData.append(`file`, file);
        try {
            await upload(formData);
            videoUrl = `${cfUrl}/videos/${id}-${encodeURIComponent(file.name)}`;
        } catch (e) {
            console.log(e);
            alert(e);
        }

        const vid = document.createElement("video");
        vid.src = videoUrl;
        vid.ondurationchange = function () {
            videoDuration = Math.round(vid.duration);
        };

        while (videoDuration === 0) {
            await new Promise((resolve) => setTimeout(resolve, 100));
        }

        await api
            .post("/videos/create", {
                categoryId: categoryArray.find((i) => i.categoryName === category)
                    ?.categoryId, // integer, must be an existing category id
                videoTag,
                videoDisplayName, // video name
                videoDuration, // integer, in seconds
                videoUrl, // url to video
                ...(videoPreviewImage && { videoPreviewImage }), // url to image
            })
            .then((res: { data: { video: { videoId: string } } }) => {
                alert("成功上傳");
                setCategory("");
                setFile(null);
                setVideoDisplayName("");
                setPreview(null);
                setVideoTag([]);
                setUploadStatus(false);
                navigate(`/player/id/${res.data.video.videoId}`);
            })
            .catch((err) => {
                alert(
                    err?.response?.data?.error || err?.response?.data || "Upload failed."
                );
                setUploadStatus(false);
            });
    }

    async function upload(formData: FormData) {
        await axios.post(cfUrl, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setProgress(progress);
                }
            },
        });
    }

    function handleTextFieldInput(e: React.ChangeEvent<HTMLInputElement>) {
        const inputTag = e.target.value;
        setInputTag(inputTag);
    }

    function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        const { key } = e;
        const trimmedInput = inputTag.trim();

        if (key === " " && trimmedInput.length && !videoTag.includes(trimmedInput)) {
            e.preventDefault();
            setVideoTag((prevState) => [...prevState, trimmedInput]);
            setInputTag("");
        }

        if (key === "Backspace" && !inputTag.length && videoTag.length) {
            e.preventDefault();
            const tagsCopy = [...videoTag];
            const poppedTag = tagsCopy.pop();

            setVideoTag(tagsCopy);
            setInputTag(poppedTag || "");
        }
    }

    function deleteTag(index: number) {
        setVideoTag((prevState) => prevState.filter((tag, i) => i !== index));
    }
}

export default FileUpload;
