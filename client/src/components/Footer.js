import React, { Component } from 'react';

class Footer extends Component {
  render() {
    const date = new Date();
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
