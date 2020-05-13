import {SERVER_URL} from '../config';

export function gamesLastMonth() {
  let url = `${SERVER_URL}/get/gamesLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function shopEntriesLastMonth() {
  let url = `${SERVER_URL}/get/shopEntriesLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function usersLastMonth() {
  let url = `${SERVER_URL}/get/usersLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function usersDataLastMonth() {
  let url = `${SERVER_URL}/get/usersDataLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function shopEntriesRevenueLastMonth() {
  let url = `${SERVER_URL}/get/shopEntriesRevenueLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function shopEntriesPizzetosLastMonth() {
  let url = `${SERVER_URL}/get/shopEntriesPizzetosLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function uniquevisitsLastMonth() {
  let url = `${SERVER_URL}/get/visitorsLastMonth/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function totalPizzetos() {
  let url = `${SERVER_URL}/get/shopEntriesPizzetosTotal/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}

export function totalRevenue() {
  let url = `${SERVER_URL}/get/shopEntriesRevenueTotal/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}
export function totalVisitors() {
  let url = `${SERVER_URL}/get/visitorsTotal/`;
  let settings = {
    method: 'GET',
  };

  return fetch(url, settings)
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      throw new Error(response.statusText);
    })
    .then((responseJSON) => {
      return responseJSON;
    });
}
