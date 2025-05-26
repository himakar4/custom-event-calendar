import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import { format, addHours, startOfDay } from 'date-fns';

const ViewContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const TimeSlot = styled(Box)(({ theme }) => ({
  display: 'flex',
  borderBottom: `1px solid ${theme.palette.divider}`,
  minHeight: 60,
  position: 'relative',
}));

const TimeLabel = styled(Typography)(({ theme }) => ({
  width: 60,
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  paddingRight: theme.spacing(1),
  textAlign: 'right',
}));

const EventContainer = styled(Box)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  marginLeft: theme.spacing(1),
  position: 'absolute',
  left: 60,
  right: 0,
  zIndex: 1,
}));

const DayView = ({ date, events }) => {
  const hours = Array.from({ length: 24 }, (_, i) => {
    const slotTime = addHours(startOfDay(date), i);
    return {
      time: slotTime,
      events: events.filter(event => {
        const eventDate = new Date(event.date);
        return format(eventDate, 'HH') === format(slotTime, 'HH');
      }),
    };
  });

  return (
    <ViewContainer>
      {hours.map(({ time, events: slotEvents }) => (
        <TimeSlot key={time.toISOString()}>
          <TimeLabel>{format(time, 'HH:mm')}</TimeLabel>
          {slotEvents.map(event => (
            <EventContainer
              key={event.id}
              color={event.color}
              style={{
                top: '0',
                height: event.duration || '60px',
              }}
            >
              <Typography variant="subtitle2">{event.title}</Typography>
            </EventContainer>
          ))}
        </TimeSlot>
      ))}
    </ViewContainer>
  );
};

export default DayView; 