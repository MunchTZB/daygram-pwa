/*
 * @Author: zhenbang.tang 
 * @Date: 2018-02-05 21:14:35 
 * @Last Modified by: zhenbang.tang
 * @Last Modified time: 2018-03-07 12:35:04
 * 模仿借鉴qunar开源项目yo3的touchable组件，添加了onLongTap长按功能
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import gesture from './gesture';

export default class Touchable extends Component {
  static propTypes = {
    /**
     * @property touchClass
     * @type String
     * @default null
     * @description 触摸Touchable时附加的className，可以用来实现Native常见的触摸反馈功能(例如给触摸区域添加深色背景或者改变透明度等等)。
     */
    touchClass: PropTypes.string,
    /**
     * @property onTap
     * @type Function
     * @default null
     * @param {DOMElement} target tap事件的target
     * @description 给Touchable绑定的onTap事件。
     */
    onTap: PropTypes.func,
    /**
     * @property onLongTap
     * @type Function
     * @default null
     * @param {DOMElement} target tap事件的target
     * @description 给Touchable绑定的onLongTap事件。
     */
    onLongTap: PropTypes.func,
    /**
     * @property disabled
     * @type Bool
     * @default false
     * @description Touchable是否处于可点击状态，如果设为true，那么onTap事件回调和触摸反馈效果都不可用。
     * @version 3.0.7
     */
    disabled: PropTypes.bool,
    /**
     * @skip 给List定制的属性
     */
    onTouchStart: PropTypes.func,
    children: PropTypes.object,
  };

  static defaultProps = {
    onTouchStart: () => {
    },
    touchClass: null,
    onTap: () => {
    },
    onLongTap: undefined,
    disabled: false,
  };

  static contextTypes = {
    scroller: PropTypes.object,
    hideable: PropTypes.object
  };

  render() {
    const onlyChild = React.Children.only(this.props.children);
    const gestureObj = gesture({
      component: this,
      scroller: this.context.scroller,
      hideable: this.context.hideable,
      activeClass: this.props.touchClass,
      onTap: this.props.onTap,
      onLongTap: this.props.onLongTap,
      onTouchStart: this.props.onTouchStart,
      disabled: this.props.disabled,
    });
    const {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
    } = gestureObj;

    return React.cloneElement(onlyChild, {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onTouchCancel,
    });
  }
}
