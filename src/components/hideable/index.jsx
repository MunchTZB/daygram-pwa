import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import classNames from 'classnames';

class Hideable extends Component {
  static propTypes = {
    timeout: PropTypes.number,
    extraClass: PropTypes.string,
    show: PropTypes.bool
  }

  static defaultProps = {
    timeout: 1000,
    extraClass: '',
    show: true
  }

  constructor(props) {
    super(props);
    
    this.status = '';
  }

  static childContextTypes = {
    hideable: PropTypes.object
  }
  
  getChildContext() {
    return {
      hideable: this
    };
  }

  render() {
    return (
      <CSSTransition
        in={this.props.show}
        classNames="fade"
        timeout={this.props.timeout}>
        {
          (status) => {
            this.status = status;
            return (
              <div
                style={{
                  transitionDuration: `${this.props.timeout / 1000}s`
                }}
                className={classNames({
                  [this.props.extraClass]: true,
                  'fade-enter': status === 'entering',
                  'g-hide': status === 'exited'
                })}>
                {this.props.children}
              </div>
            );
          }
        }
      </CSSTransition>
    );
  }
}

export default Hideable;
