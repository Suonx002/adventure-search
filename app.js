//const variables
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const cityInput = document.querySelector('.city-input');
const searchResults = document.querySelector('.search-results');

// Search form listeners
searchForm.addEventListener('submit', searchSubmit);
// Listener for expand button
// searchResults.addEventListener('click', expandBtnClicked);

function searchSubmit(e) {
  const api_key = 'iys9kXU5AGU12MWqoGc7LkpmZXDAhTkd';
  //cors
  const cors = 'https://cors-anywhere.herokuapp.com/';

  if (searchInput.value === '' && cityInput.value === '') {
    alert('Please double check your typing...');
  } else {
    searchInputLowerCase = searchInput.value.toLowerCase();
    cityInputLowerCase = cityInput.value.toLowerCase();
    //fetch data from ticketmaster api
    fetch(
      `${cors}https://app.ticketmaster.com/discovery/v2/events.json?keyword=${searchInputLowerCase}&city=${cityInputLowerCase}&apikey=${api_key}`,
      {}
    )
      .then(res => res.json())
      .then(data => apiDataResults(data._embedded.events))
      .catch(err => {
        alert('There is no data with the following search...');
      });
  }
  e.preventDefault();
}

function apiDataResults(data) {
  searchResults.style.display = 'block';
  console.log(data);
  let totalOutput = '';

  //loop through each search results
  data.forEach(artist => {
    console.log(artist);
    //lineup-content section
    const searchOutput = displaySearchInfo(artist);

    //images for artists loop
    const artistOutput = displayArtistOutput(artist._embedded.attractions);

    //venue details loop
    const venueOutput = displayVenueOutput(artist._embedded.venues[0]);

    //combined all outputs
    const combinedOutput = combinedTotalOutput(
      searchOutput,
      artistOutput,
      venueOutput
    );

    totalOutput += combinedOutput;
  });

  searchResults.insertAdjacentHTML('beforeend', totalOutput);
}

//Expand button
// function expandBtnClicked(e) {
//   const expandContent = document.querySelector('.expand-content');
//   const venueContent = document.querySelector('.venue-content');

//   if (e.target.classList.contains('expand-btn')) {
//     e.target.parentNode.nextSibling.style.display = 'block';
//   }
// }

function displaySearchInfo(artist) {
  //search info section of HTML
  //ex: 2019-11-11 split into array by '-' (year,month,day)
  const localDate = artist.dates.start.localDate.split('-');
  const localTime = artist.dates.start.localTime;
  const location = artist._embedded.venues[0];
  const tourTitle = artist.name;
  const seeTicketUrl = artist.url;

  const output = ` 
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

  <button class="see-ticket-btn"><a href="${seeTicketUrl}" target="_blank">See Tickets</a></button>
  <button class="expand-btn">
    <a href="#"><i class="fas fa-chevron-down"></i> </a>
  </button>
`;

  return output;
}

function displayArtistOutput(artist) {
  let output = '';
  artist.forEach(artistName => {
    output += `
    <div class="artist-img-info">
      <img
        src="${artistName.images[1].url}"
        alt="artist-image"
        class="artist-img"
      />
      <p class="artist-name">${artistName.name}</p>
      <button class="view-more-artist">
        <a href="${artistName.url}" target="_blank"> View More</a>
      </button>
    </div>
  `;
  });
  return output;
}

function displayVenueOutput(venue) {
  return `
      <div class="venue-info">
        <div class="icons">
          <i class="fas fa-parking"></i>
          <p class="phone-number">
            <strong>Box Office Phone Numbers:</strong>
            <em>${
              venue.boxOfficeInfo
                ? venue.boxOfficeInfo.phoneNumberDetail
                : 'Unknown'
            }</em>
          </p>
        </div>

        <div class="icons">
          <i class="fas fa-parking"></i>
          <p class="parking">
            <strong>Parking:</strong>
            <em>${venue.parkingDetail ? venue.parkingDetail : 'Unknown'}</em
            >
          </p>
        </div>

        <div class="icons">
          <i class="far fa-clock"></i>
          <p class="box-office">
            <strong>Box Office Hours:</strong
            ><em
              >${
                venue.boxOfficeInfo
                  ? venue.boxOfficeInfo.openHoursDetail
                  : 'Unknown'
              }</em
            >
          </p>
        </div>

        <div class="icons">
          <i class="far fa-credit-card"></i>
          <p class="payment-type">
            <strong>Payment Accepted:</strong
            ><em>${
              venue.boxOfficeInfo
                ? venue.boxOfficeInfo.acceptedPaymentDetail
                : 'Unknown'
            }</em>
          </p>
        </div>

        <div class="icons">
          <i class="fas fa-baby"></i>
          <p class="chidlren-rule">
            <strong>Children Rules:</strong
            ><em>${
              venue.generalInfo ? venue.generalInfo.childRule : 'Unknown'
            }</em>
          </p>
        </div>

        <div class="icons">
          <i class="fas fa-phone-volume"></i>
          <p class="will-call">
            <strong>Will Call:</strong
            ><em
              >${
                venue.boxOfficeInfo
                  ? venue.boxOfficeInfo.willCallDetail
                  : 'Unknown'
              }</em
            >
          </p>
        </div>
      </div>
    `;
}

function combinedTotalOutput(searchOutput, artistOutput, venueOutput) {
  return `
    <div class="search-content">
      <div class="search-info">
        ${searchOutput}
      </div>
      <div class="expand-content">
       <h3>LINEUP</h3>
        <div class="lineup-content">
          ${artistOutput}
        </div>
      </div>
      <div class="venue-content">
        <h3>VENUE DETAILS</h3>
        ${venueOutput}
      </div>
    </div>
  `;
}
