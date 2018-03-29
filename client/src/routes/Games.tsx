import * as React from 'react';
import { Card, Header, Grid, Search, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const image = 'https://via.placeholder.com/200x200';

const Games: React.SFC = () => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.games}</Header>
      <Grid textAlign="center">
        <Grid.Column>
          <Search fluid size="large" loading />
        </Grid.Column>
      </Grid>
      <Card.Group itemsPerRow={5} doubling>
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
        <Card as="a" raised image={image} />
      </Card.Group>
    </Segment>
  </div>
);

export default Games;
