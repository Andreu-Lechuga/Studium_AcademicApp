import { RouterProvider } from 'react-router';
import { router } from './routes';
import { CalendarProvider } from '../contexts/CalendarContext';

export default function App() {
  return (
    <CalendarProvider>
      <RouterProvider router={router} />
    </CalendarProvider>
  );
}