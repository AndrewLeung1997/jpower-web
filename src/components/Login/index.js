import React, { useEffect, useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    FormControl,
    Input,
    InputLabel,
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import "../Bar/index.css";

const styles = (theme) => ({
    root: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        [theme.breakpoints.up("auto" + theme.spacing.unit * 3 * 2)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto",
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
            theme.spacing.unit * 3
        }px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    alternativeAvatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.light,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },

    alternativeIcon: {
        paddingTop: "20px",
    },
});

function SignIn(props) {
    const { classes } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    return (
        <div className={classes.root}>
            <Bar></Bar>
            <div className={classes.main}>
                <Paper className={classes.paper}>
                    <Typography
                        component="h2"
                        variant="h5"
                        style={{ textAlign: "center" }}
                    >
                        JTube Club 會員
                    </Typography>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登入
                    </Typography>
                    <form
                        className={classes.form}
                        onSubmit={(e) => e.preventDefault() && false}
                    >
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="email">電郵地址</InputLabel>
                            <Input
                                id="email"
                                name="email"
                                autoComplete="off"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </FormControl>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">密碼</InputLabel>
                            <Input
                                name="password"
                                type="password"
                                id="password"
                                autoComplete="off"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </FormControl>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="primary"
                            onClick={login}
                            className={classes.submit}
                        >
                            登入
                        </Button>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="secondary"
                            component={Link}
                            to="/register"
                            className={classes.submit}
                        >
                            註冊
                        </Button>
                    </form>
                </Paper>
            </div>
        </div>
    );

    async function login() {
        try {
            await firebase.login(email, password);
            props.history.replace("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    }
}

export default withRouter(withStyles(styles)(SignIn));
