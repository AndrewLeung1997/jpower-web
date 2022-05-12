import React, { useState } from "react";
import {
    Typography,
    Paper,
    Divider,
} from "@material-ui/core";
import withStyles from "@material-ui/core/styles/withStyles";
import { withRouter } from "react-router-dom";
import firebase from "../../firebase";
import "../../../node_modules/bootstrap/dist/css/bootstrap.css";
import Bar from "../Bar";

const styles = (theme) => ({
    main: {
        width: "auto",
        display: "block", // Fix IE 11 issue.
        marginLeft: theme.spacing.unit * 4,
        marginRight: theme.spacing.unit * 4,
        [theme.breakpoints.up(`auto${(theme.spacing.unit * 3 * 2)}`)]: {
            width: "auto",
            marginLeft: 100,
            marginRight: 100,
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        marginBottom: theme.spacing.unit * 2,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${
            theme.spacing.unit * 3
        }px`,
    },
    loginPaper: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 4,
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

function Register(props) {
    const { classes } = props;

    const [userName, setUserName] = useState("");
    const [englishName, setEnglishName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [enoughYear, setEnoughYear] = useState(false);
    const [gender, setGender] = useState("");
    const [agreement, setAgreement] = useState(false);
    const genderArray = ["男", "女", "不方便透露"];

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
                            onSubmit={(e) => e.preventDefault() && false}
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
                                        <div class="form-check">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                value={enoughYear}
                                                id="flexCheckDefault"
                                                onChange={() =>
                                                    setEnoughYear(!enoughYear)
                                                }
                                            />
                                            <label
                                                class="form-check-label"
                                                for="flexCheckDefault"
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
                                        <div class="form-check">
                                            <input
                                                class="form-check-input"
                                                type="checkbox"
                                                value={agreement}
                                                id="flexCheckDefault"
                                                onChange={() => setAgreement(!agreement)}
                                            />
                                            <label
                                                class="form-check-label"
                                                for="flexCheckDefault"
                                            >
                                                我同意會員條款及私隱政策
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={onRegister}
                                className="btn btn-primary"
                            >
                                註冊
                            </button>
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
                            onSubmit={(e) => e.preventDefault() && false}
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
                            <button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                onClick={login}
                                className="btn btn-primary"
                            >
                                登入
                            </button>
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
        if (agreement == true && enoughYear == true) {
            try {
                await firebase.register(userName, email, password);
                await firebase.addData(userName, email, gender, enoughYear, agreement);
                props.history.replace("/dashboard");
            } catch (error) {
                alert(error.message);
            }
        }
    }

    async function login() {
        try {
            await firebase.login(email, password);
            props.history.replace("/dashboard");
        } catch (error) {
            alert(error.message);
        }
    }
}

export default withRouter(withStyles(styles)(Register));
