# Custom Event Calendar

A modern, feature-rich calendar application built with React and Material-UI that allows you to manage events with multiple views and categories.

## Features

- 📅 Multiple calendar views (Day, Week, Month, Year, Agenda)
- 🎨 Color-coded events and calendar categories
- 🔄 Event recurrence (Daily, Weekly, Monthly)
- 📱 Responsive design with collapsible sidebar
- 💾 Local storage persistence
- 🎯 Mini calendar for quick navigation
- ⚡ Quick event creation and management

## Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd custom-event-calendar
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The application will open in your default browser at `http://localhost:3000`.

## Usage

### Creating Events
1. Click on any date in the calendar or use the "Create event" button
2. Fill in the event details:
   - Title (required)
   - Date and time
   - Description (optional)
   - Calendar category (Work, Meeting, Rest, Movie)
   - Recurrence pattern
   - Color

### Managing Events
- Click on any event to edit or delete it
- Toggle calendar categories using the sidebar checkboxes
- Switch between different views using the view buttons
- Navigate between periods using the arrow buttons

### Calendar Views
- **Day**: Detailed timeline of a single day
- **Week**: Weekly schedule with hourly divisions
- **Month**: Traditional month grid with event previews
- **Year**: Annual overview with event indicators
- **Agenda**: List view of events grouped by date

### Customization
- Change event colors
- Set event recurrence patterns
- Toggle sidebar position
- Filter events by calendar category

## Technologies Used

- React
- Material-UI
- date-fns
- Local Storage API

## Project Structure

```
custom-event-calendar/
├── src/
│   ├── components/
│   │   ├── views/
│   │   │   ├── DayView.js
│   │   │   ├── WeekView.js
│   │   │   ├── MonthView.js
│   │   │   ├── YearView.js
│   │   │   └── AgendaView.js
│   │   ├── Calendar.js
│   │   ├── EventForm.js
│   │   └── MiniCalendar.js
│   ├── types/
│   │   └── index.js
│   └── App.js
└── package.json
```


# Interface
![Screenshot (77)](https://github.com/user-attachments/assets/b99a0afa-4da5-4ce3-af4c-19cb1c9c0036)
![Screenshot (78)](https://github.com/user-attachments/assets/8a92b8d3-1a63-4e09-9d73-22b2a84e3d04)



Github link : https://github.com/himakar4/custom-event-calendar


