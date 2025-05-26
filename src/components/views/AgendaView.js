import React from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
} from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';
import {
  format,
  isSameMonth,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
} from 'date-fns';

const ViewContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 140px)',
  overflow: 'auto',
  borderRadius: 0,
  backgroundColor: theme.palette.background.default,
}));

const DateHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

const EventItem = styled(ListItem)(({ theme, color }) => ({
  borderLeft: `4px solid ${color || theme.palette.primary.main}`,
  marginBottom: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const EmptyState = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(4),
  color: theme.palette.text.secondary,
  height: '100%',
  '& .MuiSvgIcon-root': {
    fontSize: 48,
    marginBottom: theme.spacing(2),
    opacity: 0.5,
  },
}));

const AgendaView = ({ date, events }) => {
  // Filter events for the current month
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Group events by date
  const groupedEvents = daysInMonth.reduce((acc, day) => {
    const dayEvents = events.filter(event => 
      isSameDay(new Date(event.date), day)
    );
    if (dayEvents.length > 0) {
      acc[format(day, 'yyyy-MM-dd')] = dayEvents;
    }
    return acc;
  }, {});

  // Sort dates
  const sortedDates = Object.keys(groupedEvents).sort();

  if (sortedDates.length === 0) {
    return (
      <ViewContainer elevation={0}>
        <EmptyState>
          <CalendarIcon />
          <Typography variant="h6">
            No events this month
          </Typography>
          <Typography variant="body2">
            Click the "Create event" button to add a new event
          </Typography>
        </EmptyState>
      </ViewContainer>
    );
  }

  return (
    <ViewContainer elevation={0}>
      <List>
        {sortedDates.map(dateKey => (
          <React.Fragment key={dateKey}>
            <DateHeader>
              <Typography variant="subtitle1">
                {format(new Date(dateKey), 'EEEE, MMMM d, yyyy')}
              </Typography>
            </DateHeader>
            {groupedEvents[dateKey]
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .map(event => (
                <React.Fragment key={event.id}>
                  <EventItem color={event.color}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle2">
                          {event.title}
                        </Typography>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="text.primary"
                            sx={{ display: 'block' }}
                          >
                            {format(new Date(event.date), 'HH:mm')}
                          </Typography>
                          {event.description && (
                            <Typography
                              component="p"
                              variant="body2"
                              color="text.secondary"
                              sx={{ mt: 0.5 }}
                            >
                              {event.description}
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </EventItem>
                  <Divider variant="inset" component="li" />
                </React.Fragment>
              ))}
          </React.Fragment>
        ))}
      </List>
    </ViewContainer>
  );
};

export default AgendaView; 