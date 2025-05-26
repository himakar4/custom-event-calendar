import { useState, useEffect } from 'react';
import { addDays, addWeeks, addMonths, isSameDay, isWithinInterval } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { RecurrenceTypes } from '../types';

const STORAGE_KEY = 'calendar_events';

const generateRecurringEvents = (event, startDate, endDate) => {
  const { recurrenceType, recurrenceConfig } = event;
  const events = [];
  let currentDate = new Date(event.date);

  while ((!endDate || currentDate <= endDate) && 
         (!recurrenceConfig.endDate || currentDate <= new Date(recurrenceConfig.endDate))) {
    if (currentDate >= startDate) {
      if (recurrenceType === RecurrenceTypes.WEEKLY) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'short' });
        if (recurrenceConfig.weekDays.includes(dayName)) {
          events.push({
            ...event,
            date: new Date(currentDate),
            isRecurrence: true,
          });
        }
      } else {
        events.push({
          ...event,
          date: new Date(currentDate),
          isRecurrence: true,
        });
      }
    }

    switch (recurrenceType) {
      case RecurrenceTypes.DAILY:
        currentDate = addDays(currentDate, recurrenceConfig.interval);
        break;
      case RecurrenceTypes.WEEKLY:
        currentDate = addWeeks(currentDate, recurrenceConfig.interval);
        break;
      case RecurrenceTypes.MONTHLY:
        currentDate = addMonths(currentDate, recurrenceConfig.interval);
        break;
      case RecurrenceTypes.CUSTOM:
        currentDate = addDays(currentDate, recurrenceConfig.interval);
        break;
      default:
        currentDate = addDays(currentDate, 1);
    }
  }

  return events;
};

export const useEvents = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      setEvents(JSON.parse(storedEvents));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  const getEventsInRange = (startDate, endDate) => {
    const baseEvents = events.filter(event => {
      const eventDate = new Date(event.date);
      return isWithinInterval(eventDate, { start: startDate, end: endDate });
    });

    const recurringEvents = events
      .filter(event => event.recurrenceType !== RecurrenceTypes.NONE)
      .flatMap(event => generateRecurringEvents(event, startDate, endDate));

    return [...baseEvents, ...recurringEvents];
  };

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: uuidv4(),
    };
    setEvents(prev => [...prev, newEvent]);
    return newEvent;
  };

  const updateEvent = (eventData) => {
    setEvents(prev => prev.map(event => 
      event.id === eventData.id ? { ...eventData } : event
    ));
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  const hasEventConflict = (newEvent) => {
    const existingEvents = getEventsInRange(newEvent.date, newEvent.date);
    return existingEvents.some(event => 
      event.id !== newEvent.id && isSameDay(new Date(event.date), new Date(newEvent.date))
    );
  };

  return {
    events: getEventsInRange(
      new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)
    ),
    addEvent,
    updateEvent,
    deleteEvent,
    hasEventConflict,
    getEventsInRange,
  };
}; 