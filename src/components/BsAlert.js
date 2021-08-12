import React, { Component } from 'react';
import { Col, Row, Toast } from 'react-bootstrap';

export default class BsAlert extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      showToastMsg: this.props.toggel,
    };
  }
  render() {
    const { errorMsg } = this.props;
    return (
      <Row className='justify-content-md-center mb-2'>
        <Col sm={10}>
          <Toast
            key='1'
            delay={1000}
            show={this.state.showToastMsg}
            onClick={() => { this.setState( { showToastMsg: false } ); }}
            className='mt-4'
            style={{ width: '100%' }}
          >
            <Toast.Header closeButton={false}>
              <strong className='me-auto'>Error</strong>
            </Toast.Header>
            <Toast.Body>Cannot get data : {errorMsg}</Toast.Body>
          </Toast>
        </Col>
      </Row>
    );
  }
}
