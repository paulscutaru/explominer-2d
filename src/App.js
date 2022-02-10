import './App.css';
import { useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap'
import Grid from './components/Grid'

function App() {
  return (
    <Container className='game'>
      <Grid />
    </Container>
  );
}

export default App;
