//const variables
const searchForm = document.querySelector('.search-form');
const searchInput = document.querySelector('.search-input');
const cityInput = document.querySelector('.city-input');
const searchResults = document.querySelector('.search-results');
let id = 0;

// Search form listeners
searchForm.addEventListener('submit', searchSubmit);

// Listener for expand button
document.addEventListener('click', expandBtnClicked);

//clear inputs
function clearInput() {
  document.querySelector('.search-input').value = '';
  document.querySelector('.city-input').value = '';
}

function searchSubmit(e) {
  const api_key = 'iys9kXU5AGU12MWqoGc7LkpmZXDAhTkd';
  //cors
  const cors = 'https://cors-anywhere.herokuapp.com/';

  if (searchInput.value !== '' && cityInput.value !== '') {
    searchInputLowerCase = searchInput.value.toLowerCase().replace(' ');
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
  } else {
    alert('Please double check your typing...');
  }
  e.preventDefault();
}

function apiDataResults(data) {
  clearInput();
  searchResults.style.display = 'block';
  let totalOutput = '';
  //clear html search
  searchResults.innerHTML = '';

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
function expandBtnClicked(e) {
  // for expand btn area
  if (e.target.classList.contains('expand-btn')) {
    const currentId = e.target.parentNode.id;
    const searchInfos = document.querySelectorAll('.search-info');
    searchInfos.forEach(item => {
      if (item.id === currentId) {
        const expandContent = e.target.parentNode.nextSibling.nextSibling;
        const venueContent =
          e.target.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
        //expand content
        if (expandContent.classList.contains('expand-content')) {
          if (
            expandContent.style.display === '' ||
            expandContent.style.display === 'none'
          ) {
            expandContent.style.display = 'block';
          } else {
            expandContent.style.display = 'none';
          }
        }
        if (venueContent.classList.contains('venue-content')) {
          if (
            venueContent.style.display === '' ||
            venueContent.style.display === 'none'
          ) {
            venueContent.style.display = 'block';
          } else {
            venueContent.style.display = 'none';
          }
        }

        // e.target.parentNode.nextSibling.nextSibling;
        // e.target.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
      }
    });

    console.log(
      e.target.parentNode.nextSibling.nextSibling.nextSibling.nextSibling.style
        .display
    );
  }
  //for <a></a> tag inside expand btn (same logic)
  if (e.target.classList.contains('fa-chevron-down')) {
    // console.log(
    //   e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling
    // );
    // console.log(
    //   e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling
    //     .nextSibling.nextSibling
    // );
    const currentId = e.target.parentNode.parentNode.parentNode.id;
    const searchInfos = document.querySelectorAll('.search-info');
    searchInfos.forEach(item => {
      if (item.id === currentId) {
        const expandContent =
          e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling;
        const venueContent =
          e.target.parentNode.parentNode.parentNode.nextSibling.nextSibling
            .nextSibling.nextSibling;
        console.log(expandContent);
        console.log(venueContent);
        //expand content
        if (expandContent.classList.contains('expand-content')) {
          if (
            expandContent.style.display === '' ||
            expandContent.style.display === 'none'
          ) {
            expandContent.style.display = 'block';
          } else {
            expandContent.style.display = 'none';
          }
        }

        if (venueContent.classList.contains('venue-content')) {
          if (
            venueContent.style.display === '' ||
            venueContent.style.display === 'none'
          ) {
            venueContent.style.display = 'block';
          } else {
            venueContent.style.display = 'none';
          }
        }
        // e.target.parentNode.nextSibling.nextSibling;
        // e.target.parentNode.nextSibling.nextSibling.nextSibling.nextSibling;
      }
    });
  }
}

function displaySearchInfo(artist) {
  //search info section of HTML
  //ex: 2019-11-11 split into array by '-' (year,month,day)
  const month = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ];

  const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const dayOfWeek = new Date(artist.dates.start.localDate);
  const localDate = artist.dates.start.localDate.split('-');
  const location = artist._embedded.venues[0];
  const tourTitle = artist.name;
  const seeTicketUrl = artist.url;

  //military time to standard via stackoverflow
  const localTime = artist.dates.start.localTime.split(':');
  const hours = localTime[0];
  const minutes = localTime[1];
  const seconds = localTime[2];
  let time = `${hours > 12 ? hours - 12 : hours}:${minutes}:${seconds} ${
    hours >= 12 ? 'PM' : 'AM'
  }`;

  const output = ` 
  <div class="date-info">
    <p class="month">${month[localDate[1] - 1]} <span class="day">${
    localDate[2]
  }</span></p>
    <p class="day-of-week">
      ${day[dayOfWeek.getDay() + 1]} - <span class="time-start">${time}</span>
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
  id++;
  return `
    <div class="search-content">
      <div class="search-info" id="${id}">
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
