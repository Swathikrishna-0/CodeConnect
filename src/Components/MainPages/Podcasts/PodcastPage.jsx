import React from "react";
import { Typography, Box, Grid, Card, CardContent } from "@mui/material";

const PodcastPage = () => {
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
    <Box sx={{ mb: 4 }}>
      <Typography
        variant="h5"
        sx={{ mb: 2, color: "#ffb17a", textAlign: "center" }}
      >
        Welcome to the world of Podcasts
      </Typography>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
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
                <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
                  {section.title}
                </Typography>
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
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
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
        <Typography variant="h6" sx={{ mb: 2, color: "#ffb17a" }}>
          Indian Tech Startups
        </Typography>
        <iframe style={{ borderRadius: "12px" }} src="https://open.spotify.com/embed/playlist/37i9dQZF1DWWYU1hafNQFA?utm_source=generator" width="100%" height="500" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>
      </Box>
    </Box>
  );
};

export default PodcastPage;
