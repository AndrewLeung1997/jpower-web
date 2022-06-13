import React, { useState } from "react";
import {
    Typography,
    Paper,
    Divider,
    Button,
    Box,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    TextField,
    TextFieldProps,
    InputLabel,
    FormControl,
} from "@mui/material";
import { useNavigate, Navigate } from "react-router-dom";
import { api } from "../../api";
import { decode } from "jsonwebtoken";
import { User } from "../../types/user";
import { useUser } from "../App";
import { commonStyles } from "../../lib/styles";

function Register() {
    const [user, setUser] = useUser();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [enoughYear, setEnoughYear] = useState(false);
    const [gender, setGender] = useState("");
    const [agreement, setAgreement] = useState(false);
    const genderArray = ["男", "女", "不方便透露"];

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
                    width: "600px",
                    maxWidth: "90vw",
                    marginTop: 5,
                    marginBottom: 5,
                }}
            >
                <Typography component="h2" variant="h5">
                    註冊閣下的 jpower 帳戶
                </Typography>
                <Divider />
                <form onSubmit={onRegister} style={{ width: "100%" }}>
                    <TextField
                        {...commonProps}
                        label="用戶名稱"
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                    />
                    <TextField
                        {...commonProps}
                        label="電郵地址"
                        value={email}
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        {...commonProps}
                        label="密碼"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <TextField
                        {...commonProps}
                        label="重新輸入密碼"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        onBlur={onVerifyPassword}
                    />
                    <FormControl sx={{ marginTop: 3, marginBottom: 3 }}>
                        <InputLabel>性別</InputLabel>
                        <Select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            label="性別"
                            variant="standard"
                            required
                        >
                            {genderArray.map(function (value) {
                                return <MenuItem value={value}>{value}</MenuItem>;
                            })}
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                required
                                checked={enoughYear}
                                onChange={(e) => setEnoughYear(e.target.checked)}
                            />
                        }
                        label="我保證我已滿18歲"
                    />
                    <FormControlLabel
                        control={
                            <Checkbox
                                required
                                checked={agreement}
                                onChange={(e) => setAgreement(e.target.checked)}
                            />
                        }
                        label="我同意會員條款及私隱政策"
                        sx={{ marginBottom: 3 }}
                    />
                    <Button type="submit" fullWidth variant="contained" color="primary">
                        註冊
                    </Button>
                </form>
            </Paper>
        </Box>
    );

    async function onVerifyPassword() {
        if (password && confirmPassword && password !== confirmPassword) {
            console.log("Password does not match");
            alert("Your Paswword does not match!");
        }
    }

    async function onRegister(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (password === confirmPassword) {
            api.post("/users/register", { userName, email, password })
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
                        `註冊失敗: ${
                            err?.response?.data?.error || err?.response?.data || err
                        }`
                    );
                });
        }
    }
}

export default Register;
