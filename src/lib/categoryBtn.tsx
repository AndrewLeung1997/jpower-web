import { Button, SxProps, Theme } from "@mui/material";
import { Link } from "react-router-dom";
import { Category } from "../types/category";
import HashTag from "./hashtag";

export default function categoryBtn(props: { category: Category; sx?: SxProps<Theme> }) {
    const { category, sx } = props;
    return (
        <Button
            type="submit"
            variant="text"
            color="secondary"
            component={Link}
            to={`/filter/category/${category.categoryId}`}
            sx={{
                color: "white !important",
                textDecoration: "none",
                textTransform: "none",
                fontSize: 20,
                ...sx,
            }}
        >
            <HashTag />
            {category?.categoryName}
        </Button>
    );
}
