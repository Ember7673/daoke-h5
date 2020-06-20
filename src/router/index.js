import login from '@/views/login';
import expert from '@/views/expertRounds';
import createMeeting from '@/views/expertRounds/createMeeting';
import meetingInfo from '@/views/expertRounds/meetingInfo';
import meetingMaterial from '@/views/expertRounds/meetingMaterial';
import register from '@/views/login/register';

const routes = [
    {
        path: '/',
        component: resolve=>(require(["@/views/home"],resolve)),
    },
    {
      path: '/login',
      component: resolve=>(require(["@/views/login"],resolve)),
    },
    {
      path: '/register',
      component: resolve=>(require(["@/views/login/register"],resolve)),
    },
    {
      path: '/expert',
      component: resolve=>(require(["@/views/expertRounds"],resolve)),
    },
    {
      path: '/createMeeting',
      component: resolve=>(require(["@/views/expertRounds/createMeeting"],resolve)),
    },
    {
      path: '/meetingInfo',
      component: resolve=>(require(["@/views/expertRounds/meetingInfo"],resolve)),
    },
    {
      path: '/meetingMaterial',
      component: resolve=>(require(["@/views/expertRounds/meetingMaterial"],resolve))
    }
  ]

export default routes