import React, { useState, useEffect, createContext, useContext } from "react";
import FileUpload from "../FileUpload";
import { MuiThemeProvider, createTheme } from "@material-ui/core/styles";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import firebase from "../../firebase";
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
import { api } from "../../api";
import { User } from "../../types/user";
import { decode } from "jsonwebtoken";

const theme = createTheme();

const AppContext = createContext<{
    categories: string[];
    user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
    // @ts-ignore
}>(null);

export default function App() {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [categories, setCategories] = useState<string[]>([]);
    const [user, setUser] = useState<User | null>(
        decode(String(localStorage.getItem("token"))) as User | null
    );

    useEffect(() => {
        firebase.isInitialized().then((val) => {
            setFirebaseInitialized(val);
            !categories.length &&
                api
                    .get("/category")
                    .then((res: { data: { categories: { categoryName: string }[] } }) => {
                        const { categories } = res.data;
                        setCategories(categories.map(({ categoryName }) => categoryName));
                    });
        });
    });

    return firebaseInitialized !== false ? (
        <MuiThemeProvider theme={theme}>
            <AppContext.Provider value={{ categories, user: [user, setUser] }}>
                <CssBaseline />
                <Router>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        {/*<Route path="/upload" element={FileUpload} />
                        <Route path="/file" element={File} />
    <Route path="/player/id/:id" element={Player} />*/}
                        <Route path="/" element={<Home />} />
                        {/*<Route
                            path="/filter/category/:category"
                            element={Filter}
                        />*/}
                        {/*<Route path="/uploads" element={File} />*/}
                        <Route path="/dashboard" element={<Dashboard />} />
                        {/*<Route path="/search" element={Search} />
                        <Route
                            path="/updateVideoInfo"
                            element={UpdateVideoInfo}
                         />
                        <Route path="/Tags" element={Tags} />
                        <Route path="/Search/tag/:tag" element={SearchByTag} />
                        <Route path="/All" element={All} />*/}
                    </Routes>
                </Router>
            </AppContext.Provider>
        </MuiThemeProvider>
    ) : (
        <div id="loader">
            <CircularProgress />
        </div>
    );
}

export function useCategories() {
    const { categories } = useContext(AppContext);
    return categories;
}

export function useUser() {
    const { user } = useContext(AppContext);
    return user;
}
