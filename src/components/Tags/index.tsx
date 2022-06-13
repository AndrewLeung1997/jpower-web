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
                    display: "normal",
                    bgcolor: "#222",
                    marginTop: 3,
                    width: "600px",
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
        api.get("/tags").then(
            (res: {
                data: {
                    tags: {
                        tagName: string; // tag name
                        videoCount: number; // number of videos in this tag
                        lastModified: string; // last modified time, date string
                    }[];
                };
            }) => {
                setTagList(res.data.tags.map((tag) => tag.tagName));
            }
        );
    }
}

export default Tags;
