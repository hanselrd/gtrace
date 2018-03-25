import React, { Component } from 'react';
import { Container, Dropdown, Icon, Menu, Responsive } from 'semantic-ui-react';
import { Link, NavLink } from 'react-router-dom';
import Aux from 'react-aux';
import PropTypes from 'prop-types';
// import locales from '../locales';

class Header extends Component {
  render() {
    const { user } = this.props;
    return (
      <div className="Header">
        <Menu
          fixed="top"
          inverted
          style={{
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.4)',
            backgroundColor: 'rgb(20, 20, 70)',
            height: '75px'
          }}
        >
          <Container>
            <Responsive as={Aux} maxWidth={Responsive.onlyTablet.maxWidth}>
              <Dropdown item icon={<Icon name="sidebar" size="large" />}>
                <Dropdown.Menu>
                  <Dropdown.Header>Navigation</Dropdown.Header>
                  <Dropdown.Item as={NavLink} to="/home">
                    Home
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Responsive>
            <Menu.Item as={Link} to="/home" header>
              <Icon name="game" size="big" />
              <span>
                <h2>Trace</h2>
              </span>
            </Menu.Item>
            <Responsive as={Aux} minWidth={Responsive.onlyComputer.minWidth}>
              <Menu.Item as={NavLink} to="/home">
                Home
              </Menu.Item>
            </Responsive>
            <Menu.Menu position="right">
              <Responsive as={Aux} {...Responsive.onlyMobile}>
                {!user && (
                  <Aux>
                    <Menu.Item as={NavLink} to="/login">
                      Log in
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/signup">
                      Sign up
                    </Menu.Item>
                  </Aux>
                )}
                {user && (
                  <Dropdown
                    item
                    icon={<Icon name="user outline" size="large" />}
                  >
                    <Dropdown.Menu>
                      <Dropdown.Header>{user.name}</Dropdown.Header>
                      <Dropdown.Item as={NavLink} to={'/profile/' + user.id}>
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/settings">
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => {}}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Responsive>
              <Responsive as={Aux} minWidth={Responsive.onlyTablet.minWidth}>
                {!user && (
                  <Aux>
                    <Menu.Item as={NavLink} to="/login">
                      Log in
                    </Menu.Item>
                    <Menu.Item as={NavLink} to="/signup">
                      Sign up
                    </Menu.Item>
                  </Aux>
                )}
                {user && (
                  <Dropdown item text={user.name}>
                    <Dropdown.Menu>
                      <Dropdown.Item as={NavLink} to={'/profile/' + user.id}>
                        Profile
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/settings">
                        Settings
                      </Dropdown.Item>
                      <Dropdown.Item onClick={() => {}}>Log out</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                )}
              </Responsive>
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    );
  }
}

Header.propTypes = {
  user: PropTypes.object
};

export default Header;
