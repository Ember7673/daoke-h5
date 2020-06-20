import $http from '@/config/http';
import querystring from 'querystring';
import { Message } from 'element-ui';
import axios from 'axios';

export const login = (params) => {
  let requestUrl = '/get-user';
  return $http.post(requestUrl, params)
}

export const register = (params) => {
  let requestUrl = '/create-user';
  return $http.post(requestUrl, params)
}

export const getCosToken = (params) => {
  let requestUrl = '/get-cos-token';
  let queries = querystring.stringify(params);
    requestUrl += '?' + queries
  return $http.get(requestUrl)
}

export const cosUpload = async (params) => {
  const requestUrl = params.url;
  await axios.put(requestUrl,
    {
      file: params.file
    },
    {
      headers: {
        'Authorization': params.token,
      }
    }
  ).then(() => {
    Message.success('文件上传成功');
    return true;
  }).catch(e => {
    Message.error(e)
    return false;
  })
 
}