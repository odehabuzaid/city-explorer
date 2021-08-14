import React, { Component } from 'react';
import { Card, Button, Col, Row,Alert } from 'react-bootstrap';

import Weather from 'components/sections/main/weather/Weather';

export default class Map extends Component {
  render() {
    const { lon, lat, weatherData,cityName } = this.props;
    return (
      <Row className='justify-content-md-center mb-4 mt-2'>
        <Col sm={5}
          data-aos='slide-up'
          data-aos-offset='400'>
          <Card className='shadow'>
            <Card.Header>{cityName}</Card.Header>
            <Card.Body style={{ padding: '0px', margin: '0px' }}>
              <Card.Img variant='top' src={`${process.env.REACT_APP_MAP_URL}&center=${lat},${lon}&zoom=16`} alt='no data' />
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
          <Col>
            <Row>
              <Alert variant={'success'}>
                {`Weather data of : ${new Date( weatherData.timestamp )}`}
              </Alert>
            </Row>
          </Col>
          {weatherData.data.map( ( day, index ) => (
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
