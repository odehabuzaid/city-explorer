import React, { Component } from 'react';
import { Container, Col, Row, Alert, Toast } from 'react-bootstrap';

import axios from 'axios';
import Header from './Header';
import Map from './Map';

export default class Main extends Component {
  constructor( props ){
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
    <Alert variant='danger'>
      `ERROR(${err.code}): ${err.message}`
    </Alert>;
    // console.warn();
  };

  getData = async ( e ) => {
    e.preventDefault();
    await this.setState( { searchQuery: e.target.searchText.value } );

    let searchURL = `https://eu1.locationiq.com/v1/search.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&q=${this.state.searchQuery}&format=json`;
    try {
      let axiosResponse = await axios.get( searchURL );
      // console.log( axiosResponse );
      await this.setState( {
        showMap: true,
        lat: axiosResponse.data[0].lat,
        lon: axiosResponse.data[0].lon,
        display_name: axiosResponse.data[0].display_name,
        showToast: false,
      } );
    } catch ( error ) {
      await this.setState( {
        errorMsg: error.response.status + ' the location not found',
        showToast: true,
      } );
    }
  };

  getCity = async ( long,lat ) => {
    // reverse Lookup << :)
    let searchURL =
      `https://us1.locationiq.com/v1/reverse.php?key=${process.env.REACT_APP_LOCATIONIQ_KEY}&lat=${lat}&lon=${long}` +
      '&format=json';
    let axiosResponse = await axios.get( searchURL );
    //// console.log(axiosResponse)
    await this.setState( {
      display_name: axiosResponse.data.display_name,
    } );

  };

  hideToast = () => {
    this.setState( {
      showToast: false,
    } );
  };

  render() {
    return (
      <>
        <Header getData={this.getData} />
        <main>
          <Container fluid>
            <Row className='justify-content-md-center mb-4'>
              {this.state.showToast && (
                <Toast
                  key='1'
                  style={{ width: '100%' }}
                  delay={1000}
                  show={this.state.showToast}
                  onClick={this.hideToast}
                >
                  <Toast.Header closeButton={false}>
                    <strong className='me-auto'>ERROR</strong>
                  </Toast.Header>
                  <Toast.Body>
                    Cannot get data : {this.state.errorMsg}
                  </Toast.Body>
                </Toast>
              )}
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
            </Row>
          </Container>
        </main>
      </>
    );
  }
}
