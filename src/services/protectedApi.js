import { secureFetch } from './secureFetch';


const protectedApi = {

  upcomingEvents: () => {
    return secureFetch('/planners/events/upcoming', {
      method: 'GET',
    });
  },



  getUserProfile: () => {
    return secureFetch('/user/profile', {
      method: 'GET',
    });
  },

};

export default protectedApi;