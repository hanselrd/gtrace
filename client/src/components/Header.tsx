import * as React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Container, Dropdown, Icon, Menu, Responsive } from 'semantic-ui-react';
import Void from '@app/utils/Void';
import { authActions } from '@app/ducks/auth';
import { localeActions } from '@app/ducks/locale';
import locale from '@app/core/locale';

const logo = require('@app/images/logo.png');

export interface HeaderProps {
  user?: {
    id: string;
    name: string;
  };
  authLogout: typeof authActions.logout;
  localeChange: typeof localeActions.change;
}

class Header extends React.Component<HeaderProps> {
  onLanguageClick = () => {
    const { localeChange } = this.props;
    switch (locale.getLanguage()) {
      case 'en':
        localeChange('es');
        break;
      case 'es':
        localeChange('en');
        break;
    }
  };

  render() {
    const { user, authLogout } = this.props;
    return (
      <div>
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
            <Responsive as={Void} maxWidth={Responsive.onlyTablet.maxWidth}>
              <Dropdown item icon={<Icon name="sidebar" size="large" />}>
                <Dropdown.Menu>
                  <Dropdown.Header>{locale.language}</Dropdown.Header>
                  <Dropdown.Item onClick={this.onLanguageClick}>
                    {locale.getLanguage().toUpperCase()}
                  </Dropdown.Item>
                  {user && (
                    <Void>
                      <Dropdown.Header>{locale.navigation}</Dropdown.Header>
                      <Dropdown.Item as={NavLink} to="/home">
                        {locale.home}
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/chat">
                        {locale.chat}
                      </Dropdown.Item>
                      <Dropdown.Item as={NavLink} to="/games">
                        {locale.games}
                      </Dropdown.Item>
                    </Void>
                  )}
                </Dropdown.Menu>
              </Dropdown>
            </Responsive>
            <Responsive as={Void} minWidth={Responsive.onlyComputer.minWidth}>
              <Menu.Item onClick={this.onLanguageClick}>
                {locale.getLanguage().toUpperCase()}
              </Menu.Item>
            </Responsive>
            <Menu.Item as={Link} to="/" header>
              <img src={logo} alt="logo" width={55} />
              <span>
                <h2>Trace</h2>
              </span>
            </Menu.Item>
            {user && (
              <Responsive as={Void} minWidth={Responsive.onlyComputer.minWidth}>
                <Menu.Item as={NavLink} to="/home">
                  {locale.home}
                </Menu.Item>
                <Menu.Item as={NavLink} to="/chat">
                  {locale.chat}
                </Menu.Item>
                <Menu.Item as={NavLink} to="/games">
                  {locale.games}
                </Menu.Item>
              </Responsive>
            )}
            <Menu.Menu position="right">
              {!user && (
                <Void>
                  <Menu.Item as={NavLink} to="/login">
                    {locale.login}
                  </Menu.Item>
                  <Menu.Item as={NavLink} to="/signup">
                    {locale.signup}
                  </Menu.Item>
                </Void>
              )}
              {user && (
                <Void>
                  <Responsive as={Void} {...Responsive.onlyMobile}>
                    <Dropdown
                      item
                      icon={<Icon name="user outline" size="large" />}
                    >
                      <Dropdown.Menu>
                        <Dropdown.Header>{user.name}</Dropdown.Header>
                        <Dropdown.Item as={NavLink} to={'/profile/' + user.id}>
                          {locale.profile}
                        </Dropdown.Item>
                        <Dropdown.Item as={NavLink} to="/settings">
                          {locale.settings}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => authLogout()}>
                          {locale.logout}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Responsive>
                  <Responsive
                    as={Void}
                    minWidth={Responsive.onlyTablet.minWidth}
                  >
                    <Dropdown item text={user.name}>
                      <Dropdown.Menu>
                        <Dropdown.Item as={NavLink} to={'/profile/' + user.id}>
                          {locale.profile}
                        </Dropdown.Item>
                        <Dropdown.Item as={NavLink} to="/settings">
                          {locale.settings}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => authLogout()}>
                          {locale.logout}
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </Responsive>
                </Void>
              )}
            </Menu.Menu>
          </Container>
        </Menu>
      </div>
    );
  }
}

export default Header;
