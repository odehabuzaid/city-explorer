import axios from 'axios';
// import Main from '../Main';


export async function getWeatherData ( long, lat, city ) {

  let locationURL = `${process.env.REACT_APP_SERVER_URL}/weather/${long}/${lat}`;
  axios
    .get( locationURL )
    .then( ( response ) => {
      this.setState( {
        weatherData: response.data,
        showWeather: true,
        loading : false,
      } );
    } )
    .catch( ( error ) => {
      this.setState( {
        errorMsg: `${error}\n Weather Data Not Found For ${this.state.display_name}`,
        showToast: true,
        showWeather: false,
        loading : false,
      } );
    } );
};
export async function getMoviesData ( countrycode ) {

  let requestURL = `${process.env.REACT_APP_SERVER_URL}/movies/${countrycode}`;
  axios
    .get( requestURL )
    .then( ( response ) => {
      this.setState( {
        moviesData: response.data ,
        showMovies : true} );
    } )
    .catch( ( error ) => {
      this.setState( {
        errorMsg:
              'Error : ( ' +
              error.response.status +
              ` ) No Movies Data ${this.state.display_name}`,
        showToast: true,
        showMovies : false
      } );
    } );
};


export async function getData ( e ) {
  e.preventDefault();
  this.setState( { loading: true } );
  await this.setState( { searchQuery: e.target.searchText.value } );
  let searchURL = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${this.state.searchQuery}&format=json`;
  try {
    let axiosResponse = await axios.get( searchURL );
    await this.setState( {
      showMap: true,
      lat: axiosResponse.data[0].lat,
      lon: axiosResponse.data[0].lon,
      showToast: false,
    } );
    await this.getCity( axiosResponse.data[0].lon, axiosResponse.data[0].lat );
  } catch ( error ) {
    await this.setState( {
      errorMsg: ' the location not found',
      showToast: true,
      showMap: false,
      showWeather: false,
      showMovies : false,
    } );
  }
};
