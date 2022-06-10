import React, { useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    LinearProgress,
    Theme,
    Box,
    FormGroup,
} from "@mui/material";
import { LockOutlined as LockOutlinedIcon } from "@mui/icons-material";
import { Navigate, useNavigate } from "react-router-dom";
import "../UpdateVideoInfo/style.css";
import { useCategories, useUser } from "../App";
import axios from "axios";
import { s3Url } from "../../config";
import random from "random";
import { api } from "../../api";

const styles = {
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: 3,
        marginRight: 3,
        [theme.breakpoints.up(600 + theme.space * 3 * 2)]: {
            width: 600,
            marginLeft: "auto",
            marginRight: "auto",
        },
    }),
    paper: (theme: Theme) => ({
        marginTop: 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
        backgroundColor: "#222",
    }),
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
    const [process, setProcess] = useState(0);
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
        alert("Please login first");
        return <Navigate to="/login" replace />;
    }

    return (
        <Box sx={styles.main} className="">
            <Paper sx={styles.paper}>
                <Avatar sx={styles.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5" style={{ color: "white" }}>
                    上傳文件
                </Typography>
                <FormGroup sx={styles.form} onSubmit={(e) => e.preventDefault()}>
                    <div className="row">
                        <div className="col-sm-12">
                            <label className="form-label" style={{ color: "white" }}>
                                標題
                            </label>
                            <input
                                required
                                disabled={uploadStatus}
                                className="form-control"
                                type="text"
                                onChange={(e) => setVideoDisplayName(e.target.value)}
                            ></input>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label
                                    className="form-label"
                                    style={{ color: "white", paddingTop: "15px" }}
                                >
                                    類別
                                </label>
                                <select
                                    required
                                    className="form-select"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categoryArray.map(function (value, index) {
                                        return (
                                            <option key={index}>
                                                {value.categoryName}
                                            </option>
                                        );
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="tags" style={{ color: "white" }}>
                                    Tags
                                </label>

                                {videoTag.map(function (value, index) {
                                    return (
                                        <div className="tag">
                                            {value}
                                            <button onClick={() => deleteTag(index)}>
                                                x
                                            </button>
                                        </div>
                                    );
                                })}
                                <input
                                    className="form-control"
                                    id="tags"
                                    disabled={uploadStatus}
                                    type="text"
                                    value={inputTag}
                                    onKeyDown={onKeyDown}
                                    onChange={handleTextFieldInput}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="form-label" style={{ color: "white" }}>
                                    影片文件
                                </label>
                                <input
                                    required
                                    type="file"
                                    disabled={uploadStatus}
                                    className="form-control"
                                    onChange={(e) => {
                                        setFile(e.target?.files?.[0] || null);
                                    }}
                                ></input>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label className="form-label" style={{ color: "white" }}>
                                    預覽圖
                                </label>
                                <input
                                    type="file"
                                    disabled={uploadStatus}
                                    accept="image/png, image/jpg, image/gif"
                                    className="form-control"
                                    onChange={(e) => {
                                        setPreview(e.target.files?.[0] || null);
                                    }}
                                ></input>
                            </div>
                        </div>
                    </div>
                    {uploadStatus && (
                        <div className="row">
                            <div className="col-sm-12">
                                <LinearProgress
                                    sx={{ marginTop: 2 }}
                                    variant="determinate"
                                    value={process}
                                />
                            </div>
                        </div>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        onClick={uploadFile}
                        sx={styles.submit}
                    >
                        上傳
                    </Button>
                </FormGroup>
            </Paper>
        </Box>
    );

    async function uploadFile() {
        if (file == null) return;

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
                videoPreviewImage = `${s3Url}/images/${id}-${encodeURIComponent(
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
            videoUrl = `${s3Url}/videos/${id}-${encodeURIComponent(file.name)}`;
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
        await axios.post(s3Url, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                "Access-Control-Allow-Origin": "*",
            },
            onUploadProgress: (progressEvent: ProgressEvent) => {
                if (progressEvent.lengthComputable) {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    setProcess(progress);
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
