import * as React from 'react';
import { Card, Header, Grid, Image, Search, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

const fortnite = require('@app/images/fortnite.png');
const overwatch = require('@app/images/overwatch.jpg');
const gta5 = require('@app/images/gta5.png');
const minecraft = require('@app/images/minecraft.jpg');
const watchDogs = require('@app/images/watchdogs.jpg');
const clashOfClans = require('@app/images/clashofclans.jpg');

const Games: React.SFC = () => (
  <div>
    <Segment inverted>
      <Header as="h2">{locale.games}</Header>
      <Grid textAlign="center">
        <Grid.Column>
          <Search fluid size="large" />
        </Grid.Column>
      </Grid>
      <Card.Group itemsPerRow={3} doubling>
        <Card as="a" raised>
          <Image src={fortnite} />
          <Card.Content>
            <Card.Header>Fortnite</Card.Header>
          </Card.Content>
        </Card>
        <Card as="a" raised>
          <Image src={overwatch} />
          <Card.Content>
            <Card.Header>Overwatch</Card.Header>
          </Card.Content>
        </Card>
        <Card as="a" raised>
          <Image src={gta5} />
          <Card.Content>
            <Card.Header>GTA V</Card.Header>
          </Card.Content>
        </Card>
        <Card as="a" raised>
          <Image src={minecraft} />
          <Card.Content>
            <Card.Header>Minecraft</Card.Header>
          </Card.Content>
        </Card>
        <Card as="a" raised>
          <Image src={watchDogs} />
          <Card.Content>
            <Card.Header>Watch Dogs</Card.Header>
          </Card.Content>
        </Card>
        <Card as="a" raised>
          <Image src={clashOfClans} />
          <Card.Content>
            <Card.Header>Clash of Clans</Card.Header>
          </Card.Content>
        </Card>
      </Card.Group>
    </Segment>
  </div>
);

export default Games;
