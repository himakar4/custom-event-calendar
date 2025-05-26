import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import {
  format,
  addDays,
  startOfWeek,
  isSameDay,
  isToday,
  eachHourOfInterval,
  startOfDay,
  endOfDay,
  addHours,
} from 'date-fns';

const ViewContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 140px)',
  overflow: 'auto',
  borderRadius: 0,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

const WeekHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, 1fr)',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
  position: 'sticky',
  top: 0,
  zIndex: 2,
}));

const DayHeader = styled(Box)(({ theme, isToday }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: isToday ? theme.palette.primary.light : theme.palette.background.paper,
  color: isToday ? theme.palette.primary.contrastText : theme.palette.text.primary,
  borderLeft: `1px solid ${theme.palette.divider}`,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const TimelineContainer = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: '50px repeat(7, 1fr)',
  position: 'relative',
}));

const TimeLabel = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'right',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
  height: 60,
  position: 'relative',
  '&::after': {
    content: '""',
    position: 'absolute',
    right: 8,
    top: 0,
    width: 4,
    height: 1,
    backgroundColor: theme.palette.divider,
  },
}));

const DayColumn = styled(Box)(({ theme }) => ({
  borderLeft: `1px solid ${theme.palette.divider}`,
  position: 'relative',
  height: 60,
}));

const HourRow = styled(Box)({
  display: 'contents',
});

const EventItem = styled(Box)(({ theme, color, duration, top }) => ({
  position: 'absolute',
  left: 4,
  right: 4,
  top: top,
  height: duration,
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(0.5, 1),
  fontSize: '0.75rem',
  overflow: 'hidden',
  cursor: 'pointer',
  zIndex: 1,
  '&:hover': {
    opacity: 0.9,
  },
}));

const CurrentTimeLine = styled(Box)(({ theme, offset }) => ({
  position: 'absolute',
  left: 50,
  right: 0,
  top: offset,
  height: 2,
  backgroundColor: theme.palette.error.main,
  zIndex: 1,
}));

const WeekView = ({ date, events }) => {
  const [currentTimeOffset, setCurrentTimeOffset] = React.useState(0);
  const startDate = startOfWeek(date);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));
  const hours = eachHourOfInterval({
    start: startOfDay(date),
    end: endOfDay(date),
  });

  React.useEffect(() => {
    const updateCurrentTime = () => {
      const now = new Date();
      const startOfToday = startOfDay(now);
      const diffInMinutes = (now.getTime() - startOfToday.getTime()) / 1000 / 60;
      setCurrentTimeOffset((diffInMinutes * 60) / 60); // Convert to pixels (1 hour = 60px)
    };

    updateCurrentTime();
    const interval = setInterval(updateCurrentTime, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

  return (
    <ViewContainer elevation={0}>
      <WeekHeader>
        <Box /> {/* Empty cell for time column */}
        {weekDays.map(day => (
          <DayHeader key={day.toISOString()} isToday={isToday(day)}>
            <Typography variant="subtitle2">
              {format(day, 'EEE')}
            </Typography>
            <Typography variant="h6">
              {format(day, 'd')}
            </Typography>
          </DayHeader>
        ))}
      </WeekHeader>

      <TimelineContainer>
        {hours.map(hour => (
          <HourRow key={hour.toISOString()}>
            <TimeLabel>
              {format(hour, 'HH:mm')}
            </TimeLabel>
            {weekDays.map(day => (
              <DayColumn key={day.toISOString()}>
                {events
                  .filter(event => {
                    const eventDate = new Date(event.date);
                    return (
                      isSameDay(day, eventDate) &&
                      format(eventDate, 'HH') === format(hour, 'HH')
                    );
                  })
                  .map(event => {
                    const eventDate = new Date(event.date);
                    const minutesFromTop = (eventDate.getMinutes() * 60) / 60;
                    return (
                      <EventItem
                        key={event.id}
                        color={event.color}
                        duration={event.duration || '50px'}
                        top={minutesFromTop}
                      >
                        <Typography variant="caption" noWrap>
                          {format(eventDate, 'HH:mm')} {event.title}
                        </Typography>
                      </EventItem>
                    );
                  })}
              </DayColumn>
            ))}
          </HourRow>
        ))}
        {isToday(date) && <CurrentTimeLine offset={currentTimeOffset} />}
      </TimelineContainer>
    </ViewContainer>
  );
};

export default WeekView; 