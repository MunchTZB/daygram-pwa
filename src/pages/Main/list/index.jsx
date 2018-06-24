import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { autobind } from 'core-decorators';
import Touchable from '../../../components/touchable';
import Scroller from '../../../components/scroller';
import actions from '../../../store/actions/main';
import Timer from './timer';
import Item from './item';
import './index.scss';

class List extends Component {
  @autobind
  goEdit(item) {
    this.props.history.push('/edit', item);
  }

  render() {
    return (
      <Touchable
        onTap={() => {
          this.props.setBottomBarStatus('default');
        }}>
        <div className="list">
          <Scroller>
            <div>
              <Timer />
              {
                this.props.list.map((item, index) => (
                  <Item
                    key={item.get('id')}
                    onTap={this.goEdit}
                    data={item}
                    isLast={this.props.list.size === index + 1} />
                ))
              }
              {/* <TransitionGroup>
                {
                  this.props.list.map((item, index) => (
                    <CSSTransition
                      key={item.get('id')}
                      classNames="fade"
                      timeout={1000}>
                      <Item
                        onTap={this.goEdit}
                        data={item}
                        isLast={this.props.list.size === index + 1} />
                    </CSSTransition>
                  ))
                }
              </TransitionGroup> */}
            </div>
          </Scroller>
        </div>
      </Touchable>
    );
  }
}

export default withRouter(connect(state => ({
  list: state.main.get('list')
}), actions)(List));
