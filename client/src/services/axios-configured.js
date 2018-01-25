import axios from 'axios';

axios.defaults.baseUrl = 'http://localhost:5000/';
axios.defaults.proxy = {
  host: 'localhost',
  port: 5000
}
