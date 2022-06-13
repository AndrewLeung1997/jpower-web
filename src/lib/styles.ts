import { SxProps, Theme } from "@mui/material";

export const commonStyles: { [key: string]: SxProps<Theme> } = {
    main: {
        width: "100vw",
        display: "block", // Fix IE 11 issue.
        marginLeft: 3,
        marginRight: 3,
        marginTop: 7,
        backgroundColor: "#222",
    },
    paper: {
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        height: "fit-content",
        alignItems: "center",
        padding: 3,
        paddingTop: 2,
    },
    Tag: {
        width: 10,
        backgroundColor: "#FFC0CB",
        textAlign: "center",
        borderRadius: "10px",
        borderColor: "#ffffff",
        borderStyle: "solid",
    },
    CardMedia: {
        paddingLeft: 1,
        paddingRight: 1,
        paddingTop: 1,
    },
    Pagination: {
        marginTop: 16,
    },
    TimeTag: {
        width: 8,
        backgroundColor: "#808080",
        textAlign: "center",
        borderRadius: "6px",
        borderColor: "#ffffff",
    },
};
