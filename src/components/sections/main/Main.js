import React from 'react';

import BSalert from 'components/util/utils/BSalert';
import Loading from 'components/util/utils/Loading';
import ScrollButton from 'components/util/utils/scroll/ScrollButton';

import Header from 'components/sections/Header';
import Map from 'components/sections/map/Map';

import Container from 'react-bootstrap/Container';
import {
  getCurrentLocation,
  getWeatherData,
  getMoviesData,
  getData,
  getCity,
  handleError,
} from 'components/functions/dataRequests';

import { handleCardRendering } from 'components/sections/main/movies/cards/RenderCards';

import Aos from 'aos';
export default class Main extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      lat: 0,
      lon: 0,
      weatherData: [],
      moviesData: [],
      cityName: '',
      errorMsg: '',
      showToast: false,
      showData: false,
      loading: true,
    };
    this.getCurrentLocation = getCurrentLocation.bind( this );
    this.getWeatherData = getWeatherData.bind( this );
    this.getMoviesData = getMoviesData.bind( this );
    this.getData = getData.bind( this );
    this.getCity = getCity.bind( this );

    this.handleError = handleError.bind( this );
  }

  componentDidMount() {
    this.getCurrentLocation();
    Aos.init( { duration: 500 } );
  }

  componentDidUpdate() {
    Aos.init( { duration: 500 } );
  }
  render() {
    return (
      <>
        <Header getData={this.getData} />
        {this.state.loading ? (
          <Loading />
        ) : (
          <main>
            <ScrollButton />
            <Container fluid>
              {this.state.showToast && (
                <BSalert toggel={true} errorMsg={this.state.errorMsg} />
              )}
              {this.state.showData && (
                <>
                  <Map
                    lat={this.state.lat}
                    lon={this.state.lon}
                    weatherData={this.state.weatherData}
                    cityName={this.state.cityName}
                  />
                  <Container
                    className='d-flex'
                    style={{ flexWrap: 'wrap', minWidth: '300px' }}
                  >
                    {handleCardRendering( this.state.moviesData )}
                  </Container>
                </>
              )}
            </Container>
          </main>
        )}
      </>
    );
  }
}
