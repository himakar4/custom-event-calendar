import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Grid } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
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
  addMonths,
} from 'date-fns';

const CalendarWrapper = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(2),
}));

const Header = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(2),
}));

const WeekDay = styled(Typography)(({ theme }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: theme.palette.text.secondary,
  fontSize: '0.75rem',
}));

const Day = styled(Box)(({ theme, isSelected, isToday, isCurrentMonth }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  borderRadius: '50%',
  backgroundColor: isSelected 
    ? theme.palette.primary.main 
    : isToday 
    ? theme.palette.primary.light 
    : 'transparent',
  color: isSelected || isToday
    ? theme.palette.primary.contrastText
    : isCurrentMonth 
    ? theme.palette.text.primary 
    : theme.palette.text.disabled,
  '&:hover': {
    backgroundColor: isSelected 
      ? theme.palette.primary.dark 
      : theme.palette.action.hover,
  },
}));

const MiniCalendar = ({ currentDate, onDateSelect }) => {
  const [displayDate, setDisplayDate] = React.useState(currentDate);

  const days = React.useMemo(() => {
    const start = startOfWeek(startOfMonth(displayDate));
    const end = endOfWeek(endOfMonth(displayDate));
    return eachDayOfInterval({ start, end });
  }, [displayDate]);

  const handlePrevMonth = () => {
    setDisplayDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setDisplayDate(prev => addMonths(prev, 1));
  };

  return (
    <CalendarWrapper>
      <Header>
        <IconButton size="small" onClick={handlePrevMonth}>
          <ChevronLeft />
        </IconButton>
        <Typography variant="subtitle2">
          {format(displayDate, 'MMMM yyyy')}
        </Typography>
        <IconButton size="small" onClick={handleNextMonth}>
          <ChevronRight />
        </IconButton>
      </Header>

      <Grid container spacing={0.5}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
          <Grid item key={day}>
            <WeekDay>{day}</WeekDay>
          </Grid>
        ))}
        {days.map(day => (
          <Grid item key={day.toISOString()}>
            <Day
              isSelected={isSameDay(day, currentDate)}
              isToday={isToday(day)}
              isCurrentMonth={isSameMonth(day, displayDate)}
              onClick={() => onDateSelect(day)}
            >
              <Typography variant="caption">
                {format(day, 'd')}
              </Typography>
            </Day>
          </Grid>
        ))}
      </Grid>
    </CalendarWrapper>
  );
};

export default MiniCalendar; 