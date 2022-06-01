import React, { useState } from "react";
import { withRouter } from "react-router-dom";

import { Navbar, Nav } from "react-bootstrap";
import "../Bar/index.css";
import firebase from "firebase";

function Bar(props: { history: any }) {
    const user = firebase.auth().currentUser;
    const [query, setQuery] = useState("");
    const [filter, setFilter] = useState("");
    return (
        <div>
            <Navbar
                expand="md"
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
                        color: "white"
                    }}
                >
                    JPower
                </Navbar.Brand>
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="ml-auto">
                        <Nav.Link
                            href="/"
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "17px",
                            }}
                        >
                            主頁
                        </Nav.Link>
                        <Nav.Link
                            href="/All"
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "17px",
                            }}
                        >
                            所有影片
                        </Nav.Link>
                        <Nav.Link
                            href="/Tags"
                            style={{
                                color: "white",
                                fontWeight: "bold",
                                fontSize: "17px",
                            }}
                        >
                            標籤
                        </Nav.Link>
                        <Nav.Link
                            href={user ? "/" : "/login"}
                            onClick={(event: any) => {
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
                                fontWeight: "bold",
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
                                    fontWeight: "bold",
                                    fontSize: "17px",
                                }}
                            >
                                上傳
                            </Nav.Link>
                        )}
                        <Nav.Link></Nav.Link>
                        <Nav.Item
                            style={{ width: 240, marginRight: 10, marginBottom: 10 }}
                        >
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="過濾影片"
                                    style={{ background: "#210548", color: "white" }}
                                    onChange={(e) => {
                                        setFilter(e.target.value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && filter)
                                            window.location.replace(
                                                `/Search/Tag/${filter}`
                                            );
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-secondary"
                                        type="button"
                                        onClick={() => {
                                            window.location.replace(
                                                `/Search/Tag/${filter}`
                                            );
                                        }}
                                    >
                                        Filter
                                    </button>
                                </div>
                            </div>
                        </Nav.Item>
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
