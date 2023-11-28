import http from './utils/HTTPClient.js';

document.addEventListener('DOMContentLoaded', e => {
  http.get('/api/auth/currentuser').then(user => {
    document.getElementById('btn-preferences').innerHTML = user.username;
    let shiny = document.getElementById('shiny-check');
    shiny.checked = localStorage.getItem('shiny') === 'true';
    shiny.addEventListener('change', e => {
      if (shiny.checked) {
        localStorage.setItem('shiny', true);
      } else {
        localStorage.setItem('shiny', false);
      }
    });
  }).catch(err => {
    if (err.status == 401) {
      window.location.href = '/';
    } else {
      console.error(err);
    }
  });
});