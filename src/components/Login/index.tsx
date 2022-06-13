import { useState } from "react";
import {
    Typography,
    Paper,
    Avatar,
    Button,
    Theme,
    Box,
    TextField,
    TextFieldProps,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { api } from "../../api";
import { decode } from "jsonwebtoken";
import { User } from "../../types/user";
import { useUser } from "../App";
import { commonStyles } from "../../lib/styles";

const styles = {
    avatar: (theme: Theme) => ({
        margin: 1,
        backgroundColor: theme.palette.secondary.main,
    }),
    alternativeAvatar: (theme: Theme) => ({
        margin: 1,
        backgroundColor: theme.palette.secondary.light,
    }),
    submit: {
        marginTop: 3,
    },
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

    const commonProps: TextFieldProps = {
        variant: "standard",
        required: true,
        fullWidth: true,
        sx: { marginTop: 3 },
    };

    return (
        <Box sx={{ ...commonStyles.main, display: "flex", justifyContent: "center" }}>
            <Paper
                sx={{
                    ...commonStyles.paper,
                    width: "400px",
                    maxWidth: "90vw",
                    marginTop: 5,
                    marginBottom: 5,
                }}
            >
                <Typography component="h2" variant="h5" style={{ textAlign: "center" }}>
                    JPower 會員
                </Typography>
                <Avatar sx={styles.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    登入
                </Typography>
                <form onSubmit={login} style={{ width: "100%" }}>
                    <TextField
                        {...commonProps}
                        label="電郵地址"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                    />
                    <TextField
                        {...commonProps}
                        label="密碼"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        sx={styles.submit}
                    >
                        登入
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        component={Link}
                        to="/register"
                        sx={{ ...styles.submit, color: "white !important" }}
                    >
                        註冊
                    </Button>
                </form>
            </Paper>
        </Box>
    );

    async function login(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
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
