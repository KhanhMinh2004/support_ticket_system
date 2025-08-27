import React, { useState, useEffect } from 'react';
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
  MenuItem
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, parsers } from 'date-fns';
import axios from 'axios';
import Header from '../../component/HeaderAdmin';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const API_URL = import.meta.env.VITE_API_URL;

const ChartWithDateFilter = () => {
  const token = localStorage.getItem('token');
  const [selectedDate, setselectedDate] = useState(new Date());
  const [groupBy, setGroupBy] = useState("day");
  const [chartData, setChartData] = useState([]);

  let dateParam = "";
    if (groupBy === "day") {
      dateParam = format(selectedDate, "yyyy-MM-dd");
    } else if (groupBy === "month") {
      dateParam = format(selectedDate, "yyyy-MM");
    } else if (groupBy === "year") {
      dateParam = format(selectedDate, "yyyy");
    }

  useEffect(() => {
    axios.get(`${API_URL}/tickets/stats?group_by=${groupBy}&date=${dateParam}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) =>{
      setChartData(res.data)
    })
    .catch(error => {
      console.error(error);
    })
  }, [selectedDate, groupBy]);

  const data = {
    labels: chartData.map(item => (item.date)),
    datasets: [{
      label: 'Số lượng vé',
      data: chartData.map(item => item.count),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1
    }]
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
    <div>
      <Header />
    
      <Box sx={{ maxWidth: 600, margin: 'auto', mt: 4 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>Thống kê theo thời gian</Typography>

        <LocalizationProvider dateAdapter={AdapterDateFns} >
          <DatePicker
            label="Chọn ngày"
            format='yyyy/MM/dd'
            value={selectedDate}
            onChange={(newValue) => setselectedDate(newValue)}
            renderInput={(params) => <TextField fullWidth sx={{ mb: 2 }} {...params} />}
            sx={{ mb: 4 }}
          />
        </LocalizationProvider>

        <TextField
          select
          fullWidth
          label="Chế độ thống kê"
          value={groupBy}
          onChange={(e) => setGroupBy(e.target.value)}
          sx={{ mb: 4 }}
        >
          <MenuItem value="day">Ngày</MenuItem>
          <MenuItem value="month">Tháng</MenuItem>
          <MenuItem value="year">Năm</MenuItem>
        </TextField>

        <Bar data={data} options={options} />
      </Box>
    </div>
  );
};

export default ChartWithDateFilter;
