import React, { useState } from "react";
import { Typography, Paper, Divider, Theme, Breakpoint, Button } from "@mui/material";
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import { useNavigate, Navigate } from "react-router-dom";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";
import { api } from "../../api";
import { decode } from "jsonwebtoken";
import { User } from "../../types/user";
import { useUser } from "../App";

const styles = (theme: Theme) =>
    ({
        main: {
            width: "auto",
            display: "block", // Fix IE 11 issue.
            marginLeft: Number(theme.spacing()) * 4,
            marginRight: Number(theme.spacing()) * 4,
            [theme.breakpoints.up(
                `auto${Number(theme.spacing()) * 3 * 2}` as number | Breakpoint
            )]: {
                width: "auto",
                marginLeft: 100,
                marginRight: 100,
            },
        },
        paper: {
            marginTop: Number(theme.spacing()) * 8,
            marginBottom: Number(theme.spacing()) * 2,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: `${Number(theme.spacing()) * 2}px ${Number(theme.spacing()) * 3}px ${
                Number(theme.spacing()) * 3
            }px`,
        },
        loginPaper: {
            marginTop: Number(theme.spacing()) * 3,
            marginBottom: Number(theme.spacing()) * 4,
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
        form: {
            width: "100%", // Fix IE 11 issue.
            marginTop: Number(theme.spacing()),
        },
        formControl: {
            margin: Number(theme.spacing()),
        },

        submit: {
            marginTop: Number(theme.spacing()) * 3,
        },
    } as Styles<Theme, {}, never>);

function Register(props: { classes: any }) {
    const { classes } = props;
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

    return (
        <main className={classes.main}>
            <Bar></Bar>
            <div className="row">
                <div className="col-md-6">
                    <Paper className={classes.paper}>
                        <Typography component="h2" variant="h5">
                            註冊閣下的 jpower 帳戶
                        </Typography>
                        <Divider />
                        <form
                            className={classes.form}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="userName">用戶名稱</label>
                                        <input
                                            className="form-control"
                                            name="userName"
                                            id="userName"
                                            autoComplete="off"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="password">密碼</label>
                                        <input
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            id="confirmpassword"
                                            autoComplete="off"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="confirmpassword">
                                            重新輸入密碼
                                        </label>
                                        <input
                                            className="form-control"
                                            name="confirmpassword"
                                            type="password"
                                            id="confirmpassword"
                                            autoComplete="off"
                                            value={confirmPassword}
                                            onChange={(e) =>
                                                setConfirmPassword(e.target.value)
                                            }
                                            onBlur={onVerifyPassword}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="userName">電郵地址</label>
                                        <input
                                            className="form-control"
                                            name="email"
                                            id="email"
                                            autoComplete="off"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="userName">性別</label>
                                        <select
                                            className="form-select"
                                            name="gender"
                                            id="gender"
                                            autoComplete="off"
                                            value={gender}
                                            onChange={(e) => setGender(e.target.value)}
                                        >
                                            {genderArray.map(function (value) {
                                                return (
                                                    <option value={value}>{value}</option>
                                                );
                                            })}
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Number(enoughYear)}
                                                id="flexCheckDefault"
                                                onChange={() =>
                                                    setEnoughYear(!enoughYear)
                                                }
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="flexCheckDefault"
                                            >
                                                我保證我已滿18歲
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                value={Number(agreement)}
                                                id="flexCheckDefault"
                                                onChange={() => setAgreement(!agreement)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="flexCheckDefault"
                                            >
                                                我同意會員條款及私隱政策
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={onRegister}
                                className="btn btn-primary"
                            >
                                註冊
                            </Button>
                        </form>
                    </Paper>
                </div>
                <div className="col-md-6">
                    <Paper className={classes.paper}>
                        <Typography component="h2" variant="h5">
                            登入到你的 JPower 帳戶
                        </Typography>
                        <Divider />
                        <form
                            className={classes.form}
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <div className="row">
                                <div className="col-md-12">
                                    <div className="form-group">
                                        <label htmlFor="userName">用戶名稱</label>
                                        <input
                                            className="form-control"
                                            name="userName"
                                            id="userName"
                                            autoComplete="off"
                                            value={userName}
                                            onChange={(e) => setUserName(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-12">
                                    <div className="form-group">
                                        <label htmlFor="password">密碼</label>
                                        <input
                                            className="form-control"
                                            name="password"
                                            type="password"
                                            id="confirmpassword"
                                            autoComplete="off"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={login}
                                className="btn btn-primary"
                            >
                                登入
                            </Button>
                        </form>
                    </Paper>
                </div>
            </div>
        </main>
    );

    async function onVerifyPassword() {
        if (password !== "" && confirmPassword !== "") {
            if (password !== confirmPassword) {
                console.log("Password does not match");
                alert("Your Paswword does not match!");
                return;
            }
        }
    }

    async function onRegister() {
        if (agreement && enoughYear) {
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

export default withStyles(styles)(Register);
