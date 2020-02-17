import axios from 'axios';

const load = (href, type = 'json') => {
  const parametrsAxios = {
    method: 'get',
    url: href,
    responseType: type,
  };
  const response = axios(parametrsAxios).catch((error) => console.log(`Проблемы при загрузке страницы\n${error}`));
  return response;
};

export default load;
