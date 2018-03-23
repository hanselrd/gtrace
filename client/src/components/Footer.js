import React, { Component } from 'react';
import {
  Button,
  Container,
  Divider,
  Flag,
  Grid,
  Header,
  List,
  Segment
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';

class Footer extends Component {
  render() {
    const date = new Date();
    return (
      <div className="Footer">
        <Segment
          inverted
          vertical
          style={{
            margin: '5em 0 0',
            padding: '5em 0',
            backgroundColor: 'rgb(20, 20, 70)'
          }}
        >
          <Container textAlign="center">
            <Container style={{ marginBottom: '2em' }}>
              <span>
                &copy; Copyright {date.getFullYear()} <strong>Trace</strong>
              </span>
            </Container>
            <List horizontal inverted divided link>
              <List.Item as={Link} to="/site-map">
                Site Map
              </List.Item>
              <List.Item as={Link} to="/contact-us">
                Contact Us
              </List.Item>
              <List.Item as={Link} to="/terms">
                Terms and Conditions
              </List.Item>
              <List.Item as={Link} to="/privacy-policy">
                Privacy Policy
              </List.Item>
            </List>
          </Container>
        </Segment>
        {/* <p>
          &copy; Copyright {date.getFullYear()} <strong>Trace</strong>
        </p> */}
      </div>
    );
  }
}

export default Footer;
