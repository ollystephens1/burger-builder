import axios from 'axios';

const instance = axios.create({
  baseUrl: 'https://burger-builder-ef06c.firebaseio.com/'
});

export default instance;
