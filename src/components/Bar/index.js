import React, { useState, useEffect } from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import { Link, withRouter } from "react-router-dom";
import { useTheme } from "@material-ui/core/styles";
import {
    Navbar,
    Nav,
    BSpan,
    Form,
    FormControl,
    Button,
    Container,
} from "bootstrap-4-react";
import { HashRouter, Route, Switch } from "react-router-dom";
import Home from "../Home";
import "../Bar/index.css";

function Bar(props) {
    return (
        <div>
            <Navbar expand="md" dark bg="dark" fixed="top">
                <Navbar.Brand
                    href="/"
                    style={{
                        paddingLeft: "50px",
                        paddingRight: "60px",
                        fontSize: "30px",
                    }}
                >
                    JTube Club
                </Navbar.Brand>
                <Navbar.Toggler target="#responsive-navbar-nav" />

                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link
                            href="/"
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            主頁
                        </Nav.Link>
                        <Nav.Link
                            href="/All"
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            所有影片
                        </Nav.Link>
                        <Nav.Link
                            href="/Tags"
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            標籤
                        </Nav.Link>
                        <Nav.Link
                            href="/login"
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            登入
                        </Nav.Link>
                        <Nav.Link
                            href="/upload"
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            上傳
                        </Nav.Link>
                        <Nav.Item>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="搜尋影片"
                                    style={{ background: "#210548" }}
                                />
                                <div className="input-group-append">
                                    <button className="btn btn-secondary" type="button">
                                        Search
                                    </button>
                                </div>
                            </div>
                        </Nav.Item>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        </div>
    );
}

export default withRouter(Bar);
