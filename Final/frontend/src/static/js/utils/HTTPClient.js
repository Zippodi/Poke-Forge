//taken/modified from second databases lecture code
const handleError = (res) => {
  if (!res.ok) {
    let error = new Error(res.statusText);
    error.status = res.status;
    throw error;
  }
};

export default {
  get: (url) => {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(url);
      handleError(res);
      const data = await res.json();
      resolve(data);
    });
  },

  post: (url, body) => {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Accept': "application/json",
          'Content-Type': 'application/json'
        }
      });
      handleError(res);
      const data = await res.json();
      resolve(data);
    });
  },

  put: (url, body) => {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
          'Accept': "application/json",
          'Content-Type': 'application/json'
        }
      });
      handleError(res);
      const data = await res.json();
      resolve(data);
    });
  },

  delete: (url) => {
    return new Promise(async (resolve, reject) => {
      const res = await fetch(url, {
        method: 'DELETE'
      });
      handleError(res);
      const data = await res.json();
      resolve(data);
    });
  }
};
