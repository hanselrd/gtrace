import * as React from 'react';
import { Container, Segment } from 'semantic-ui-react';

const image =
  'https://i2.wp.com/newtelegraphonline.com/wp-content/uploads/2018/02/airport-runway.png?w=400&ssl=1';

const Landing: React.SFC = () => (
  <div>
    <Segment inverted>
      <Container textAlign="center">
        <img src={image} alt="landing" width={550} />
      </Container>
    </Segment>
  </div>
);

export default Landing;
