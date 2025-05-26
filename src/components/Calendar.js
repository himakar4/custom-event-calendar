import React, { useState, useEffect } from 'react';
import { format, addMonths, addDays } from 'date-fns';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Divider,
  ButtonGroup,
  Tooltip,
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Add as AddIcon,
  Menu as MenuIcon,
  SwapHoriz as SwapHorizIcon,
} from '@mui/icons-material';
import EventForm from './EventForm';
import DayView from './views/DayView';
import WeekView from './views/WeekView';
import MonthView from './views/MonthView';
import YearView from './views/YearView';
import AgendaView from './views/AgendaView';
import MiniCalendar from './MiniCalendar';

const DRAWER_WIDTH = 280;

const Container = styled(Box)(({ theme }) => ({
  display: 'flex',
  height: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const Main = styled(Box, {
  shouldForwardProp: prop => !['isDrawerOpen', 'drawerAnchor'].includes(prop),
})(({ theme, isDrawerOpen, drawerAnchor }) => ({
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  marginLeft: 0,
  marginRight: 0,
  width: '100%',
  ...(isDrawerOpen && drawerAnchor === 'right' && {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
    marginRight: DRAWER_WIDTH,
  }),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const ViewButton = styled(Button)(({ theme, selected }) => ({
  backgroundColor: selected ? theme.palette.primary.main : 'transparent',
  color: selected ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderRadius: 4,
  textTransform: 'none',
  minWidth: 80,
  padding: theme.spacing(0.5, 2),
  '&:hover': {
    backgroundColor: selected 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
}));

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('month');
  const [isDrawerOpen, setIsDrawerOpen] = useState(true);
  const [drawerAnchor, setDrawerAnchor] = useState('left');
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedCalendars, setSelectedCalendars] = useState({
    work: true,
    meeting: true,
    rest: true,
    movie: true,
  });

  // Load events from localStorage
  useEffect(() => {
    const savedEvents = localStorage.getItem('events');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem('events', JSON.stringify(events));
  }, [events]);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setSelectedEvent(null);
    setIsEventFormOpen(true);
  };

  const handlePrevious = () => {
    if (view === 'year') {
      setCurrentDate(prev => addMonths(prev, -12));
    } else if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, -1));
    } else {
      setCurrentDate(prev => addDays(prev, -1));
    }
  };

  const handleNext = () => {
    if (view === 'year') {
      setCurrentDate(prev => addMonths(prev, 12));
    } else if (view === 'month') {
      setCurrentDate(prev => addMonths(prev, 1));
    } else {
      setCurrentDate(prev => addDays(prev, 1));
    }
  };

  const handleEventSubmit = (eventData) => {
    const eventWithDefaults = {
      ...eventData,
      calendar: eventData.calendar || 'work', // Ensure there's a default calendar
    };

    if (eventData.id) {
      setEvents(prev => prev.map(event => 
        event.id === eventData.id ? eventWithDefaults : event
      ));
    } else {
      setEvents(prev => [...prev, { ...eventWithDefaults, id: Date.now() }]);
    }
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  const handleEventDelete = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleCalendarToggle = (calendar) => {
    setSelectedCalendars(prev => ({
      ...prev,
      [calendar]: !prev[calendar],
    }));
  };

  const toggleDrawerPosition = () => {
    setDrawerAnchor(prev => prev === 'left' ? 'right' : 'left');
  };

  const filteredEvents = events.filter(event => 
    selectedCalendars[event.calendar]
  );

  const renderView = () => {
    switch (view) {
      case 'day':
        return <DayView date={currentDate} events={filteredEvents} />;
      case 'week':
        return <WeekView date={currentDate} events={filteredEvents} />;
      case 'month':
        return (
          <MonthView
            date={currentDate}
            events={filteredEvents}
            onEventClick={handleEventClick}
            onDateClick={handleDateChange}
          />
        );
      case 'year':
        return (
          <YearView
            date={currentDate}
            events={filteredEvents}
            onDateClick={handleDateChange}
          />
        );
      case 'agenda':
        return <AgendaView events={filteredEvents} />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Drawer
        variant="persistent"
        anchor={drawerAnchor}
        open={isDrawerOpen}
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          position: 'relative',
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: 'none',
            borderLeft: 'none',
            position: 'relative',
            backgroundColor: theme => theme.palette.background.default,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            fullWidth
            onClick={() => {
              setSelectedEvent(null);
              setIsEventFormOpen(true);
            }}
          >
            Create event
          </Button>
        </Box>
        <MiniCalendar
          currentDate={currentDate}
          onDateSelect={handleDateChange}
        />
        <Divider />
        <List>
          <ListItem
            secondaryAction={
              <Tooltip title="Switch sidebar position">
                <IconButton edge="end" onClick={toggleDrawerPosition}>
                  <SwapHorizIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <Typography variant="subtitle1">Calendars</Typography>
          </ListItem>
          {Object.entries(selectedCalendars).map(([calendar, isSelected]) => (
            <ListItem
              key={calendar}
              dense
              button
              onClick={() => handleCalendarToggle(calendar)}
            >
              <ListItemIcon>
                <Checkbox
                  edge="start"
                  checked={isSelected}
                  tabIndex={-1}
                  disableRipple
                />
              </ListItemIcon>
              <ListItemText
                primary={calendar.charAt(0).toUpperCase() + calendar.slice(1)}
              />
            </ListItem>
          ))}
        </List>
      </Drawer>

      <Main isDrawerOpen={isDrawerOpen} drawerAnchor={drawerAnchor}>
        <Header>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton 
              onClick={() => setIsDrawerOpen(!isDrawerOpen)}
              size="small"
            >
              <MenuIcon />
            </IconButton>
            <ButtonGroup 
              variant="outlined" 
              size="small"
              sx={{ 
                borderRadius: 1,
                '.MuiButtonGroup-grouped': {
                  minWidth: 40,
                },
              }}
            >
              <IconButton onClick={handlePrevious}>
                <ChevronLeftIcon />
              </IconButton>
              <IconButton onClick={handleNext}>
                <ChevronRightIcon />
              </IconButton>
            </ButtonGroup>
            <Typography variant="h6">
              {format(currentDate, view === 'year' ? 'yyyy' : 'MMMM yyyy')}
            </Typography>
          </Box>
          <ButtonGroup 
            variant="outlined"
            sx={{
              '.MuiButton-root': {
                borderColor: 'transparent',
                '&:not(:last-child)': {
                  borderRight: theme => 
                    `1px solid ${theme.palette.divider}`,
                },
              },
            }}
          >
            <ViewButton
              selected={view === 'day'}
              onClick={() => setView('day')}
            >
              Day
            </ViewButton>
            <ViewButton
              selected={view === 'week'}
              onClick={() => setView('week')}
            >
              Week
            </ViewButton>
            <ViewButton
              selected={view === 'month'}
              onClick={() => setView('month')}
            >
              Month
            </ViewButton>
            <ViewButton
              selected={view === 'year'}
              onClick={() => setView('year')}
            >
              Year
            </ViewButton>
            <ViewButton
              selected={view === 'agenda'}
              onClick={() => setView('agenda')}
            >
              Agenda
            </ViewButton>
          </ButtonGroup>
        </Header>

        {renderView()}

        <EventForm
          open={isEventFormOpen}
          onClose={() => {
            setIsEventFormOpen(false);
            setSelectedEvent(null);
          }}
          event={selectedEvent}
          onSubmit={handleEventSubmit}
          onDelete={handleEventDelete}
          date={currentDate}
        />
      </Main>
    </Container>
  );
};

export default Calendar; 