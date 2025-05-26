import React from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography, Paper, Grid } from '@mui/material';
import {
  format,
  addMonths,
  startOfYear,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
} from 'date-fns';

const ViewContainer = styled(Paper)(({ theme }) => ({
  height: 'calc(100vh - 200px)',
  overflow: 'auto',
  padding: theme.spacing(2),
}));

const MonthContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
}));

const MonthHeader = styled(Typography)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(1),
  color: theme.palette.primary.main,
  fontWeight: 'bold',
}));

const DayGrid = styled(Grid)(({ theme }) => ({
  gap: 2,
}));

const Day = styled(Box)(({ theme, isToday, isCurrentMonth, hasEvents }) => ({
  width: 24,
  height: 24,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  fontSize: '0.75rem',
  backgroundColor: isToday 
    ? theme.palette.primary.main 
    : hasEvents 
    ? theme.palette.primary.light 
    : 'transparent',
  color: isToday 
    ? theme.palette.primary.contrastText 
    : !isCurrentMonth 
    ? theme.palette.text.disabled 
    : hasEvents 
    ? theme.palette.primary.contrastText 
    : theme.palette.text.primary,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
}));

const YearView = ({ date, events, onDateClick }) => {
  const months = Array.from({ length: 12 }, (_, i) => {
    const monthDate = addMonths(startOfYear(date), i);
    const days = eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    });

    return {
      date: monthDate,
      days: days.map(day => ({
        date: day,
        hasEvents: events.some(event => 
          format(new Date(event.date), 'yyyy-MM-dd') === format(day, 'yyyy-MM-dd')
        ),
      })),
    };
  });

  return (
    <ViewContainer>
      <Grid container spacing={2}>
        {months.map(({ date: monthDate, days }) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={monthDate.toISOString()}>
            <MonthContainer>
              <MonthHeader variant="subtitle1">
                {format(monthDate, 'MMMM')}
              </MonthHeader>
              <DayGrid container>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(day => (
                  <Grid item key={day}>
                    <Typography
                      variant="caption"
                      color="textSecondary"
                      align="center"
                      style={{ width: 24 }}
                    >
                      {day}
                    </Typography>
                  </Grid>
                ))}
                {days.map(({ date: dayDate, hasEvents }) => (
                  <Grid item key={dayDate.toISOString()}>
                    <Day
                      isToday={isToday(dayDate)}
                      isCurrentMonth={isSameMonth(dayDate, monthDate)}
                      hasEvents={hasEvents}
                      onClick={() => onDateClick(dayDate)}
                    >
                      {format(dayDate, 'd')}
                    </Day>
                  </Grid>
                ))}
              </DayGrid>
            </MonthContainer>
          </Grid>
        ))}
      </Grid>
    </ViewContainer>
  );
};

export default YearView; 