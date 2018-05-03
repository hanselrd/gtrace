import * as React from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Button, Grid, Segment } from 'semantic-ui-react';
import locale from '@app/core/locale';

interface GameInfo {
  title: string;
  image: string;
  description: string;
}

const gameInfo: GameInfo[] = [
  {
    title: 'Fortnite',
    image: require('@app/images/fortnite.png'),
    description:
      "Fortnite is a co-op sandbox survival game developed by Epic Games and People Can Fly and published by Epic Games. The game was released as a paid-for early access title for Microsoft Windows, macOS, PlayStation 4 and Xbox One on July 25, 2017, with a full free-to-play release expected in 2018. The retail versions of the game were published by Gearbox Publishing, while online distribution of the PC versions is handled by Epic's launcher."
  },
  {
    title: 'Overwatch',
    image: require('@app/images/overwatch.jpg'),
    description:
      'Overwatch is a team-based multiplayer first-person shooter video game developed and published by Blizzard Entertainment, which released on May 24, 2016 for PlayStation 4, Xbox One, and Windows. Overwatch assigns players into two teams of six, with each player selecting from a roster of over 20 characters, known in-game as "heroes", each with a unique style of play, whose roles are divided into four general categories: Offense, Defense, Tank, and Support. Players on a team work together to secure and defend control points on a map or escort a payload across the map in a limited amount of time. Players gain cosmetic rewards that do not affect gameplay, such as character skins and victory poses, as they play the game. The game was initially launched with casual play, with a competitive ranked mode, various \'arcade\' game modes, and a player-customizable server browser subsequently included following its release. Additionally, Blizzard has developed and added new characters, maps, and game modes post-release, while stating that all Overwatch updates will remain free, with the only additional cost to players being microtransactions to earn additional cosmetic rewards.'
  },
  {
    title: 'Grand Theft Auto V',
    image: require('@app/images/gta5.png'),
    description:
      "Grand Theft Auto V is an action-adventure video game developed by Rockstar North and published by Rockstar Games. It was released in September 2013 for PlayStation 3 and Xbox 360, in November 2014 for PlayStation 4 and Xbox One, and in April 2015 for Microsoft Windows. It is the first main entry in the Grand Theft Auto series since 2008's Grand Theft Auto IV. Set within the fictional state of San Andreas, based on Southern California, the single-player story follows three criminals and their efforts to commit heists while under pressure from a government agency. The open world design lets players freely roam San Andreas' open countryside and the fictional city of Los Santos, based on Los Angeles."
  },
  {
    title: 'Minecraft',
    image: require('@app/images/minecraft.jpg'),
    description:
      'Minecraft is a sandbox video game created by Swedish game designer Markus "Notch" Persson, later fully developed and published by Mojang, a company he founded. The creative and building aspects of Minecraft allow players to build with a variety of different cubes in a 3D procedurally generated world. Other activities in the game include exploration, resource gathering, crafting, and combat.'
  },
  {
    title: 'Watch Dogs',
    image: require('@app/images/watchdogs.jpg'),
    description:
      "Watch Dogs (stylized as WATCH_DOGS) is an action-adventure video game developed by Ubisoft Montreal and published by Ubisoft. It was released worldwide on 27 May 2014 for Microsoft Windows, PlayStation 3, PlayStation 4, Xbox 360, and Xbox One, and a Wii U version was released in November 2014. Set in a fictionalized, free-roam, open world version of Chicago, the single-player story follows hacker Aiden Pearce's search for revenge after the killing of his niece. The game is played from a third-person perspective, and the world is navigated on foot or by vehicle. An online multiplayer mode allows up to eight players to engage in cooperative and competitive gameplay."
  },
  {
    title: 'Clash of Clans',
    image: require('@app/images/clashofclans.jpg'),
    description:
      'Clash of Clans is a freemium mobile strategy video game developed and published by Finnish game developer Supercell. The game was released for iOS platforms on August 2, 2012, and on Google Play for Android on October 7, 2013.'
  }
];

export type GameProps = RouteComponentProps<{ id: string }>;

const Game: React.SFC<GameProps> = ({ match }) => (
  <div>
    <Segment inverted>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <Button inverted fluid as={Link} to="/games">
              {locale.goBack}
            </Button>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row columns="equal">
          <Grid.Column textAlign="center">
            <h2>{gameInfo[Number.parseInt(match.params.id) - 1].title}</h2>
            <img
              src={gameInfo[Number.parseInt(match.params.id) - 1].image}
              alt="game"
            />
          </Grid.Column>
          <Grid.Column verticalAlign="middle">
            <p>{gameInfo[Number.parseInt(match.params.id) - 1].description}</p>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  </div>
);

export default Game;
