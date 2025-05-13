import React from "react";
import { Typography, Box, Grid, Card, CardContent } from "@mui/material";

// PodcastPage component displays curated podcast sections with embedded Spotify iframes
const PodcastPage = () => {
  // Sections with titles and Spotify embed URLs
  const sections = [
    {
      title: "Trending Podcasts",
      embedUrls: [
        "https://open.spotify.com/embed/episode/113ni5udh5i7YqEYcb3FDn/video?utm_source=generator",
        "https://open.spotify.com/embed/episode/5l9MupgL0VKKMswTXd2F8i?utm_source=generator",
        "https://open.spotify.com/embed/episode/2DPYhrpsVXZEYlp0JEotdn?utm_source=generator",
        "https://open.spotify.com/embed/episode/4ztC2xMeBVjvcymJ3qhxrT?utm_source=generator",
      ],
    },
    {
      title: "Podcasts on AI",
      embedUrls: [
        "https://open.spotify.com/embed/episode/7eCSiGoNvPkfnaR4aONUsm?utm_source=generator",
        "https://open.spotify.com/embed/episode/5TyfhJMbr3h6dXvYpjEDsq?utm_source=generator",
        "https://open.spotify.com/embed/episode/1AYejKpHXVu1SOLQU0NX08?utm_source=generator",
        "https://open.spotify.com/embed/episode/4sTdP5Ve4Elqt19jq36Lmy/video?utm_source=generator",
      ],
    },
    {
      title: "Tech Daily",
      embedUrls: [
        "https://open.spotify.com/embed/episode/1Xl2qpTDLJB7zJQQb34lPy?utm_source=generator",
        "https://open.spotify.com/embed/episode/2E1WK1Hsw7EGP1f0biK2n0?utm_source=generator",
      ],
    },
    {
      title: "Ted Tech",
      embedUrls: [
        "https://open.spotify.com/embed/episode/07YqdzOQBTmgtgIUcuI9yl?utm_source=generator",
        "https://open.spotify.com/embed/episode/6MwIhHmpf5S1055ANZXpVU?utm_source=generator",
      ],
    },
  ];
  return (
    <Box sx={{ padding: "20px", color: "#ffffff" }}>
      {/* Page heading and intro */}
      <Typography
         variant="h4"
         sx={{ marginBottom: "10px", fontWeight: "bold",textAlign: "center" }}
      >
        Welcome to the world of Podcasts
      </Typography>
      <Typography
        variant="h6"
        sx={{ marginBottom: "50px", fontSize: "16px", color: "#d1d1e0",textAlign: "center" }}
      >
        Tune into expert insights, developer stories, and the latest in tech—one episode at a time.
      </Typography>
      {/* Featured popular podcasts */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#fff",textDecoration: "underline",fontSize: "25px" }}>
          Popular Podcast
        </Typography>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/episode/5C6bNbZgGNdOgtZK1mwSSA?utm_source=generator"
          width="100%"
          height="152"
          frameBorder="0"
          allowFullScreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
        {/* Additional featured podcast iframes */}
        <Box sx={{ mt: 4 }}>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/episode/5l9MupgL0VKKMswTXd2F8i?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </Box>
        <Box sx={{ mt: 4 }}>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/episode/7d2qd2rD4aKG54musxLm6q?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowfullscreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </Box>
        <Box sx={{ mt: 4 }}>
          <iframe
            style={{ borderRadius: "12px" }}
            src="https://open.spotify.com/embed/episode/1AYejKpHXVu1SOLQU0NX08?utm_source=generator"
            width="100%"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          ></iframe>
        </Box>
      </Box>
      {/* Podcast sections in a grid */}
      <Grid container spacing={2}>
        {sections.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card
              sx={{
                backgroundColor: "transparent",
                border: "1px solid #676f9d",
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, color: "#fff",textDecoration: "underline",fontSize: "25px" }}>
                  {section.title}
                </Typography>
                {/* Render each podcast embed in the section */}
                {section.embedUrls.map((url, idx) => (
                  <Box key={idx} sx={{ mb: 2 }}>
                    <iframe
                      style={{ borderRadius: "12px" }}
                      src={url}
                      width="100%"
                      height={url.includes("video") ? "351" : "152"}
                      frameBorder="0"
                      allowFullScreen=""
                      allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                      loading="lazy"
                    ></iframe>
                  </Box>
                ))}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {/* Additional curated podcast playlists */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#fff",textDecoration: "underline",fontSize: "25px" }}>
          Business and Tech
        </Typography>
        <iframe
          style={{ borderRadius: "12px" }}
          src="https://open.spotify.com/embed/playlist/37i9dQZF1DX9Z1itlyWIjS?utm_source=generator"
          width="100%"
          height="600"
          frameBorder="0"
          allowfullscreen=""
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          loading="lazy"
        ></iframe>
      </Box>
      <Box sx={{ mt: 4 }}>
        <Typography vvariant="h6" sx={{ mb: 2, color: "#fff",textDecoration: "underline",fontSize: "25px" }}>
          Indian Tech Startups
        </Typography>
        <iframe style={{ borderRadius: "12px" }} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWYU1hafNQFA?utm_source=generator" width="100%" height="500" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </Box>
    </Box>
  );
};

export default PodcastPage;
