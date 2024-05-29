// Components/MovieTicketsBooking.jsx
import React, { useState } from "react";
import { MOVIES } from "../data/movieData";
import { Link } from "react-router-dom";
import { Button, Container, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, TextField, InputAdornment, IconButton } from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

const defaultImage = "/default_image.jpg";

export default function MovieTicketsBooking() {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const handleMovieSelect = (movie) => {
    setSelectedMovie(movie);
  };

  const handleImageError = (e) => {
    e.target.src = defaultImage; 
  };

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
  };

  const filteredMovies = MOVIES.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md">
      <Button component={Link} to="/" sx={{ color: 'black' }}>Logout</Button>
      <Button component={Link} to="/MovieTicketsBooking" sx={{ color: 'black' }}>Home</Button>
      <Typography variant="h6" sx={{ mb: 3 }}>
        Welcome, Please Select Your Favorite Movie
      </Typography>

      <TextField
        label="Search Movies"
        variant="outlined"
        value={searchQuery}
        onChange={handleSearchChange}
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: searchQuery && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearSearch} edge="end">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />
  
      <Grid container spacing={3}>
        {filteredMovies.length ? (
          filteredMovies.map((movie) => (
            <Grid item key={movie.id} xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea
                  component={Link}
                  to={`/movie-details/${movie.id}`}
                  onClick={() => handleMovieSelect(movie)}
                >
                  <CardMedia
                    component="img"
                    height="250"
                    image={movie.images || defaultImage}
                    alt={movie.title}
                    onError={handleImageError} // Handle image loading error
                  />
                  <CardContent>
                    <Typography variant="h6" align="center">
                      {movie.title}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 3 }}>
            No movies available matching your search.
          </Typography>
        )}
      </Grid>
    </Container>
  );
}
