import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const image =
  'https://christianchronicle.org/wp-content/uploads/2017/09/home-768x431.jpg';

const Home: React.SFC = () => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.home}</Header>
      <Container textAlign="center">
        <img src={image} alt="home" width={550} />
      </Container>
    </Segment>
  </div>
);

export default Home;
