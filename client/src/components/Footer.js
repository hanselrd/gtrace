import React, { Component } from 'react';

class Footer extends Component {
  state = {
    date: new Date()
  };

  render() {
    const { date } = this.state;
    return (
      <div className="Footer">
        <p>
          &copy; Copyright {date.getFullYear()} <strong>Trace</strong>
        </p>
      </div>
    );
  }
}

export default Footer;
