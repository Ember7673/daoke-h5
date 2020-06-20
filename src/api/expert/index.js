import $http from '@/config/http';
// import querystring from 'querystring';

export const getMeetingList = (params) => {
  let requestUrl = 'get-meeting-list';
  return $http.post(requestUrl, params)
}

export const createMeeting = (params) => {
  let requestUrl = 'create-meeting';
  return $http.post(requestUrl, params)
}

// 更新会议
export const updateMeeting = (params) => {
  let requestUrl = 'update-meeting';
  return $http.post(requestUrl, params)
}

//删除会议
export const deleteMeeting = (params) => {
  let requestUrl = 'delete-meeting';
  return $http.post(requestUrl, params)
}