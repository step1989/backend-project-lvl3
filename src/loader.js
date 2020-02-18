import axios from 'axios';

const debug = require('debug')('page-loader: axios');
const debugAxios = require('axios-debug-log');

const load = (href, type = 'json') => {
  const parametrsAxios = {
    method: 'get',
    url: href,
    responseType: type,
  };
  const loader = axios.create(parametrsAxios);
  debugAxios.addLogger(loader, debug);
  return loader();
};

export default load;
