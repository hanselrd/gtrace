import * as React from 'react';
import { Container, Header, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const Home: React.SFC = () => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.home}</Header>
      <Container textAlign="center">
        <Segment inverted>
          <p>No notifications at this time</p>
        </Segment>
      </Container>
    </Segment>
  </div>
);

export default Home;
