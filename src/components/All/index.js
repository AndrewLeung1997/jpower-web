import React, { useEffect, useState } from "react";
import {
  Typography,
  Paper,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Button,
  IconButton,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import "../Bar/index.css";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    [theme.breakpoints.up("auto" + theme.spacing.unit * 3 * 2)]: {
      width: "auto",
      marginLeft: "auto",
      marginRight: "auto",
    },
    backgroundColor: "#210548",
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

  Card: {
    marginTop: theme.spacing.unit * 2,
    height: theme.spacing.unit * 45,
    backgroundColor: "#210548",
  },
  Tag: {
    width: theme.spacing.unit * 10,

    backgroundColor: "#FFC0CB",
    textAlign: "center",
    borderRadius: "10px",
    borderColor: "#ffffff",
    borderStyle: "solid",
  },
  Pagination: {
    marginTop: theme.spacing.unit * 2,
  },
  CardMedia: {
    paddingLeft: theme.spacing.unit * 1,
    paddingRight: theme.spacing.unit * 1,
    paddingTop: theme.spacing.unit * 1,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
    color: "white",
    fontSize: "20px",
  },
  TimeTag: {
    width: theme.spacing.unit * 8,
    backgroundColor: "#808080",
    textAlign: "center",
    borderRadius: "6px",
    borderColor: "#ffffff",
  },
});

function All(props) {
  const { classes } = props;
  const [videoList, setVideoList] = useState([]);
  const [totalDataCount, setTotalDataCount] = useState(0);
  const [dataRange] = useState(15);
  const [pageNumber, setPageNumber] = useState(0);

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

  useEffect(() => {
    getAllMedia();
  }, [pageNumber, totalDataCount, categoryArray]);

  return (
    <div className={classes.main}>
      <Bar></Bar>
      <div className="row">
        <div className="col-md-3">
          <Paper className={classes.paper}>
            <Typography
              component="h1"
              variant="h5"
              style={{ color: "#FCFCFC" }}
            >
              所有類別
            </Typography>
            <div className="well">
              <ul className="list-group">
                {categoryArray.map(function (value, index) {
                  return (
                    <li>
                      <Button
                        className={classes.submit}
                        id={index}
                        component={Link}
                        to={{
                          pathname: `/filter/category/${value}`,
                          state: {
                            category: value,
                          },
                        }}
                      >
                        {value}
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </Paper>
        </div>
        <div className="col-md-9">
          <div className="row" style={{ marginTop: "20px" }}>
            {videoList.map(function (value, index) {
              return (
                <div className="col-sm-4 col-md-3 col-lg-3">
                  <Card className={classes.Card}>
                    <div className={classes.TimeTag}>
                      {convertTime(value.duration)}
                    </div>
                    <CardActionArea
                      component={Link}
                      to={{
                        pathname: `/player/id/${value.id}`,
                        state: {
                          url: value.url,
                          videoName: value.fileName,
                          category: value.category,
                          timestamp: value.timestamp,
                          id: value.id,
                        },
                      }}
                    >
                      <CardMedia
                        preload="metadata"
                        className={classes.CardMedia}
                        component="video"
                        alt="video"
                        width="100%"
                        height="200"
                        title={value.fileName}
                        src={`${value.url}#t=0.5`}
                      />
                    </CardActionArea>
                    <CardContent style={{ color: "white" }}>
                      <Typography gutterBottom variant="h8" component="div">
                        {value.fileName}
                      </Typography>
                      <Typography gutterBottom variant="h8" component="div">
                        {convertTimeStamp(value.timestamp)}
                      </Typography>
                      <Typography gutterBottom variant="h8" component="div">
                        <div className={classes.Tag}>{value.category}</div>
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
        <nav className={classes.Pagination}>
          <ul className="pagination pg-blue justify-content-center">
            {Array(Math.ceil(totalDataCount / dataRange))
              .fill()
              .map(function (_, i) {
                return (
                  <div
                    className="pagination"
                    style={{
                      borderRadius: "20px",
                      paddingLeft: "5px",
                      fontWeight: "bold",
                    }}
                  >
                    <li
                      className="page-item"
                      key={i}
                      onClick={() => setPageNumber(i)}
                    >
                      <a className="page-link" href="#">
                        {i + 1}
                      </a>
                    </li>
                  </div>
                );
              })}
          </ul>
        </nav>
      </div>
    </div>
  );

  function convertTime(num) {
    var minutes = Math.floor(num / 60);
    var seconds = Math.round(num % 60);

    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    var timestamp = minutes + ":" + seconds;

    return timestamp;
  }
  function paginate(array, page_size, page_number) {
    return array.slice((page_number - 1) * page_size, page_number * page_size);
  }

  function getAllMedia() {
    var videoArray = [];
    var reversedArray = [];
    firebase
      .database()
      .ref("VideoList/")
      .on("value", function (snapshot) {
        if (snapshot.val()) {
          var keys = Object.keys(snapshot.val()).sort();
          setTotalDataCount(keys.length);
          var key = keys[pageNumber * dataRange];
          snapshot.forEach(function (video) {
            videoArray.push(video.val());
          });
          reversedArray = [...videoArray].reverse();
          setVideoList(paginate(reversedArray, dataRange, pageNumber + 1));
        }
      });
  }

  function convertTimeStamp(timestamp) {
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    if (day < 10) {
      day = "0" + day;
    }
    if (month < 10) {
      month = "0" + month;
    }

    var newDate = year + "-" + month + "-" + day;

    return newDate;
  }
}

export default withRouter(withStyles(styles)(All));
