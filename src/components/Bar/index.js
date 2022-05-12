import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Navbar, Nav } from "bootstrap-4-react";
import "../Bar/index.css";
import firebase from "firebase";

function Bar(props) {
    const user = firebase.auth().currentUser;
    const [query, setQuery] = useState("");
    return (
        <div>
            <Navbar
                expand="md"
                dark
                bg="dark"
                fixed="top"
                style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.5)" }}
            >
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
                            href={user ? "/" : "/login"}
                            onClick={(event) => {
                                if (user) {
                                    event.preventDefault();
                                    firebase
                                        .auth()
                                        .signOut()
                                        .then(() => {
                                            props.history.push("/");
                                        });
                                }
                            }}
                            style={{
                                color: "white",
                                fontWeigt: "bold",
                                fontSize: "17px",
                            }}
                        >
                            {user ? "登出" : "登入"}
                        </Nav.Link>
                        {user && (
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
                        )}
                        <Nav.Link></Nav.Link>
                        <Nav.Item>
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="搜尋影片"
                                    style={{ background: "#210548", color: "white" }}
                                    onChange={(e) => {
                                        setQuery(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && query)
                                            window.location.replace(`/search?q=${query}`);
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => {
                                            window.location.replace(`/search?q=${query}`);
                                        }}
                                    >
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
