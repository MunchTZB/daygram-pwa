import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import { autobind } from 'core-decorators';
import Touchable from '../../components/touchable';
import { monthArray, weekDayArray } from '../../utils/date';
import { isIos } from '../../utils/useragent';
import './index.scss';

@autobind
class Edit extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      isFocus: false,
      keyboardHeight: 0
    };

    if (!this.props.location.state) {
      this.props.history.go(-1);
    }
  }
  

  onTextareaFocus() {
    const magicNum = 30;
    setTimeout(() => {
      if (isIos && document.body.scrollTop) {
        const keyboardHeight = document.body.scrollTop * 2 + magicNum;
        this.setState({
          isFocus: true,
          keyboardHeight
        });
        document.body.scrollTop = 0;
      } else {
        this.setState({
          isFocus: true,
        });
      }
    }, 300);
  }

  onTextareaBlur() {
    this.setState({
      isFocus: false
    });
  }

  render() {
    return (
      <div className="g-fullscreen edit">
        <div className="g-flexbox edit__content">
          <Touchable
            onTap={() => {
              this.props.history.go(-1);
            }}>
            <div className="g-text-center g-main-font edit__title">
              <span className={classNames({
                edit__weekday: true,
                sunday: this.props.location.state.weekDay === 0
              })}>
                {weekDayArray[this.props.location.state.weekDay].toUpperCase()}
              </span>
              <span className="edit__date-split">/</span>
              {`${monthArray[this.props.location.state.month].toUpperCase()} `}
              {this.props.location.state.day}
              <span className="edit__date-split">/</span>
              {this.props.location.state.year}
              <br />
              <span className="edit__split" />
            </div>
          </Touchable>
          <div className="g-flex edit__edit-wrapper">
            <textarea
              onFocus={this.onTextareaFocus}
              onBlur={this.onTextareaBlur}
              className="edit__textarea" />
          </div>
          {
            !this.state.isFocus ?
              <div
                className="edit__options"
                style={{ bottom: this.state.keyboardHeight }}>
                <i className="g-ico">
                  &#xe65f;
                </i>
              </div> : null
          }
        </div>
      </div>
    );
  }
}

export default withRouter(Edit);
