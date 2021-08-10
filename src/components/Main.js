import React, { Component } from 'react';
import { Container, Col, Row, Toast } from 'react-bootstrap';

import axios from 'axios';
import Header from './Header';
import Map from './Map';
import Weather from './Weather';
import Movies from './Movies';

const EXPRESS_SERVER = process.env.REACT_APP_SERVER_URL;

export default class Main extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      searchQuery: '',
      locationData: {},
      showMap: true,
      lat: 0,
      lon: 0,
      display_name: '',
      errorAlert: false,
      showToast: false,
      errorMsg: '',
      weatherData: [],
      showWeather: false,
    };
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      this.success,
      this.error,
      this.options
    );
  }

  options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  success = ( pos ) => {
    let crd = pos.coords;
    this.setState( {
      lat: crd.latitude,
      lon: crd.longitude,
    } );
    this.getCity( crd.longitude, crd.latitude );
  };
  error = ( err ) => {
    // console.warn();
  };

  getData = async ( e ) => {
    e.preventDefault();
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
        } );
      } )
      .catch( ( error ) => {
        this.setState( {
          errorMsg: `${error}\n Weather Data Not Found For ${this.state.display_name}`,
          showToast: true,
          showWeather: false,
        } );
      } );
  };

  getMoviesData = async ( countrycode ) => {
    let requestURL = `${process.env.REACT_APP_SERVER_URL}/movies/${countrycode}`;
    axios
      .get( requestURL )
      .then( ( response ) => {
        this.setState( { moviesData: response.data } );
      } )
      .catch( ( error ) => {
        this.setState( {
          errorMsg:
            'Error : ( ' +
            error.response.status +
            ` ) No Movies Data ${this.state.display_name}`,
          showToast: true,
        } );
      } );
  };

  startCardRendering = ( array ) => {
    return (
      <>
        {this.renderCards( array.slice( 0, 5 ) )}
        <div class='w-100'></div>
        {this.renderCards( array.slice( 5, 10 ) )}
        <div class='w-100'></div>
        {this.renderCards( array.slice( 10, 15 ) )}
        <div class='w-100'></div>
        {this.renderCards( array.slice( 15, 20 ) )}
      </>
    );
  };
  renderCards = ( cardsArray ) => {
    return cardsArray.map( ( movie, index ) => (
      <Col key={index} className='m-4'>
        {
          <Movies
            released_on={movie.released_on}
            title={movie.title}
            overview={movie.overview}
            average_votes={movie.average_votes}
            total_votes={movie.total_votes}
            image_url={movie.image_url}
            popularity={movie.popularity}
          />
        }
      </Col>
    ) );
  };
  render() {
    return (
      <>
        <Header getData={this.getData} />
        <main>
          <Container fluid>
            <Row className='justify-content-md-center mb-4'>
              <Col sm={10}>
                {this.state.showToast && (
                  <Toast
                    key='1'
                    delay={1000}
                    show={this.state.showToast}
                    onClick={() => {
                      this.setState( { showToast: false } );
                    }}
                    className='mt-4'
                    style={{ width: '100%' }}
                  >
                    <Toast.Header closeButton={false}>
                      <strong className='me-auto'>ERROR</strong>
                    </Toast.Header>
                    <Toast.Body>
                      Cannot get data : {this.state.errorMsg}
                    </Toast.Body>
                  </Toast>
                )}
              </Col>
            </Row>
            <Row className='justify-content-md-center mb-4'>
              <Col sm={5}>
                {this.state.showMap && (
                  <Map
                    cityName={this.state.display_name}
                    imgsrc={`https://maps.locationiq.com/v3/staticmap?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&center=${this.state.lat},${this.state.lon}&zoom=16&path=fillcolor:%2390EE90|weight:2|color:blue|${this.state.lat}|${this.state.lon}`}
                    lat={this.state.lat}
                    lon={this.state.lon}
                  />
                )}
              </Col>
              <Col sm={5} className='justify-content-md-center mt-4'>
                {this.state.showWeather &&
                  this.state.weatherData.map( ( day, index ) => (
                    <Weather
                      key={index}
                      description={day.description}
                      forcastDate={day.forcastDate}
                    />
                  ) )}
              </Col>
            </Row>
            <Container
              className='d-flex'
              style={{ flexWrap: 'wrap', minWidth: '300px' }}
            >
              {this.state.moviesData &&
                this.startCardRendering( this.state.moviesData )}
            </Container>
          </Container>
        </main>
      </>
    );
  }
}
