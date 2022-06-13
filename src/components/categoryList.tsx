import { Box, Paper, Typography } from "@mui/material";
import { useCategories } from "./App";
import { commonStyles } from "../lib/styles";
import CategoryBtn from "../lib/categoryBtn";

export default function CategoryList() {
    const categories = useCategories();
    return (
        <Box className="col-md-3">
            <Paper sx={{ ...commonStyles.paper, backgroundColor: "#222" }}>
                <Typography component="h1" variant="h5" style={{ color: "white" }}>
                    所有類別
                </Typography>
                <Box sx={{ justifyContent: "center" }}>
                    {categories.map((value, index) => (
                        <CategoryBtn
                            category={value}
                            key={index}
                            sx={{ marginTop: 3, display: "inline-block" }}
                        />
                    ))}
                </Box>
            </Paper>
        </Box>
    );
}
