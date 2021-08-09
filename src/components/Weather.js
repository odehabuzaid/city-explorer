import React, { Component } from 'react';
import { Row, Card, Col } from 'react-bootstrap';

export default class Weather extends Component {
  render() {
    const { description, ForcastDate } = this.props;
    return (

      <Card className='shadow mb-2' >
        <Card.Body>
          <Col>
            <Row>{ForcastDate}</Row>
            <Row>{'  '}</Row>
            <Row>{description}</Row>
          </Col>
        </Card.Body>
      </Card>

    );
  }
}
