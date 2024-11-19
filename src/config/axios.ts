// Create a new file src/config/axios.ts
import axios from 'axios';
import { Form, Modal, Button, Table, DatePicker } from 'antd';
import moment from 'moment';
import type { Embarcacion } from '../types/embarcacion';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8019',
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;