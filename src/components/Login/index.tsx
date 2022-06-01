import { useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    FormControl,
    Input,
    InputLabel,
    Theme,
} from "@mui/material";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import "../Bar/index.css";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { api } from "../../api";
import { decode } from "jsonwebtoken";
import { User } from "../../types/user";
import { useUser } from "../App";

const styles = (theme: Theme) => {
    console.log(theme.spacing());
    return {
        root: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            [theme.breakpoints.up(
                ("auto" + Number(theme.spacing()) * 3 * 2) as number | Breakpoint
            )]: {
                width: "auto",
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        main: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            marginLeft: Number(theme.spacing()) * 3,
            marginRight: Number(theme.spacing()) * 3,
            [theme.breakpoints.up(400 + Number(theme.spacing()) * 3 * 2)]: {
                width: 400,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        paper: {
            marginTop: Number(theme.spacing()) * 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${Number(theme.spacing()) * 2}px ${Number(theme.spacing()) * 3}px ${
                Number(theme.spacing()) * 3
            }px`,
        },
        avatar: {
            margin: Number(theme.spacing()),
            backgroundColor: theme.palette.secondary.main,
        },
        alternativeAvatar: {
            margin: Number(theme.spacing()),
            backgroundColor: theme.palette.secondary.light,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: Number(theme.spacing()),
        },
        submit: {
            marginTop: Number(theme.spacing()) * 3,
        },

        alternativeIcon: {
            paddingTop: "20px",
        },
    } as Styles<Theme, {}, never>;
};

function SignIn(props: { classes: { [key: string]: string } }) {
    const { classes } = props;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useUser();

    const navigate = useNavigate();

    if (user) return <Navigate to="/" />;

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
                    <form className={classes.form} onSubmit={(e) => e.preventDefault()}>
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
        api.post("/users/login", { email, password })
            .then(({ data }) => {
                const { token } = data;
                if (token) {
                    localStorage.setItem("token", token);
                    const user = decode(token) as User;
                    setUser(user);

                    console.log(user.role)
                    if (user.role === "admin")
                        return navigate("/dashboard", { replace: true });
                    navigate("/");
                }
            })
            .catch((err) => {
                alert(
                    `登入失敗: ${
                        err?.response?.data?.error || err?.response?.data || err
                    }`
                );
            });
    }
}

export default withStyles(styles)(SignIn);
