import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';

import {
  Box,
  TextField,
  Typography,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format } from 'date-fns';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const mockData = [
  { date: '2025-08-01', count: 100 },
  { date: '2025-08-02', count: 150 },
  { date: '2025-08-03', count: 120 },
  { date: '2025-08-04', count: 90 },
  { date: '2025-08-05', count: 200 },
];

const ChartWithDateFilter = () => {
  const [selectedDate, setSelectedDate] = useState(new Date('2025-08-01'));

  const filtered = mockData.filter(
    item => format(new Date(item.date), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
  );

  const data = {
    labels: filtered.map(item => item.date),
    datasets: [
      {
        label: 'Users',
        data: filtered.map(item => item.count),
        backgroundColor: '#1976d2',
        borderRadius: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>Thống kê theo ngày</Typography>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Chọn ngày"
          value={selectedDate}
          onChange={(newValue) => setSelectedDate(newValue)}
          renderInput={(params) => <TextField fullWidth sx={{ mb: 4 }} {...params} />}
        />
      </LocalizationProvider>
      <Bar data={data} options={options} />
    </Box>
  );
};

export default ChartWithDateFilter;
