import React, { useState, useEffect, createContext, useContext } from "react";
import FileUpload from "../FileUpload";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import firebase, { db } from "../../firebase";
import Login from "../Login";
import Registration from "../Registration";
import Home from "../Home";
import Player from "../Player";
import Filter from "../Filter";
import File from "../File";
import Dashboard from "../Dashboard";
import UpdateVideoInfo from "../UpdateVideoInfo";
import Tags from "../Tags";
import Search from "../Search";
import All from "../All";
import SearchByTag from "../SearchByTag";

const theme = createTheme();
const CategoryContext = createContext({ categories: [] });
export default function App() {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        firebase.isInitialized().then((val) => {
            setFirebaseInitialized(val);
            !categories.length &&
                db
                    .collection("categories")
                    .get()
                    .then((querySnapshot) => {
                        setCategories(
                            querySnapshot.docs
                                .sort((a, b) => a.data().id - b.data().id)
                                .map((doc) => doc.data().category_name)
                        );
                    });
        });
    });

    return firebaseInitialized !== false ? (
        <MuiThemeProvider theme={theme}>
            <CategoryContext.Provider value={{ categories }}>
                <CssBaseline />
                <Router>
                    <Switch>
                        <Route exact path="/login" component={Login} />
                        <Route exact path="/register" component={Registration} />
                        <Route exact path="/upload" component={FileUpload} />
                        <Route exact path="/file" component={File}></Route>
                        <Route exact path="/player/id/:id" component={Player}></Route>
                        <Route exact path="/" component={Home}></Route>
                        <Route
                            exact
                            path="/filter/category/:category"
                            component={Filter}
                        ></Route>
                        <Route exact path="/uploads" component={File}></Route>
                        <Route exact path="/dashboard" component={Dashboard}></Route>
                        <Route exact path="/search" component={Search}></Route>
                        <Route
                            exact
                            path="/updateVideoInfo"
                            component={UpdateVideoInfo}
                        ></Route>
                        <Route exact path="/Tags" component={Tags}></Route>
                        <Route exact path="/Search/tag/:tag" component={SearchByTag}></Route>
                        <Route exact path="/All" component={All}></Route>
                    </Switch>
                </Router>
            </CategoryContext.Provider>
        </MuiThemeProvider>
    ) : (
        <div id="loader">
            <CircularProgress />
        </div>
    );
}

export function useCategories() {
    const context = useContext(CategoryContext);
    if (context === undefined) {
        throw new Error("useCategories must be used within a CategoryProvider");
    }
    return context.categories;
}
