import React, { Component } from 'react';
import Logo from './assets/logo.png';
import {
  Navbar,
  Container,
  Form,
  Button,
  InputGroup,
  FormControl,
} from 'react-bootstrap';

export default class Header extends Component {
  render() {
    return (
      <Navbar bg='dark' variant='dark'>
        <Container>
          <Navbar.Brand href='#'>
            <img
              alt=''
              src={Logo}
              width='100'
              height='30'
              className='d-inline-block align-top'
            />{' '}
          </Navbar.Brand>
          <Navbar.Collapse className='justify-content-end'>
            <Form onSubmit={this.props.getData} className='justify-content-end'>
              <InputGroup>
                <FormControl
                  placeholder='Enter Location '
                  aria-label='Enter Location'
                  aria-describedby='basic-addon2'
                  name='searchText'
                />
                <Button
                  type='submit'
                  variant='outline-secondary'
                  id='button-addon2'
                >
                  Explore!
                </Button>
              </InputGroup>
            </Form>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    );
  }
}
