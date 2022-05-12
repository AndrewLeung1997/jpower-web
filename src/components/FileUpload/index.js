import React, { useState } from "react";
import {
  Typography,
  Paper,
  Avatar,
  Button,
  LinearProgress,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import "../UpdateVideoInfo/style.css";
import Bar from "../Bar";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(600 + theme.spacing.unit * 3 * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
      theme.spacing.unit * 3
    }px`,
    backgroundColor: "#210548",
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing.unit,
  },
  formControl: {
    margin: theme.spacing.unit,
  },

  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

function FileUpload(props) {
  const { classes } = props;

  const [file, setFile] = useState("");
  const [url, setUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [process, setProcess] = useState(0);
  const [uploadStatus, setUploadStatus] = useState(false);
  const [category, setCategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState("");
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");
  const [isKeyReleased, setIsKeyReleased] = useState(false);
  const [duration, setDuration] = useState("");

  const categoryArray = [
    "中國",
    "歐美",
    "日本",
    "台灣",
    "香港",
    "東南亞",
    "韓國",
    "H漫",
    "有碼",
    "無碼",
    "生肉",
    "熟肉",
    "巨乳",
    "SM",
    "偷拍",
    "人妻",
    "學生",
    "群p",
    "同性",
    "露出",
    "制服",
    "近親",
    "其他",
  ];

  if (!getCurrentUsername) {
    // not logged in
    alert("Please login first");
    props.history.replace("/login");
    return null;
  }

  return (
    <div className={classes.main}>
      <Bar></Bar>
      <Paper className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" style={{ color: "white" }}>
          上傳文件
        </Typography>
        <form
          className={classes.form}
          onSubmit={(e) => e.preventDefault() && false}
        >
          <div className="row">
            <div className="col-sm-12">
              <label className="form-label" style={{ color: "white" }}>
                標題
              </label>
              <input
                className="form-control"
                type="text"
                onChange={(e) => setFileName(e.target.value)}
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
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categoryArray.map(function (value, index) {
                    return <option>{value}</option>;
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

                {tags.map(function (value, index) {
                  return (
                    <div className="tag">
                      {value}
                      <button onClick={() => deleteTag(index)}>x</button>
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
          <div className="row">
            <div className="col-sm-12">
              <div className="form-group">
                <label className="form-label" style={{ color: "white" }}>
                  影片文件
                </label>
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => {
                    setFile(e.target.files[0]);
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
                  accept="image/png, image/jpg, image/gif"
                  className="form-control"
                  onChange={(e) => {
                    setPreview(e.target.files[0]);
                  }}
                ></input>
              </div>
            </div>
          </div>
          {uploadStatus && (
            <div className="row">
              <div className="col-sm-12">
                <LinearProgress variant="determinate" value={process} />
              </div>
            </div>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            onClick={uploadFile}
            className={classes.submit}
          >
            上傳
          </Button>
        </form>
      </Paper>
    </div>
  );

  async function uploadFile() {
    if (file == null) return;

    setUploadStatus(true);
    const storage = firebase.storage();
    const storageRef = storage.ref();
    let previewUrl;
    if (preview != null) {
      const uploadPreview = storageRef
        .child("preview/" + preview.name)
        .put(preview);
      await uploadPreview.on(
        "state_changed",
        (snapshot) => {
          const progress =
            Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(process);
          setProcess(progress);
        },
        (error) => {},
        () => {
          uploadPreview.snapshot.ref.getDownloadURL().then((url) => {
            previewUrl = url;
          });
        }
      );
    }
    const uploadTask = storageRef.child("folder/" + file.name).put(file);

    uploadTask.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot) => {
        const progress =
          Math.round(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(progress);
        setProcess(progress);
      },
      (error) => {
        throw error;
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          setUrl(url);

          const timestamp = new Date().toISOString();
          const unix = Math.round(new Date() / 1000000000);
          const randomDigit = (
            Math.floor(Math.random() * 90000) + 10000
          ).toString();
          const videoID = unix + randomDigit;
          console.log({ previewUrl });
          firebase.database().ref("VideoList/").push({
            url: url,
            category: category,
            timestamp: timestamp,
            fileName: fileName,
            tag: tags,
            duration: duration,
            previewUrl: previewUrl,
            id: videoID,
          });
        });
        alert("成功上傳");

        setCategory("");
        setFile("");
        setFileName("");
        setPreview("");
        setTags([]);
        setUploadStatus(false);
      }
    );
  }

  function getCurrentUsername() {
    return (
      firebase.auth().currentUser && firebase.auth().currentUser.displayName
    );
  }

  function handleTextFieldInput(e) {
    const inputTag = e.target.value;
    setInputTag(inputTag);
  }

  function onKeyDown(e) {
    const { key } = e;
    const trimmedInput = inputTag.trim();

    if (key === " " && trimmedInput.length && !tags.includes(trimmedInput)) {
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
}

export default withRouter(withStyles(styles)(FileUpload));
