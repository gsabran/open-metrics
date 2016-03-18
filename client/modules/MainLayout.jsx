/*
 * The layout that wraps the entire application
 */

import React, {PropTypes, Component} from 'react';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Header from './Header.jsx';
import {ReactMeteorData} from 'meteor/react-meteor-data';
import reactMixin from 'react-mixin';

injectTapEventPlugin(); // like FastClick

export default class MainLayout extends Component {
  render() {
    return [
      <Header />,
      <div id="content-container" className={this.data.headerStyle}>
        {content()}
      </div>,
      <Footer />,
    ];
  }
}

/*
 * PropTypes allows you to specify what prop names (and their respective types)
 * should be passed into this component.
 * See https://facebook.github.io/react/docs/reusable-components.html#prop-validation
 */
MainLayout.propTypes = {
  content: PropTypes.func.isRequired
};



