import { secureFetch } from './secureFetch';


const protectedApi = {

  upcomingEvents: () => {
    return secureFetch('/planners/events/upcoming', {
      method: 'GET',
    });
  },

  allEvents: (eventType) => {
    const query = eventType ? `?eventType=${eventType}` : '';

    return secureFetch(`/planners/events/my-events${query}`, {
      method: 'GET',
    });
  },

  deleteEvent: (id) => {
    return secureFetch(`/planners/events/delete-event/${id}`, {
      method: 'DELETE',
    });
  },

  getEventDetails: (id) => {
    return secureFetch(`/planners/events/${id}`, {
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