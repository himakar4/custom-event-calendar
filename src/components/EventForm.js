import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  IconButton,
  Typography,
  Switch,
  FormControlLabel,
  Radio,
  RadioGroup,
  Collapse,
  Divider,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  Close as CloseIcon,
  Delete as DeleteIcon,
  Event as EventIcon,
  AccessTime as TimeIcon,
  Description as DescriptionIcon,
  Repeat as RepeatIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { RecurrenceTypes, EventColors } from '../types';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
  },
}));

const Header = styled(DialogTitle)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const ColorButton = styled(Button, {
  shouldForwardProp: prop => !['selected', 'color'].includes(prop),
})(({ theme, color, selected }) => ({
  minWidth: '40px',
  width: '40px',
  height: '40px',
  padding: 0,
  borderRadius: '50%',
  backgroundColor: color,
  border: selected ? `2px solid ${theme.palette.text.primary}` : 'none',
  '&:hover': {
    backgroundColor: color,
    opacity: 0.8,
  },
}));

const FormSection = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'flex-start',
  gap: theme.spacing(2),
  marginBottom: theme.spacing(3),
}));

const EventForm = ({ open, onClose, onSubmit, onDelete, event, date }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: format(date || new Date(), "yyyy-MM-dd'T'HH:mm"),
    recurrenceType: RecurrenceTypes.NONE,
    recurrenceConfig: {
      interval: 1,
      weekDays: [],
      endDate: null,
    },
    color: EventColors.DEFAULT,
    allDay: false,
    calendar: 'work', // Default calendar category
  });

  useEffect(() => {
    if (event) {
      setFormData({
        ...event,
        date: format(new Date(event.date), "yyyy-MM-dd'T'HH:mm"),
      });
    } else if (date) {
      setFormData(prev => ({
        ...prev,
        date: format(date, "yyyy-MM-dd'T'HH:mm"),
      }));
    }
  }, [event, date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAllDayToggle = () => {
    setFormData(prev => ({
      ...prev,
      allDay: !prev.allDay,
    }));
  };

  const handleColorSelect = (color) => {
    setFormData(prev => ({
      ...prev,
      color,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      date: new Date(formData.date),
    });
  };

  return (
    <StyledDialog open={open} onClose={onClose} fullWidth>
      <form onSubmit={handleSubmit}>
        <Header>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <EventIcon />
            <Typography variant="h6">
              {event ? 'Edit Event' : 'New Event'}
            </Typography>
          </Box>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{ color: 'inherit' }}
          >
            <CloseIcon />
          </IconButton>
        </Header>

        <DialogContent sx={{ pt: 3 }}>
          <FormSection>
            <TextField
              name="title"
              placeholder="Add title"
              value={formData.title}
              onChange={handleChange}
              required
              fullWidth
              variant="standard"
              InputProps={{
                style: { fontSize: '1.5rem' },
              }}
            />
          </FormSection>

          <FormSection>
            <TimeIcon color="action" />
            <Box sx={{ flex: 1 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.allDay}
                    onChange={handleAllDayToggle}
                  />
                }
                label="All day"
              />
              <TextField
                name="date"
                type={formData.allDay ? "date" : "datetime-local"}
                value={formData.date}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                size="small"
                sx={{ mt: 1 }}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          </FormSection>

          <FormSection>
            <DescriptionIcon color="action" />
            <TextField
              name="description"
              placeholder="Add description"
              value={formData.description}
              onChange={handleChange}
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              size="small"
            />
          </FormSection>

          <FormSection>
            <EventIcon color="action" />
            <FormControl fullWidth size="small">
              <InputLabel>Calendar</InputLabel>
              <Select
                name="calendar"
                value={formData.calendar}
                onChange={handleChange}
                label="Calendar"
              >
                <MenuItem value="work">Work</MenuItem>
                <MenuItem value="meeting">Meeting</MenuItem>
                <MenuItem value="rest">Rest</MenuItem>
                <MenuItem value="movie">Movie</MenuItem>
              </Select>
            </FormControl>
          </FormSection>

          <FormSection>
            <RepeatIcon color="action" />
            <Box sx={{ flex: 1 }}>
              <FormControl component="fieldset">
                <RadioGroup
                  name="recurrenceType"
                  value={formData.recurrenceType}
                  onChange={handleChange}
                >
                  <FormControlLabel
                    value={RecurrenceTypes.NONE}
                    control={<Radio />}
                    label="Does not repeat"
                  />
                  <FormControlLabel
                    value={RecurrenceTypes.DAILY}
                    control={<Radio />}
                    label="Daily"
                  />
                  <FormControlLabel
                    value={RecurrenceTypes.WEEKLY}
                    control={<Radio />}
                    label="Weekly"
                  />
                  <FormControlLabel
                    value={RecurrenceTypes.MONTHLY}
                    control={<Radio />}
                    label="Monthly"
                  />
                </RadioGroup>
              </FormControl>
            </Box>
          </FormSection>

          <FormSection>
            <PaletteIcon color="action" />
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {Object.entries(EventColors).map(([name, color]) => (
                <ColorButton
                  key={color}
                  color={color}
                  selected={formData.color === color}
                  onClick={() => handleColorSelect(color)}
                />
              ))}
            </Box>
          </FormSection>
        </DialogContent>

        <Divider />
        <DialogActions sx={{ padding: 2, justifyContent: 'space-between' }}>
          {event && (
            <Button
              onClick={onDelete}
              color="error"
              startIcon={<DeleteIcon />}
            >
              Delete
            </Button>
          )}
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {event ? 'Save' : 'Create'}
            </Button>
          </Box>
        </DialogActions>
      </form>
    </StyledDialog>
  );
};

export default EventForm; 