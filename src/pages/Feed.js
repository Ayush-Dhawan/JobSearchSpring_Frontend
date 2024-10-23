import {
  Box,
  Card,
  Grid,
  TextField,
  Typography,
  InputAdornment,
  Button,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { Link } from "react-router-dom";

const Feed = () => {
  const [query, setQuery] = useState("");
  const [posts, setPosts] = useState();
  const [pageNumber, setPageNumber] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  //
    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8080/posts?keyword=${query}&pageNumber=${pageNumber}`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log("rep ka data: ", data.totalPages);
                setTotalPages(data.totalPages)
                setPosts(data.content); // Assuming your API returns an object with a 'content' field
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

            fetchPosts();
    }, [query, pageNumber]);

    const highlightQuery = (text) => {
        // Ensure text is a string and handle cases where it might not be
        const textToHighlight = typeof text === "string" ? text : "";

        if (!query) return textToHighlight; // If no query, return the original text

        // Split text on query, case-insensitive
        const parts = textToHighlight.split(new RegExp(`(${query})`, "gi"));
        return parts.map((part, index) =>
            part.toLowerCase() === query.toLowerCase() ? (
                <span key={index} style={{ backgroundColor: "yellow" }}>
                {part}
            </span>
            ) : (
                part
            )
        );
    };

// console.log(post);
  return (
    <>
        <Grid container spacing={2} sx={{ margin: "2%" }}>
            <Grid item xs={12} sx={12} md={12} lg={12}>
                <Button sx={{ margin: "1% 2%" }} variant="outlined">
                    <Link to="/">Home</Link>
                </Button>
                <Box>
                    <TextField
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        placeholder="Search..."
                        sx={{ width: "75%", padding: "2% auto" }}
                        fullWidth
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setPageNumber(0);
                        }}
                    />
                </Box>
            </Grid>
            {posts &&
                posts.map((p) => {
                    return (
                        <Grid key={p.id} item xs={12} md={6} lg={4}>
                            <Card sx={{ padding: "3%", overflow: "hidden", width: "84%" }}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontSize: "2rem", fontWeight: "600" }}
                                >
                                    {highlightQuery(p.profile)}
                                </Typography>
                                <Typography sx={{ color: "#585858", marginTop:"2%" }} variant="body" >
                                    Description: {p.description}
                                </Typography>
                                <br />
                                <br />
                                <Typography variant="h6">
                                    Years of Experience: {highlightQuery(p.exp)} years
                                </Typography>

                                <Typography gutterBottom  variant="body">Skills : </Typography>
                                {p.techs.map((s, i) => {
                                    return (
                                        <Typography variant="body" gutterBottom key={i}>
                                            {highlightQuery(s)} .
                                            {` `}
                                        </Typography>
                                    );
                                })}

                            </Card>
                        </Grid>
                    );
                })}

        </Grid>
        <button disabled={pageNumber === totalPages - 1} onClick={() => setPageNumber(pageNumber + 1)}>+</button>
        {pageNumber + 1}
        <button onClick={() => setPageNumber(pageNumber> 0 ?pageNumber - 1 : 0)}>-</button>
    </>
  );
};

export default Feed;
