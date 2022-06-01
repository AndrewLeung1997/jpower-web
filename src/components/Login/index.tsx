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
} from "@material-ui/core";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import "../Bar/index.css";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";
import { api } from "../../api";

const styles = (theme: Theme) =>
    ({
        root: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            [theme.breakpoints.up(
                ("auto" + theme.spacing.length * 3 * 2) as number | Breakpoint
            )]: {
                width: "auto",
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        main: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            marginLeft: theme.spacing.length * 3,
            marginRight: theme.spacing.length * 3,
            [theme.breakpoints.up(400 + theme.spacing.length * 3 * 2)]: {
                width: 400,
                marginLeft: "auto",
                marginRight: "auto",
            },
        },
        paper: {
            marginTop: theme.spacing.length * 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${theme.spacing.length * 2}px ${theme.spacing.length * 3}px ${
                theme.spacing.length * 3
            }px`,
        },
        avatar: {
            margin: theme.spacing.length,
            backgroundColor: theme.palette.secondary.main,
        },
        alternativeAvatar: {
            margin: theme.spacing.length,
            backgroundColor: theme.palette.secondary.light,
        },
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: theme.spacing.length,
        },
        submit: {
            marginTop: theme.spacing.length * 3,
        },

        alternativeIcon: {
            paddingTop: "20px",
        },
    } as Styles<Theme, {}, never>);

function SignIn(props: RouteComponentProps & { classes: { [key: string]: string } }) {
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
        try {
            api.post("/login", { email, password }).then((res) => {
                if (res.data.success) {
                    localStorage.setItem("token", res.data.token);
                    props.history.push("/");
                }
            });
            await firebase.login(email, password);
            props.history.replace("/dashboard");
        } catch (error: any) {
            alert(error?.message);
        }
    }
}

export default withRouter(withStyles(styles)(SignIn));
