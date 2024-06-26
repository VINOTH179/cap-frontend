import React, { useState, useEffect } from "react";
import { MOVIES, SCREENS, THEATERS } from "../data/movieData";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import axios from 'axios';
import {
  Button,
  Container,
  Typography,
  Grid,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Box,
  IconButton
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CloseIcon from '@mui/icons-material/Close';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';

export default function MovieDetails() {
  const { movieId } = useParams();
  const selectedMovie = MOVIES.find((movie) => movie.id === parseInt(movieId, 10));
  const [selectedTheater, setSelectedTheater] = useState(null);
  const [selectedScreen, setSelectedScreen] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [seatError, setSeatError] = useState(false);

  useEffect(() => {
    setSelectedTheater(null);
    setSelectedScreen(null);
    setSelectedSeats([]);
    axios.get('https://cap-backend-mongodb.onrender.com/booked-tickets')
      .then(response => {
        const bookedSeatsData = response.data.map(seat => seat.screenId * 100 + seat.seatIndex);
        setBookedSeats(bookedSeatsData);
      })
      .catch(error => console.log(error));
  }, [movieId]);

  const handleTheaterSelect = (theaterId) => {
    const theater = THEATERS.find((theater) => theater.id === theaterId);
    setSelectedTheater(theater);
    setSelectedScreen(null);
    setSelectedSeats([]);
    setSeatError(false);
  };

  const handleScreenSelect = (screenId) => {
    const screen = SCREENS.find((screen) => screen.id === screenId);
    setSelectedScreen(screen);
    setSelectedSeats([]);
    setSeatError(false);
  };

  const handleSeatSelect = (screenId, seatIndex) => {
    const selectedSeat = screenId * 100 + seatIndex;
    if (bookedSeats.includes(selectedSeat)) {
      alert("This seat is already booked. Please choose another seat.");
      return;
    }
    setSelectedSeats(prevSeats => {
      if (prevSeats.includes(selectedSeat)) {
        return prevSeats.filter(seat => seat !== selectedSeat);
      } else {
        return [...prevSeats, selectedSeat];
      }
    });
    setSeatError(false);
  };

  const calculateTotalAmount = () => {
    const numberOfSeats = selectedSeats.length;
    return numberOfSeats * 120;
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setSeatError(true);
    } else {
      const seatIndices = selectedSeats.map(seat => seat % 100);
      axios.post('https://cap-backend-mongodb.onrender.com/book-tickets', {
        screenId: selectedScreen.id,
        seatIndices: seatIndices
      })
      .then(response => {
        if (response.data.success) {
          setBookedSeats(prevBookedSeats => [...prevBookedSeats, ...selectedSeats]);
          setOpenDialog(true);
        } else {
          alert(response.data.error);
        }
      })
      .catch(error => console.log(error));
    }
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handlePlayTrailer = () => {
    setShowTrailer(true);
  };

  if (!selectedMovie) {
    return (
      <Container maxWidth="md">
        <Typography variant="h6" sx={{ mb: 3 }}>
          Movie not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h6" sx={{ mb: 3 }}>
        {selectedMovie.title}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box position="relative">
            <img src={selectedMovie.images} alt={selectedMovie.title} style={{ width: '100%', borderRadius: '5px' }} />
            <IconButton aria-label="play" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} onClick={handlePlayTrailer}>
              <PlayCircleOutlineIcon style={{ fontSize: 64 }} />
            </IconButton>
          </Box>
          {showTrailer && (
            <div style={{ marginTop: 20 }}>
              <ReactPlayer url={selectedMovie.trailer} controls width="100%" />
            </div>
          )}
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h5">Choose your Theater:</Typography>
          <Select
            fullWidth
            onChange={(e) => handleTheaterSelect(e.target.value)}
            value={selectedTheater ? selectedTheater.id : ""}
          >
            <MenuItem value="" disabled>
              Select Theater
            </MenuItem>
            {THEATERS.map((theater) => (
              <MenuItem key={theater.id} value={theater.id}>
                {theater.name}
              </MenuItem>
            ))}
          </Select>
          {selectedTheater && (
            <>
              <Typography variant="h5"><br />Choose your Time:</Typography>
              <Select
                fullWidth
                onChange={(e) => handleScreenSelect(e.target.value)}
                value={selectedScreen ? selectedScreen.id : ""}
              >
                <MenuItem value="" disabled>
                  Select Time
                </MenuItem>
                {SCREENS.filter(screen => screen.theaterId === selectedTheater.id).map(screen => (
                  <MenuItem key={screen.id} value={screen.id}>{screen.time}</MenuItem>
                ))}
              </Select>
            </>
          )}
          {selectedScreen && (
            <>
              <Typography variant="h5"><br />Choose your Seats:</Typography>
              <Grid container spacing={2}>
                {selectedScreen.seats.map((seat, seatIndex) => (
                  <Grid item key={`${selectedScreen.id}-${seatIndex}`} xs={4} sm={3}>
                    <Button
                      variant={selectedSeats.includes(selectedScreen.id * 100 + seatIndex) ? "contained" : "outlined"}
                      color={bookedSeats.includes(selectedScreen.id * 100 + seatIndex) ? "error" : "primary"}
                      onClick={() => handleSeatSelect(selectedScreen.id, seatIndex)}
                      disabled={bookedSeats.includes(selectedScreen.id * 100 + seatIndex)}
                    >
                      {seat}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              {seatError && <Typography color="error" sx={{ mt: 2 }}>Please select at least one seat.</Typography>}
              <Typography variant="h5" sx={{ mt: 2 }}>
                Total Amount: ₹{calculateTotalAmount()}
              </Typography>
              <Button variant="contained" color="primary" onClick={handleBooking} sx={{ mt: 2 }}>
                Book Now
              </Button>
            </>
          )}
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Booking Confirmed</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your booking has been confirmed. Enjoy your movie!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary" autoFocus>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
