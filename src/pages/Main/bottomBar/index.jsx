import React, { Component } from 'react';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import classNames from 'classnames';
import Touchable from '../../../components/touchable';
import Hideable from '../../../components/hideable';
import { monthArray } from '../../../utils/date';
import actions from '../../../store/actions/main';
import './index.scss';

@autobind
class BottomBar extends Component {
  constructor(props) {
    super(props);

    this.today = new Date();
    this.yearArray = [];
    for (let year = 2010; year <= this.today.getFullYear(); year++) {
      this.yearArray.push(year);
    }
  }

  chooseMonth(index) {
    this.props.chooseMonth(index);
  }

  chooseYear(year) {
    this.props.chooseYear(year);
  }

  render() {
    return (
      <div className="bottom-bar">
        <Hideable
          extraClass="g-flexbox options"
          timeout={600}
          show={this.props.status === 'default'}>
          <span className="options__block" />
          <Touchable
            touchClass="g-touchable-opacity"
            onTap={
              () => {
                console.log(123);
                this.props.setBottomBarStatus('monthSelector');
              }
            }>
            <div className="g-text-center options__month">
              {
                monthArray[this.props.choosenMonth].toUpperCase()
              }
            </div>
          </Touchable>
          <span className="options__split" />
          <Touchable
            touchClass="g-touchable-opacity"
            onTap={
              () => {
                this.props.setBottomBarStatus('yearSelector');
              }
            }>
            <div className="g-text-center options__year">
              {
                this.props.choosenYear
              }
            </div>
          </Touchable>
          <span className="options__split" />
        </Hideable>
        <Hideable
          extraClass="month-selector"        
          timeout={600}
          show={this.props.status === 'monthSelector'}>
          {
            monthArray.map((item, index) => {
              const disabled = this.today.getFullYear() === this.props.choosenYear && index > this.today.getMonth();
              return (
                <Touchable
                  onTap={() => this.chooseMonth(index)}
                  key={item}
                  disabled={disabled}>
                  <div className={classNames({
                    'g-text-center month-selector__item': true,
                    on: index === this.props.choosenMonth,
                    disabled
                  })}>
                    {item.substr(0, 3).toUpperCase()}
                  </div>
                </Touchable>);
            })
          }
        </Hideable>
        <Hideable
          extraClass="g-flexbox g-align-center year-selector"
          timeout={600}
          show={this.props.status === 'yearSelector'}>
          {
            this.yearArray.map(item => (
              <Touchable
                onTap={() => this.chooseYear(item)}
                key={item}>
                <div className={classNames({
                  'g-text-center year-selector__item': true,
                  on: item === this.props.choosenYear
                })}>
                  {item}
                </div>
              </Touchable>
            ))
          }
        </Hideable>
      </div>
    );
  }
}

export default connect(state => ({
  status: state.main.get('bottomBarStatus'),
  choosenMonth: state.main.get('choosenMonth'),
  choosenYear: state.main.get('choosenYear')
}), actions)(BottomBar);
