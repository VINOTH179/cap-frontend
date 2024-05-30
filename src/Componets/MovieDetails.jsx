import React, { useState, useEffect } from "react";
import { MOVIES, SCREENS, THEATERS } from "../data/movieData";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
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
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Box
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
  const [bookedSeats, setBookedSeats] = useState([]); // State to store booked seats
  const [openDialog, setOpenDialog] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);
  const [seatError, setSeatError] = useState(false); // State for seat selection error

  useEffect(() => {
    // Simulate fetching booked seats from an API
    const fetchBookedSeats = () => {
      // Simulated API response
      const bookedSeatsData = [
        { screenId: 1, seatIndex: 2 },
        { screenId: 1, seatIndex: 3 },
        // Add more booked seats here
      ];
      setBookedSeats(bookedSeatsData.map(seat => seat.screenId * 100 + seat.seatIndex));
    };

    fetchBookedSeats();
  }, []);

  const handleTheaterSelect = (theaterId) => {
    const theater = THEATERS.find((theater) => theater.id === theaterId);
    setSelectedTheater(theater);
    setSelectedScreen(null);
    setSelectedSeats([]);
    setSeatError(false); // Reset seat error when theater is selected
  };

  const handleScreenSelect = (screenId) => {
    const screen = SCREENS.find((screen) => screen.id === screenId);
    setSelectedScreen(screen);
    setSelectedSeats([]);
    setSeatError(false); // Reset seat error when screen is selected
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
    setSeatError(false); // Reset seat error when seat is selected
  };

  const calculateTotalAmount = () => {
    const numberOfSeats = selectedSeats.length;
    return numberOfSeats * 120;
  };

  const handleBooking = () => {
    if (selectedSeats.length === 0) {
      setSeatError(true); // Show seat selection error if no seats are selected
    } else {
      // Simulate API call to book seats
      setTimeout(() => {
        setBookedSeats(prevBookedSeats => [...prevBookedSeats, ...selectedSeats]);
        setOpenDialog(true);
      }, 500);
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
            <Typography variant="h5"><br />Choose your Time:</Typography>
          )}
          {selectedTheater && (
            <Select
              fullWidth
              onChange={(e) => handleScreenSelect(e.target.value)}
              value={selectedScreen ? selectedScreen.id : ""}
            >
              <MenuItem value="" disabled>
                Select Time
              </MenuItem>
              {SCREENS.map(screen => (
                <MenuItem key={screen.id} value={screen.id}>{screen.time}</MenuItem>
              ))}
            </Select>
          )}
          {selectedScreen && (
            <>
              <Typography variant="h5"><br />Choose your Seats:</Typography>
              <Grid container spacing={2}>
                {selectedScreen.seats.map((seat, seatIndex) => (
                  <Grid item key={`${selectedScreen.id}-${seatIndex}`} xs={4} sm={3}>
                    <Button
                      fullWidth
                      variant={selectedSeats.includes(selectedScreen.id * 100 + seatIndex) ? 'contained' : 'outlined'}
                      color={bookedSeats.includes(selectedScreen.id * 100 + seatIndex) ? 'secondary' : 'primary'}
                      onClick={() => handleSeatSelect(selectedScreen.id, seatIndex)}
                      disabled={bookedSeats.includes(selectedScreen.id * 100 + seatIndex)}
                    >
                      {seatIndex + 1}
                    </Button>
                  </Grid>
                ))}
              </Grid>
              <Typography variant="h6"><br />Total Amount: ₹{calculateTotalAmount()}</Typography>
              <Button onClick={handleBooking} variant="contained" color="primary" style={{ float: 'right' }}>Pay Now</Button>
              {seatError && (
                <Typography variant="body2" color="error" style={{ marginTop: 10, float: 'right' }}>Please select your seats before proceeding to payment.</Typography>
              )}
            </>
          )}
        </Grid>
      </Grid>
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <CheckCircleIcon style={{ color: 'green', marginRight: '8px' }} />
            Ticket Booked Successfully
            <IconButton style={{ marginLeft: 'auto' }} onClick={handleDialogClose}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers>
          <DialogContentText>
            <Typography variant="body1" gutterBottom>
              <strong>Movie:</strong> {selectedMovie.title}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Theatre:</strong> {selectedTheater ? selectedTheater.name : 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Screen:</strong> {selectedScreen ? selectedScreen.time : 'N/A'}
            </Typography>
            <Typography variant="body1" gutterBottom>
              <strong>Total Seats:</strong> {selectedSeats.length}
            </Typography>
            <Divider />
            <Typography variant="h6">Seats:</Typography>
            <List>
              {selectedSeats.map(seat => (
                <ListItem key={seat}>
                  <ListItemText primary={`Seat ${seat % 100 + 1}`} />
                </ListItem>
              ))}
            </List>
            <Typography variant="h6">Total Amount: ₹{calculateTotalAmount()}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">OK</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

