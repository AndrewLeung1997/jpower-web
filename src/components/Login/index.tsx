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
    Breakpoint,
    Box,
    FormGroup,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "../Bar/index.css";
import { api } from "../../api";
import { decode } from "jsonwebtoken";
import { User } from "../../types/user";
import { useUser } from "../App";

const styles = {
    root: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        [theme.breakpoints.up(("auto" + theme.space * 3 * 2) as number | Breakpoint)]: {
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
        },
    }),
    main: (theme: Theme) => ({
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: 3,
        marginRight: 3,
        [theme.breakpoints.up(400 + theme.space * 3 * 2)]: {
            width: 400,
            marginLeft: "auto",
            marginRight: "auto",
        },
    }),
    paper: (theme: Theme) => ({
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
    }),
    avatar: (theme: Theme) => ({
        margin: 1,
        backgroundColor: theme.palette.secondary.main,
    }),
    alternativeAvatar: (theme: Theme) => ({
        margin: 1,
        backgroundColor: theme.palette.secondary.light,
    }),
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: 1,
    },
    submit: (theme: Theme) => ({
        marginTop: 3,
    }),

    alternativeIcon: {
        paddingTop: "20px",
    },
};

function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useUser();

    const navigate = useNavigate();

    if (user) return <Navigate to="/" />;

    return (
        <Box sx={styles.root}>
            <Box sx={styles.main}>
                <Paper sx={styles.paper}>
                    <Typography
                        component="h2"
                        variant="h5"
                        style={{ textAlign: "center" }}
                    >
                        JTube Club 會員
                    </Typography>
                    <Avatar sx={styles.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        登入
                    </Typography>
                    <FormGroup sx={styles.form} onSubmit={(e) => e.preventDefault()}>
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
                            sx={styles.submit}
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
                            sx={styles.submit}
                        >
                            註冊
                        </Button>
                    </FormGroup>
                </Paper>
            </Box>
        </Box>
    );

    async function login() {
        api.post("/users/login", { email, password })
            .then(({ data }) => {
                const { token } = data;
                if (token) {
                    localStorage.setItem("token", token);
                    const user = decode(token) as User;
                    setUser(user);

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

export default SignIn;
