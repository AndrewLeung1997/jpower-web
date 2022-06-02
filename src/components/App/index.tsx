import React, { useState, useEffect, createContext, useContext } from "react";
import FileUpload from "../FileUpload";
import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CssBaseline, CircularProgress } from "@material-ui/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import firebase from "../../firebase";
import Login from "../Login";
import Registration from "../Registration";
import Home from "../Home";
/*import Player from "../Player";
import Filter from "../Filter";
import File from "../File";*/
import Dashboard from "../Dashboard";
/*import UpdateVideoInfo from "../UpdateVideoInfo";
import Tags from "../Tags";
import Search from "../Search";
import All from "../All";
import SearchByTag from "../SearchByTag";*/
import { api } from "../../api";
import { User } from "../../types/user";
import { decode } from "jsonwebtoken";
import { Category } from "../../types/category";
import Bar from "../Bar";
import ResponsiveAppBar from "../Bar/Appbar";

declare module "@mui/material/styles" {
    interface ExtendedTheme {
        space: number;
    }
    interface Theme extends ExtendedTheme {}
    interface ThemeOptions extends ExtendedTheme {}
}

const theme = createTheme({
    palette: {
        primary: {
            main: "#673ab7",
        },
        secondary: {
            main: "#ff5722",
        },
    },
    spacing: 8,
    space: 8,
});

const AppContext = createContext<{
    categories: Category[];
    user: [User | null, React.Dispatch<React.SetStateAction<User | null>>];
    // @ts-ignore
}>(null);

export default function App() {
    const [firebaseInitialized, setFirebaseInitialized] = useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [user, setUser] = useState<User | null>(
        decode(String(localStorage.getItem("token"))) as User | null
    );

    useEffect(() => {
        firebase.isInitialized().then((val) => {
            setFirebaseInitialized(val);
        });
        api.get("/category").then((res: { data: { categories: Category[] } }) => {
            const { categories } = res.data;
            setCategories(categories);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider value={{ categories, user: [user, setUser] }}>
                <CssBaseline />
                <Router>
                    <ResponsiveAppBar />
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Registration />} />
                        <Route path="/upload" element={<FileUpload />} />
                        {/*<Route path="/file" element={File} />
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
        </ThemeProvider>
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
