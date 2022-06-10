import React, { useEffect, useState, useRef } from "react";
import {
    Typography,
    Paper,
    Card,
    CardMedia,
    CardContent,
    CardActionArea,
    Button,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "firebase";
import Bar from "../Bar";
import give from "../../file/give.jpeg";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import "../Home/index.css";

const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.space * 3,
        marginRight: theme.space * 3,
        marginTop: theme.space * 5,
        [theme.breakpoints.up("auto" + theme.space * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
        backgroundColor: "#222",
    },
    paper: {
        marginTop: theme.space * 8,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${
            theme.space * 3
        }px`,
        backgroundColor: "#222",
    },

    tagList: {
        margin: "0",
        padding: "20px",
    },
});

function Tags(props) {
    const { classes } = props;
    const ref = useRef(null);
    const location = useLocation();
    const history = useHistory();

    const [tagList, setTagList] = useState([]);

    useEffect(() => {
        getAllTags();
    }, []);

    return (
        <div className={classes.main}>

            <Paper className={classes.paper}>
                <Typography component="h1" variant="h5" style={{ color: "#FCFCFC" }}>
                    所有標籤
                </Typography>
                <div className="container-fluid">
                    <div className="well well-md">
                        <div className="row">
                            <div className={classes.tagList}>
                                {tagList.map(function (value, index) {
                                    return (
                                        <a href={`/Search/Tag/${value}`}>
                                            <button
                                                className="btn btn-primary thumb-popu"
                                                style={{
                                                    marginLeft: "10px",
                                                    marginRight: "10px",
                                                    marginTop: "15px",
                                                }}
                                            >
                                                {value}
                                            </button>
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </Paper>
        </div>
    );

    function getAllTags() {
        var list = [];
        var filteredTagList = [];
        firebase
            .database()
            .ref("VideoList/")
            .on("value", function (snapshot) {
                if (snapshot.val()) {
                    snapshot.forEach(function (value) {
                        if (value.val().tag) {
                            var tagList = value.val().tag;
                            tagList.map(function (value, index) {
                                list.push(value);
                            });
                            filteredTagList = list.filter((c, index) => {
                                return list.indexOf(c) === index;
                            });
                            setTagList(filteredTagList);
                        }
                    });
                }
            });
    }
}

export default withRouter(withStyles(styles)(Tags));
