import axios from 'axios';

require('axios-debug-log');

const load = (href, type = 'json') => {
  const parametrsAxios = {
    method: 'get',
    url: href,
    responseType: type,
  };
  const loader = axios.create(parametrsAxios);
  return loader();
};

export default load;
