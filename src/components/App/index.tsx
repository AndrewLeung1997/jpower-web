import "bootstrap/dist/css/bootstrap.css";
import React, { useState, useEffect, createContext, useContext, useRef } from "react";
import FileUpload from "../FileUpload";
import { Box, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Login";
import Registration from "../Registration";
import Home from "../Home";
import VideoPlayer from "../Player";
import Filter from "../Filter";
import Dashboard from "../Dashboard";
import UpdateVideoInfo from "../UpdateVideoInfo";
import Tags from "../Tags";
/*import Search from "../Search";*/
import All from "../All";
// import SearchByTag from "../SearchByTag";
import { api } from "../../api";
import { User } from "../../types/user";
import { decode } from "jsonwebtoken";
import { Category } from "../../types/category";
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
    width: [number, React.Dispatch<React.SetStateAction<number>>];
    height: [number, React.Dispatch<React.SetStateAction<number>>];
    // @ts-ignore
}>(null);

export default function App() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [user, setUser] = useState<User | null>(
        decode(String(localStorage.getItem("token"))) as User | null
    );
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    useRef(
        window.addEventListener("resize", () => {
            setWidth(window.innerWidth);
            setHeight(window.innerHeight);
        })
    );

    useEffect(() => {
        api.get("/category").then((res: { data: { categories: Category[] } }) => {
            const { categories } = res.data;
            setCategories(categories);
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <AppContext.Provider
                value={{
                    categories,
                    user: [user, setUser],
                    width: [width, setWidth],
                    height: [height, setHeight],
                }}
            >
                <CssBaseline />
                <Box sx={{ bgcolor: "#222", minHeight: "100vh", display: "flex" }}>
                    <Router>
                        <ResponsiveAppBar />
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Registration />} />
                            <Route path="/upload" element={<FileUpload />} />
                            <Route path="/player/id/:id" element={<VideoPlayer />} />
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/filter/category/:category"
                                element={<Filter />}
                            />
                            <Route path="/dashboard" element={<Dashboard />} />
                            {/*<Route path="/search" element={Search} />*/}
                            <Route path="/updateVideoInfo/:id" element={<UpdateVideoInfo />} />
                            <Route path="/Tags" element={<Tags />} />
                            {/*<Route path="/Search/tag/:tag" element={SearchByTag} />*/}
                            <Route path="/All" element={<All />} />
                        </Routes>
                    </Router>
                </Box>
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

export function useWidth() {
    const { width } = useContext(AppContext);
    return width;
}

export function useHeight() {
    const { height } = useContext(AppContext);
    return height;
}

export function useIsSmallWidth() {
    const [width] = useWidth();
    return width < 600;
}

export function useIsSmallHeight() {
    const [height] = useHeight();
    return height < 600;
}
