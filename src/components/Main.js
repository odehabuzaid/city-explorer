import React, { Component } from 'react';
import { Container } from 'react-bootstrap';

import axios from 'axios';
import Header from './Header';
import Map from './Map';
import BSalert from './BSalert';
import Loading from './Loading';

import {getWeatherData,getMoviesData ,getData} from './functions/dataRequests';
import { handleCardRendering } from './movies/RenderCards';



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
    this.getWeatherData = getWeatherData.bind( this );
    this.getMoviesData = getMoviesData.bind( this );
    this.getData = getData.bind( this );

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


  render() {
    return (
      <>
        <Header getData={this.getData} />
        {this.state.loading ? <Loading/> :
          <main>
            <Container fluid>
              {this.state.showToast && (
                <BSalert toggel={true} errorMsg={this.state.error} />
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
              {handleCardRendering( this.state.moviesData )}
            </Container>}
            </Container>
          </main>}
      </>
    );
  }
}
