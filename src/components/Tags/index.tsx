import React, { useEffect, useState } from "react";
import { Typography, Paper, Box } from "@mui/material";
import { commonStyles } from "../../lib/styles";
import { api } from "../../api";
import TagBtn from "../../lib/tagBtn";
import Loader from "../../lib/loader";

function Tags() {
    const [tagList, setTagList] = useState<string[] | null>(null);

    useEffect(() => {
        getAllTags();
    }, []);

    return (
        <Box sx={{ ...commonStyles.main, display: "flex", justifyContent: "center" }}>
            <Paper
                sx={{
                    ...commonStyles.paper,
                    bgcolor: "#222",
                    marginTop: 3,
                    width: "800px",
                    maxWidth: "90vw",
                }}
            >
                <Typography component="h1" variant="h5" style={{ color: "#FCFCFC" }}>
                    所有標籤
                </Typography>
                {tagList ? (
                    tagList.map((value, index) => (
                        <TagBtn
                            tag={value}
                            key={index}
                            sx={{ display: "inline-block" }}
                        />
                    ))
                ) : (
                    <Loader />
                )}
            </Paper>
        </Box>
    );

    function getAllTags() {
        api.get("/tags").then(({ data }) => {
            setTagList(data.tags);
        });
    }
}

export default Tags;
