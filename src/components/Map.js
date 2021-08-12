import React, { Component } from 'react';
import { Card, Button, Col, Row } from 'react-bootstrap';

import Weather from './Weather';
export default class Map extends Component {
  render() {
    const { imgsrc, lon, lat, showWeather, weatherData } = this.props;
    return (
      <Row className='justify-content-md-center mb-4 mt-2'>
        <Col sm={5}>
          <Card className='shadow'>
            <Card.Header>{this.props.cityName}</Card.Header>
            <Card.Body style={{ padding: '0px', margin: '0px' }}>
              <Card.Img variant='top' src={imgsrc} alt='no data' />
              <Card.Footer style={{ margin: '0px', padding: '4px' }}>
                <Button disabled className='m-2' variant='warning'>
                  Latitude: {lat}
                </Button>
                <Button disabled variant='danger'>
                  Longitude: {lon}
                </Button>
              </Card.Footer>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={5} className='justify-content-md-center mt-4'>
          {showWeather &&
            weatherData.map( ( day, index ) => (
              <Weather
                key={index}
                description={day.description}
                forcastDate={day.forcastDate}
              />
            ) )}
        </Col>
      </Row>
    );
  }
}
