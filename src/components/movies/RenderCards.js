
import Movies from '../Movies';
import {Col} from 'react-bootstrap';

export function handleCardRendering( array ) {
  return (
    <>
      {renderCards( array.slice( 0, 5 ) )}
      <div className='w-100'></div>
      {renderCards( array.slice( 5, 10 ) )}
      <div className='w-100'></div>
      {renderCards( array.slice( 10, 15 ) )}
      <div className='w-100'></div>
      {renderCards( array.slice( 15, 20 ) )}
    </>
  );
}

export function renderCards( cardsArray ) {
  return cardsArray.map( ( movie, index ) => (
    <Col key={index} className='m-4'>
      {
        <Movies
          released_on={movie.released_on}
          title={movie.title}
          overview={movie.overview}
          average_votes={movie.average_votes}
          total_votes={movie.total_votes}
          image_url={movie.image_url}
          popularity={movie.popularity}
        />
      }
    </Col>
  ) );
}

