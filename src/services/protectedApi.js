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

  getEventFlag: (id) => {
    return secureFetch(`/planners/events/flags/${id}`, {
      method: 'GET',
    });
  },

  getEventCeremonies: (id) => {
    return secureFetch(`/planners/work-list/${id}`, {
      method: 'GET',
    });
  },

  createEvent: (eventData) => {
    return secureFetch('/planners/events/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
  },

  addCeremony: (ceremonyData) => {
    return secureFetch('/planners/work-list/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ceremonyData),
    });
  },







  getUserProfile: () => {
    return secureFetch('/user/profile', {
      method: 'GET',
    });
  },

};

export default protectedApi;