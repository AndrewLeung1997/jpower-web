import React, { useState, useEffect } from "react";
import { Paper, Button, Typography, FormControl, InputLabel } from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import { useCategories } from "../App";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import ReactPlayer from "react-player";
import "../UpdateVideoInfo/style.css";

const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.space * 3,
        marginRight: theme.space * 3,
        marginBottom: theme.space * 2,
        [theme.breakpoints.up("auto" + theme.space * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    paper: {
        marginTop: theme.space * 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${
            theme.space * 3
        }px`,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        border: "2px",
        marginTop: theme.space,
        paddingBottom: "10px",
    },
    submit: {
        marginTop: theme.space * 3,
        width: "200px",
    },
});

function UpdateProfile(props) {
    const { classes } = props;
    const [category, setCategory] = useState("");
    const [id, setId] = useState("");
    const [fileName, setFileName] = useState("");
    const [tags, setTags] = useState([]);
    const [inputTag, setInputTag] = useState("");
    const [isKeyReleased, setIsKeyReleased] = useState(false);
    const [duration, setDuration] = useState("");
    const [preview, setPreview] = useState("");
    let previewUrl = "";
    const categories = useCategories();

    useEffect(() => {
        getVideoInfo();
    }, []);

    if (!firebase.auth().currentUser) {
        // not logged in
        alert("Please login first");
        props.history.replace("/login");
        return null;
    }

    return (
        <main className={classes.main}>
            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{ paddingBottom: "15px" }}>
                    更新影片資料
                </Typography>
                <ReactPlayer
                    onDuration={(duration) => setDuration(duration)}
                    width="100%"
                    controls={true}
                    url={props.location.state.url}
                />

                <form
                    className={classes.form}
                    onSubmit={(e) => e.preventDefault() && false}
                >
                    <div className="row">
                        <div className="col-md-12">
                            <div className="form-group">
                                <label htmlFor="url">影片連結</label>
                                <input
                                    className="form-control"
                                    id="url"
                                    disabled={true}
                                    value={props.location.state.url || ""}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="id">ID</label>
                                <input
                                    className="form-control"
                                    id="id"
                                    name="id"
                                    value={id}
                                    onChange={(e) => setId(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="fileName">標題</label>
                                <input
                                    className="form-control"
                                    id="fileName"
                                    name="fileName"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="fileName">類別</label>
                                <select
                                    className="form-select"
                                    name="category"
                                    id="category"
                                    autoComplete="off"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                >
                                    {categories.map(function (value) {
                                        return <option value={value}>{value}</option>;
                                    })}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-8">
                            <div className="form-group">
                                <label htmlFor="tags">Tags</label>
                                <div className="container">
                                    {tags.map(function (value, index) {
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
                                        type="text"
                                        value={inputTag}
                                        onKeyDown={(e) => onKeyDown(e)}
                                        onKeyUp={onKeyUp}
                                        onChange={(e) => handleTextFieldInput(e)}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="form-group">
                                <label htmlFor="tags">Video Duration</label>
                                <input
                                    className="form-control"
                                    id="fileName"
                                    disabled={true}
                                    name="fileName"
                                    value={(duration / 60).toFixed(2)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-sm-12">
                            <div className="form-group">
                                <label htmlFor="preview" style={{ color: "white" }}>
                                    預覽圖
                                </label>
                                <input
                                    type="file"
                                    accept="image/png, image/jpg, image/gif"
                                    className="form-control"
                                    onChange={(e) => {
                                        setPreview(e.target.files[0]);
                                    }}
                                ></input>
                            </div>
                        </div>
                    </div>
                </form>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    onClick={UpadateUserProfile}
                    className={classes.submit}
                >
                    儲存
                </Button>

                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    component={Link}
                    to="/dashboard"
                    className={classes.submit}
                >
                    返回
                </Button>
            </Paper>
        </main>
    );

    async function uploadPreviewImage() {
        if (preview == null) {
            return;
        } else {
            const storage = firebase.storage();
            const storageRef = storage.ref();
            const uploadTask = await storageRef
                .child("previewImage/" + preview.name)
                .put(preview);

            previewUrl = await uploadTask.ref.getDownloadURL();
        }
    }

    function handleTextFieldInput(e) {
        var inputTag = e.target.value;
        setInputTag(inputTag);
    }

    function onKeyDown(e) {
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
            setInputTag(poppedTag);
        }

        setIsKeyReleased(false);
    }

    function onKeyUp() {
        setIsKeyReleased(true);
    }

    function deleteTag(index) {
        setTags((prevState) => prevState.filter((tag, i) => i !== index));
    }

    function getVideoInfo() {
        firebase
            .database()
            .ref("VideoList/")
            .orderByChild("url")
            .equalTo(props.location.state.url)
            .on("value", function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(function (video) {
                        setId(video.val().id);
                        setFileName(video.val().fileName);
                        setCategory(video.val().category);
                        if (video.val().tag) {
                            setTags(video.val().tag);
                        }
                    });
                }
            });
    }

    async function UpadateUserProfile() {
        const url = props.location.state.url;
        console.log(previewUrl);
        await uploadPreviewImage();
        console.log(previewUrl);
        try {
            const query = firebase
                .database()
                .ref("VideoList/")
                .orderByChild("url")
                .equalTo(url);
            query.once("child_added", function (snapshot) {
                console.log(previewUrl || snapshot.val().previewUrl);
                snapshot.ref.update({
                    id: id,
                    fileName: fileName,
                    category: category,
                    tag: tags,
                    duration: duration,
                    previewUrl: previewUrl || snapshot.val().previewUrl,
                });
                alert("Data Saved Successfully");
            });
        } catch (error) {
            console.error(error);
        }
    }
}

export default withRouter(withStyles(styles)(UpdateProfile));
