import React from 'react';
import {Container, Row,Col} from 'react-bootstrap';
const Loading = () => (
  <Container className='d-flex justify-content-center text-center'>
    <Row >
      <Col >
        <br/><br/><br/><br/><br/><br/><br/>
        <div className='loader '></div>
      </Col>
    </Row>
  </Container>
);
export default Loading;
