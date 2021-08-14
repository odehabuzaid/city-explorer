import axios from 'axios';

export async function getCurrentLocation() {
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };
  let success = ( pos ) => {
    let crd = pos.coords;
    this.setState( {
      lat: crd.latitude,
      lon: crd.longitude,
    } );
    this.getCity( crd.longitude, crd.latitude );
  };
  let error = ( err ) => {
    this.handleError( err.message + ' Please Enable Geolocation to explore current position , Or enter a city name in the box above' );;
  };
  navigator.geolocation.getCurrentPosition( success, error, options );
}
export async function getCity ( long, lat ) {
  let requestQuery = {
    apiURL: process.env.REACT_APP_LOCATIONIQ_REV_URL,
    params: {
      key : process.env.REACT_APP_LOCATIONIQ_KEY,
      lat: lat,
      lon: long,
      format : 'json'
    }
  };
  axios.get( requestQuery.apiURL, requestQuery )
    .then( response => {
      if ( response.data.address.city ) {
        this.setState( {
          cityName: response.data.address.city,
        } );
      } else {
        this.setState( {
          cityName: response.data.display_name,
        } );
      }
      this.getMoviesData( response.data.address.country_code );
      this.getWeatherData( long, lat );
    } ).catch( error => {
      this.handleError( `${error.response.status} \nPlease Check City Name` );
    } );
};

export async function getData ( e ) {
  e.preventDefault();
  this.setState( { loading: true } );
  let requestQuery = {
    apiURL: process.env.REACT_APP_LOCATIONIQ_URL,
    params: {
      key : process.env.REACT_APP_LOCATIONIQ_KEY,
      q :  e.target.searchText.value,
      format : 'json'
    }
  };
  axios.get( requestQuery.apiURL, requestQuery )
    .then( response => {
      this.setState( {
        lat: response.data[0].lat,
        lon: response.data[0].lon,
        showToast: false,
      } );
      this.getCity( response.data[0].lon, response.data[0].lat );
    } ).catch( error => {
      this.handleError( `${error.response.status} \nPlease Check City Name` );
    } );
};
export async function getWeatherData ( long, lat ) {
  let request = `${process.env.REACT_APP_SERVER_URL}/weather/${long}/${lat}`;
  axios
    .get( request )
    .then( ( response ) => {
      this.setState( {
        weatherData: response.data,
        showData: true,
        loading : false,
      } );
    } )
    .catch( ( error ) => {
      this.handleError( `${error.response.status} \nNo Weather Data` );
    } );
};
export async function getMoviesData ( countrycode ) {
  let request = `${process.env.REACT_APP_SERVER_URL}/movies/${countrycode}`;
  axios
    .get( request )
    .then( ( response ) => {
      this.setState( {
        moviesData: response.data ,
        showData : true,
      } );
    } )
    .catch( ( error ) => {
      this.handleError( `${error.response.status} \nNo Movies Data` );
    } );
};

export async function handleError( error ) {
  this.setState( {
    errorMsg: error,
    showToast: true,
    showData: false,
    loading: false,
  } );
}



