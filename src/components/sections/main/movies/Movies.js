import React, { Component } from 'react';
import { Row, Card } from 'react-bootstrap';

export default class Movies extends Component {
  render() {
    const {
      released_on,
      title,
      overview,
      average_votes,
      total_votes,
      image_url,
      popularity,
    } = this.props;
    return (
      <Row
        style={{ padding: '0px' }}>
        <Card className='shadow' style={{ padding: '0px', width: '100%' }}>
          <Card.Header>
            {title} | {released_on} - Popularity : {popularity}
          </Card.Header>
          <Card.Img
            src={image_url}
            alt={title}
            style={{ margin: '0px', width: '100%' }}
          />
          <Card.Body style={{ padding: '4px', margin: '4px' }}>
            <Card.Text>{overview.substring( 0, 50 )}...</Card.Text>
            <Card.Text style={{ margin: '0px', padding: '4px' }}>
              <strong style={{ fontSize: '35px', float: 'right' }}>
                {average_votes}
                <sup>{total_votes}</sup>
              </strong>
            </Card.Text>
          </Card.Body>
        </Card>
      </Row>
    );
  }
}
