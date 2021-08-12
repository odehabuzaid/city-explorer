import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import axios from 'axios';
import Header from './Header';
import Map from './Map';
import BsAlert from './BsAlert';
import Loading from './Loading';

import { startCardRendering } from '../helpers/functions';
const EXPRESS_SERVER = process.env.REACT_APP_SERVER_URL;

export default class Main extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      searchQuery: '',
      showMap: true,
      lat: 0,
      lon: 0,
      display_name: '',
      showToast: false,
      errorMsg: '',
      showWeather: false,
      weatherData: [],
      showMovies : false,
      loading: false,
    };
  }

  componentDidMount() {
    this.setState( { loading: true } );
    this.getCurrentLocation();
  }

  getCurrentLocation() {
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
      // console.warn();
    };
    navigator.geolocation.getCurrentPosition( success, error, options );
  }
  getData = async ( e ) => {
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
  getCity = async ( long, lat ) => {
    // reverse Lookup << :)
    let searchURL = `https://us1.locationiq.com/v1/reverse.php?
      key=${process.env.REACT_APP_LOCATIONIQ_KEY}
      &lat=${lat}
      &lon=${long}
      &format=json`;
    let response = await axios.get( searchURL );
    if ( response.data.address.city ) {
      await this.setState( {
        display_name: response.data.address.city,
      } );
    } else {
      await this.setState( {
        display_name: response.data.display_name,
      } );
    }

    this.getMoviesData( response.data.address.country_code );
    this.getWeatherData( long, lat );
  };
  getWeatherData = async ( long, lat, city ) => {
    let locationURL = `${EXPRESS_SERVER}/weather/${long}/${lat}`;
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
  getMoviesData = async ( countrycode ) => {
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

  render() {
    return (
      <>
        <Header getData={this.getData} />
        {this.state.loading ? <Loading/> :
          <main>
            <Container fluid>
              {this.state.showToast && (
                <BsAlert toggel={true} errorMsg={this.state.error} />
              )}
              {this.state.showMap && (
                <Map
                  cityName={this.state.display_name}
                  imgsrc={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_KEY}
                &center=${this.state.lat},${this.state.lon}
                &zoom=16`}
                  lat={this.state.lat}
                  lon={this.state.lon}
                  showWeather={this.state.showWeather}
                  weatherData={this.state.weatherData}
                />
              )}
              {this.state.showMovies &&
            <Container
              className='d-flex'
              style={{ flexWrap: 'wrap', minWidth: '300px' }}
            >
              {startCardRendering( this.state.moviesData )}
            </Container>}
            </Container>
          </main>}
      </>
    );
  }
}
