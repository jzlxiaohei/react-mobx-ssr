import React, { PropTypes } from 'react';
import '../common';

class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  componentDidMount() {
    document.getElementById('global-loading-cover').style.display = 'none';
  }

  componentWillUnmount() {
    document.getElementById('global-loading-cover').style.display = 'initial';
  }

  render() {
    return React.cloneElement(this.props.children);
  }
}

export default Layout;