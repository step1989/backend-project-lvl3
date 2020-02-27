import axios from 'axios';

require('axios-debug-log');

const load = (href, type = 'json') => {
  const parametrsAxios = {
    method: 'get',
    url: href,
    responseType: type,
  };
  return axios.create(parametrsAxios)();
};

export default load;
