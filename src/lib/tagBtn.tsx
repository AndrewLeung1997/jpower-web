import { Button, SxProps, Theme } from "@mui/material";
import { Link } from "react-router-dom";
import Slash from "./slash";

export default function TagBtn(props: { tag: string; sx?: SxProps<Theme> }) {
    const { tag, sx } = props;
    return (
        <Button
            sx={{
                paddingLeft: "2px",
                textDecoration: "none",
                textTransform: "none",
                color: "#FCFCFC !important",
                fontSize: 20,
                ...sx,
            }}
            component={Link}
            variant="text"
            to={`/Search/tag/${tag}`}
        >
            <Slash />
            {tag}
        </Button>
    );
}
