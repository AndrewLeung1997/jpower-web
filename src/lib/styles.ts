import { Theme } from "@mui/material";

export const commonStyles = {
    paper: (theme: Theme) => ({
        marginTop: 10,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${theme.space * 2}px ${theme.space * 3}px ${theme.space * 3}px`,
        backgroundColor: "#222",
    }),
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
}
