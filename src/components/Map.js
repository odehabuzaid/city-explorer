import React, { Component } from 'react';
import { Card, Button } from 'react-bootstrap';
export default class Map extends Component {
  render() {
    const { imgsrc, lon, lat} = this.props;
    return (
      <>
        <Card className='shadow' >
          <Card.Header>{this.props.cityName}</Card.Header>
          <Card.Body style={{ padding: '0px', margin: '0px' }} >
            <Card.Img
              variant='top'
              src={imgsrc}
              alt='no data'
            />
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
      </>
    );
  }
}
