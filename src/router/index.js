import home from '@/views/home';
import login from '@/views/login';
import expert from '@/views/expertRounds';
import createMeeting from '@/views/expertRounds/createMeeting';
import meetingInfo from '@/views/expertRounds/meetingInfo';
import meetingMaterial from '@/views/expertRounds/meetingMaterial';
import register from '@/views/login/register';

const routes = [
    {
        path: '/',
        component: home,
    },
    {
      path: '/login',
      component: login,
    },
    {
      path: '/register',
      component: register,
    },
    {
      path: '/expert',
      component: expert,
    },
    {
      path: '/createMeeting',
      component: createMeeting,
    },
    {
      path: '/meetingInfo',
      component: meetingInfo,
    },
    {
      path: '/meetingMaterial',
      component: meetingMaterial
    }
  ]

export default routes