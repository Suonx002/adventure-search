//const variables
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const cityInput = document.querySelector('.city-input');
const searchResults = document.querySelector('.search-results');

// Search form listeners
searchForm.addEventListener('submit', searchSubmit);

function searchSubmit(e) {
  const api_key = 'iys9kXU5AGU12MWqoGc7LkpmZXDAhTkd';
  //cors
  const cors = 'https://cors-anywhere.herokuapp.com/';
  //fetch data from ticketmaster api
  fetch(
    `${cors}https://app.ticketmaster.com/discovery/v2/events.json?keyword=illenium&city=minneapolis&apikey=${api_key}`,
    { mod: 'no-cors' }
  )
    .then(res => res.json())
    .then(data => apiDataResults(data._embedded.events));
  e.preventDefault();
}

function apiDataResults(data) {
  let output = '';
  //loop through each artists
  data.forEach(artist => {
    //search info section of HTML
    //ex: 2019-11-11 split into array by '-' (year,month,day)
    const localDate = artist.dates.start.localDate.split('-');
    const localTime = artist.dates.start.localTime;
    const location = artist._embedded.venues[0];
    const tourTitle = artist.name;
    const seeTicketUrl = artist.url;

    //lineup-content section

    const artistInfo = artist._embedded.attractions[0];

    output += `
    <div class="search-content">
        <div class="search-info">
          <div class="date-info">
            <p class="month">${localDate[1]} <span class="day">${
      localDate[2]
    }</span></p>
            <p class="day-of-week">
              ${localDate[2]}- <span class="time-start">${localTime}</span>
            </p>
          </div>
          <div class="location-info">
            <p class="location-name">${location.city.name}, ${
      location.state.stateCode
    } - ${location.name}</p>
            <p class="artist-title"><em>${tourTitle}</em></p>
          </div>
          <button class="see-ticket-btn"><a href="${seeTicketUrl}">See Tickets</a></button>
          <button class="expand-btn">
            <a href="#"><i class="fas fa-chevron-down"></i></a>
          </button>
        </div>
    </div>
    `;
    console.log(output);

    searchResults.insertAdjacentHTML('beforeend', output);
  });
}
