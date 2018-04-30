import * as React from 'react';
import { Link } from 'react-router-dom';
import { Button, Container, Header, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const logo = require('@app/images/logo.png');

const Landing: React.SFC = () => (
  <div>
    <Segment inverted>
      <Container textAlign="center">
        <Header as="h1" inverted>
          {locale.welcomeTo} Trace
        </Header>
        <img src={logo} alt="landing" width={220} />
        <p>{locale.slogan}</p>
        <Button inverted size="massive" as={Link} to="/login">
          {locale.joinUs}
        </Button>
      </Container>
    </Segment>
  </div>
);

export default Landing;
