import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper } from '@mui/material';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  isToday,
} from 'date-fns';

const ViewContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 140px)',
  overflow: 'auto',
  borderRadius: 0,
  backgroundColor: theme.palette.background.default,
  display: 'flex',
  flexDirection: 'column',
}));

const WeekDaysHeader = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  backgroundColor: theme.palette.background.paper,
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const WeekDay = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1.5, 0),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.875rem',
  fontWeight: 500,
  borderRight: `1px solid ${theme.palette.divider}`,
  '&:last-child': {
    borderRight: 'none',
  },
}));

const MonthGrid = styled(Box)(({ theme }) => ({
  display: 'grid',
  gridTemplateColumns: 'repeat(7, 1fr)',
  flex: 1,
  minHeight: 0,
  backgroundColor: theme.palette.background.paper,
}));

const DayCell = styled(Box)(({ theme, isToday, isCurrentMonth }) => ({
  position: 'relative',
  minHeight: '100%',
  padding: theme.spacing(1),
  backgroundColor: theme.palette.background.paper,
  borderRight: `1px solid ${theme.palette.divider}`,
  borderBottom: `1px solid ${theme.palette.divider}`,
  opacity: isCurrentMonth ? 1 : 0.5,
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  '&:nth-of-type(7n)': {
    borderRight: 'none',
  },
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  ...(isToday && {
    '&::after': {
      content: '""',
      position: 'absolute',
      top: 4,
      right: 4,
      width: 6,
      height: 6,
      borderRadius: '50%',
      backgroundColor: theme.palette.primary.main,
    },
  }),
}));

const DayNumber = styled(Typography)(({ theme, isToday }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  ...(isToday && {
    color: theme.palette.primary.main,
    fontWeight: 600,
  }),
}));

const EventsContainer = styled(Box)({
  flex: 1,
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

const EventChip = styled(Box)(({ theme, color }) => ({
  backgroundColor: color || theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(0.5, 1),
  borderRadius: theme.shape.borderRadius,
  fontSize: '0.75rem',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  cursor: 'pointer',
  '&:hover': {
    opacity: 0.9,
  },
}));

const MonthView = ({ date, events, onEventClick, onDateClick }) => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <ViewContainer elevation={0}>
      <WeekDaysHeader>
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <WeekDay key={day}>{day}</WeekDay>
        ))}
      </WeekDaysHeader>
      <MonthGrid>
        {days.map(day => {
          const dayEvents = events.filter(event => 
            isSameDay(new Date(event.date), day)
          );

          return (
            <DayCell
              key={day.toISOString()}
              isToday={isToday(day)}
              isCurrentMonth={isSameMonth(day, date)}
              onClick={() => onDateClick?.(day)}
            >
              <DayNumber isToday={isToday(day)}>
                {format(day, 'd')}
              </DayNumber>
              <EventsContainer>
                {dayEvents.map(event => (
                  <EventChip
                    key={event.id}
                    color={event.color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEventClick?.(event);
                    }}
                  >
                    {format(new Date(event.date), 'HH:mm')} {event.title}
                  </EventChip>
                ))}
              </EventsContainer>
            </DayCell>
          );
        })}
      </MonthGrid>
    </ViewContainer>
  );
};

export default MonthView; 