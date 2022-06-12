import { Button, Paper, Typography } from "@mui/material";
import { useCategories } from "./App";
import { Link } from "react-router-dom";
import { commonStyles } from "../lib/styles";

export default function CategoryList() {
    const categories = useCategories();
    return (
        <div className="col-md-3">
            <Paper sx={commonStyles.paper}>
                <Typography component="h1" variant="h5" style={{ color: "#FCFCFC" }}>
                    所有類別
                </Typography>
                <div className="well">
                    <ul className="list-group">
                        {categories.map((value, index) => (
                            <Button
                                sx={{
                                    marginTop: 3,
                                    color: "white",
                                    fontSize: "20px",
                                }}
                                component={Link}
                                key={index}
                                to={`/filter/category/${value.categoryId}`}
                            >
                                {value.categoryName}
                            </Button>
                        ))}
                    </ul>
                </div>
            </Paper>
        </div>
    );
}
