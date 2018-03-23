import React, { Component } from 'react';
import { Button, Grid, Header } from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Landing extends Component {
  render() {
    return (
      <div className="Landing">
        <Header as="h1">Welcome!</Header>
        <Grid>
          <Grid.Row columns="equal">
            <Grid.Column textAlign="center">
              <Button as={Link} to="/home" color="green">
                Take me to the home page
              </Button>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    );
  }
}

export default Landing;
