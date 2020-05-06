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
