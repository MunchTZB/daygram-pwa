/*
 * @Author: zhenbang.tang 
 * @Date: 2018-03-06 10:42:34 
 * @Last Modified by: zhenbang.tang
 * @Last Modified time: 2018-03-06 16:30:55
 * 虚拟组件Scroller 借鉴yo3的scroller组件
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import utils from './utils';

const resetProps = Symbol('resetProps'),
  handleTouchStart = Symbol('handleTouchStart'),
  handleTouchMove = Symbol('handleTouchMove'),
  handleTouchEnd = Symbol('handleTouchEnd'),
  handleTransitionEnd = Symbol('handleTransitionEnd'),
  resetPosition = Symbol('resetPosition'),
  transitionTimingFunction = Symbol('transitionTimingFunction'),
  transitionTime = Symbol('transitionTime'),
  setStyle = Symbol('setStyle'),
  translate = Symbol('translate'),
  animate = Symbol('animate'),
  getComputedPosition = Symbol('getComputedPosition'),
  execEvent = Symbol('execEvent');

const { rAF, cancelrAF } = utils.getRAF();

class Scroller extends Component {
  static propTypes = {
    /**
     * 组件额外class
     *
     * @property extraClass
     * @type String
     * @description 为组件根节点提供额外的class。
     * @default ''
     */
    extraClass: PropTypes.string,
    /**
     * 内容容器额外class
     *
     * @property containerExtraClass
     * @type String
     * @description 为组件中的内容容器提供额外的class。
     * @default ''
     */
    containerExtraClass: PropTypes.string,
    /**
     * 内容容器额外style
     *
     * @property containerExtraStyle
     * @type String
     * @description 为组件中的内容容器提供额外的style，主要用于横向滚动时，动态设置容器的宽度。
     * @default {}
     * @version 3.0.6
     */
    containerExtraStyle: PropTypes.object,
    /**
     * 内容位移
     *
     * @property contentOffset
     * @type {x: Number, y: Mumber}
     * @description 组件中内容的初始位移，这个属性变化时，会重置内容的位移。
     * @default {x: 0, y: 0}
     */
    contentOffset: PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number
    }),
    /**
     * 内容底部留白
     *
     * @property contentInset
     * @type Number
     * @description 内容区域周围的留白，**目前仅支持 bottom**。主要用于适配 iPhoneX，在下方留出一定间隙。有『加载更多』时，显示在『加载更多』的下方。可以通过设置背景色来改变留白的颜色。
     * @default {bottom:0}
     * @version 3.0.13
     */
    contentInset: PropTypes.shape({
      bottom: PropTypes.number
    }),
    /**
     * 是否禁止滚动
     *
     * @property disabled
     * @type Bool
     * @description 是否禁止滚动，默认允许滚动。
     * @default false
     */
    disabled: PropTypes.bool,
    /**
     * 横向滚动
     *
     * @property scrollX
     * @type Bool
     * @description 是否开启横向滚动，默认关闭。
     * @default false
     */
    scrollX: PropTypes.bool,
    /**
     * 纵向滚动
     *
     * @property scrollY
     * @type Bool
     * @description 是否开启纵向滚动,默认开启。
     * @default true
     */
    scrollY: PropTypes.bool,
    /**
     * 自由滚动
     *
     * @property freeScroll
     * @type Bool
     * @description 是否开启自由滚动。当设置为 `false` 时，只能响应某一个方向的滚动；当设置为 `true` 时，可以同时响应横向和纵向滚动（`scrollX` 和 `scrollY` 必须同时为 `true`）。
     * @default false
     * @skip
     */
    freeScroll: PropTypes.bool,
    /**
     * 方向锁定阈值
     *
     * @property directionLockThreshold
     * @type Number
     * @description 只允许单向滚动的时候，会根据这个阀值来判定响应哪个方向上的位移：某一方向位移减去另一个方向位移超过阀值，就会判定为这个方向的滚动。
     *
     * 一个常见的示例是：在一个纵向滚动的 Scroller 中嵌套一个横向滚动的 Scroller。此时，如果斜着（约45°）滚动，则内层的 Scroller 会先响应，
     * 但是不会锁定，触摸事件会向冒泡到外层的 Scroller，导致外层的 Scroller 也会响应。此时将 directionLockThreshold 设置成 0，保证不管向哪个方向滚动，
     * Scroller 都会锁定方向而不向外冒泡，就不会出现同时响应的问题了。
     * @default 5
     */
    directionLockThreshold: PropTypes.number,
    /**
     * 惯性滚动
     *
     * @property momentum
     * @type Bool
     * @description 是否允许惯性滚动。当设置为 `true`，手指离开时，如果还有速度会继续滚动一段距离；当设置为 `false` ，手指离开时会立即停止滚动。
     * @default true
     */
    momentum: PropTypes.bool,
    /**
     * 弹性滚动
     *
     * @property bounce
     * @type Bool
     * @description 当滚动超出内容范围时，是否可以继续滚动一截。
     * @default true
     */
    bounce: PropTypes.bool,
    /**
     * 弹性滚动回弹时间
     *
     * @property bounceTime
     * @type Number
     * @description 当弹性滚动一截之后，回到滚动范围内位置的时间，单位为毫秒（ms）。
     * @default 600
     */
    bounceTime: PropTypes.number,
    /**
     * 弹性滚动回弹动画
     *
     * @property bounceEasing
     * @type Object
     * @description 弹性回滚动画。
     *
     * Scroller 提供了五种默认的动画函数：`quadratic`, `circular`, `back`, `bounce`, `elastic`，可以通过 `Scroller.ease.xxx` 来使用。
     *
     * 用户也可以自定义动画对象，比如：
     *
     * ``
     * {
     *     style: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
     *     fn: function (k) {
     *         return k * ( 2 - k );
     *     }
     * }
     * ``
     * @default Scroller.ease.circular
     */
    bounceEasing: PropTypes.object,
    /**
     * transition开关
     *
     * @property useTransition
     * @type Bool
     * @description 如果设置为true,会使用transition来实现滚动效果;如果设置为false,会使用requestAnimationFrame来实现。
     * @default true
     */
    useTransition: PropTypes.bool,
    /**
     * transform开关
     *
     * @property useTransform
     * @type Bool
     * @description 如果设置为true,会使用transform来实现位移;如果设置为false,会使用left和top来实现位移（position: absolute）。
     * @default true
     */
    useTransform: PropTypes.bool,
    /**
     * 自动刷新高度
     *
     * @property autoRefresh
     * @type Bool
     * @description 默认为true,在componentDidUpdate的时候会自动刷新高度;如果设置为false,则在内容发生变化时，需要用户主动调用refresh方法来刷新高度。
     * @default true
     * @skip
     */
    autoRefresh: PropTypes.bool,
    /**
     * 硬件加速
     *
     * @property HWCompositing
     * @type Bool
     * @description 是否开启硬件加速
     * @default true
     */
    HWCompositing: PropTypes.bool,
    eventPassthrough: PropTypes.bool,
    /**
     * @property preventDefault
     * @type Bool
     * @description 是否需要在Scroller容器上对所有的触摸事件（touchstart/touchmove/touchend/touchcancel）调用preventDefault。
     * 这个属性的默认值为true，这是为了避免一些安卓的兼容性问题。如果你发现一些默认效果没有被触发（例如输入框的blur），可以尝试设置这个属性为false。
     */
    preventDefault: PropTypes.bool,
    preventDefaultException: PropTypes.object,
    stopPropagation: PropTypes.bool,
    /**
     * 加载更多事件回调
     *
     * @property onLoad
     * @type Function
     * @param {e} event 结构为: ({contentOffset: {x: x, y: y}})
     * @description (event) => void
     *
     * 加载更多时开始加载的回调。
     */
    onLoad: PropTypes.func,
    wrapper: PropTypes.object,
    /**
     * @property scrollWithoutTouchStart
     * @type Bool
     * @default true (从 3.0.17 开始，默认值从 false 改为 true)
     * @description ** 实验中的属性 **
     * 在默认情况下一次用户触发（非调用scrollTo方法）scroller的滚动需要由touchstart事件来启动，在某些情况下，例如scroller从disable状态切换到enable状态时，
     * 可能不能接收到这一瞬间的touchstart事件，这可能导致用户期待的滚动过程没有发生。
     * 开启这个属性为 true 以后将允许 scroller 用 touchmove 启动滚动过程，这可以解决上述场景的问题。
     * @version 3.0.2
     */
    scrollWithoutTouchStart: PropTypes.bool
  }

  static defaultProps = {
    extraClass: '',
    containerExtraClass: '',
    containerExtraStyle: {},
    contentOffset: {
      x: 0,
      y: 0
    },
    contentInset: {
      bottom: 0
    },
    disabled: false,
    scrollX: false,
    scrollY: true,
    freeScroll: false,
    directionLockThreshold: 5, // 锁定某一滚动方向的阀值
    momentum: true, // 惯性滚动
    bounce: true, // 弹性滚动
    bounceTime: 600, // 弹性滚动时间
    bounceEasing: utils.ease.circular, // 弹性滚动easing函数
    preventDefault: true, // 阻止默认事件
    preventDefaultException: { tagName: /^(INPUT|TEXTAREA|BUTTON|SELECT)$/ }, // 阻止默认事件的例外
    stopPropagation: false, // 阻止冒泡
    HWCompositing: true, // 是否开启硬件加速
    useTransition: true,
    useTransform: true,
    onLoad: null,
    autoRefresh: true,
    wrapper: null,
    scrollWithoutTouchStart: true,
  }

  constructor(props) {
    super(props);

    this.x = 0;
    this.y = 0;
    this.directionX = 0;
    this.directionY = 0;
    this._scrollerStyle = {};

    this._resetProps(props);
    
    this.wrapperOffsetTop = null;
  }

  componentDidMount() {
    this.wrapper = this.noWrapper ? this.wrapper : this.wrapperDom;
    this.scroller = this.scrollerDom;

    // 重置 position 属性
    if (!this.useTransform) {
      if (!(/relative|absolute/i).test(this._scrollerStyle)) {
        this._scrollerStyle.position = 'relative';
      }
    }

    this.refresh();

    // 内容区域高度小于容器高度时，不需要再重新定位loadMore的位置，refresh内部已经定位正确
    // this._refreshLoadMore();

    this[resetPosition]();
    this.scrollTo(this.props.contentOffset.x, this.props.contentOffset.y);

    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;

    // // 修复子元素存在 input 输入框时，浏览器强制让 input 显示在可见区域，收缩键盘后无法向上滑倒顶部的 bug
    // this._resetScrollTop = () => {
    //   const {
    //     wrapperDom
    //   } = this;
    //   if (wrapperDom && wrapperDom.scrollTop > 0) {
    //     setTimeout(() => {
    //       wrapperDom.scrollTop = 0;
    //     }, 100); // 防止有输入框获得焦点时收缩键盘时强制输入框展示在现实区域而出现的闪烁问题
    //   }
    // };

    // this._resize = () => {
    //   const {
    //     innerWidth: lastWidth,
    //     innerHeight: lastHeigth
    //   } = this;
    //   const {
    //     innerWidth: width,
    //     innerHeight: height
    //   } = window;

    //   this.innerWidth = width;
    //   this.innerHeight = height;
    //   // 判断是否为键盘收起
    //   if (width === lastWidth && height > lastHeigth) {
    //     this._resetScrollTop();
    //   }
    //   this.forceUpdate();
    // };

    // window.addEventListener('orientationchange', this._resize, false);
    // window.addEventListener('resize', throttle(this._resize, 100), false);
    // window.addEventListener('focusout', this._resetScrollTop, false); // Safari 在键盘的展开和收起时不会触发 resize， 故使用 focusout。
  }

  componentWillReceiveProps(nextProps) {
    this._resetProps(nextProps);
  }

  componentDidUpdate(prevProps, prevState) {
    // 重置 contentOffset
    if (prevProps.contentOffset.x !== this.props.contentOffset.x || prevProps.contentOffset.y !== this.props.contentOffset.y) {
      this.scrollTo(this.props.contentOffset.x, this.props.contentOffset.y);
    }

    // 重置 position 属性
    if (!this.useTransform) {
      if (!(/relative|absolute/i).test(this._scrollerStyle)) {
        this._scrollerStyle.position = 'relative';
        if (this.scroller) this._setStyle(this.scroller, this._scrollerStyle);
      }
    }

    // 重新获取容器和内容尺寸
    if (this.props.autoRefresh) {
      this.refresh();
    }
  }

  _resetProps(props) {
    // 判断硬件加速
    this.translateZ = props.HWCompositing && utils.hasPerspective ? ' translateZ(0)' : '';
    // 重置 useTransition 和 useTransform
    this.useTransition = utils.hasTransition && props.useTransition;
    this.useTransform = utils.hasTransform && props.useTransform;

    // 重置 scrollX 和 scrollY
    this.eventPassthrough = props.eventPassthrough === true ? 'vertical' : props.eventPassthrough;
    this.preventDefault = !this.eventPassthrough && props.preventDefault;
    this.scrollY = this.eventPassthrough === 'vertical' ? false : props.scrollY;
    this.scrollX = this.eventPassthrough === 'horizontal' ? false : props.scrollX;
    this.verticalBounce = this.scrollY ? props.bounce : false;
    this.horizontalBounce = this.scrollX ? props.bounce : false;

    // 如果disable状态发生了变化，需要重置initiated
    if (this.disabled !== props.disabled) {
      this.initiated = 0;
    }
    // 重置 disabled
    this.disabled = props.disabled;
    this.freeScroll = props.freeScroll && !this.eventPassthrough;
    this.directionLockThreshold = this.eventPassthrough ? 0 : props.directionLockThreshold;

    console.log(props);
  }

  [handleTouchStart](e) {
    if (this.disabled || (this.initiated && utils.eventType[e.type] !== this.initiated)) {
      return;
    }

    if (this.preventDefault && !utils.isBadAndroid && !utils.preventDefaultException(e.target, this.props.preventDefaultException)) {
      e.preventDefault();
    }
    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    const point = e.touches ? e.touches[0] : e;

    this.initiated = utils.eventType[e.type];
    this.moved = false;
    this.distX = 0;
    this.distY = 0;
    this.directionX = 0;
    this.directionY = 0;
    this.directionLocked = 0;

    this.startTime = utils.getTime();

    this.stopAnimate();

    this.startX = this.x;
    this.startY = this.y;
    this.absStartX = this.x;
    this.absStartY = this.y;
    this.pointX = point.pageX;
    this.pointY = point.pageY;
  }

  [handleTouchMove](e) {
    if (this.disabled) {
      return;
    }

    if (utils.eventType[e.type] !== this.initiated) {
      if (this.props.scrollWithoutTouchStart) {
        this[handleTouchStart](e);
      } else {
        return;
      }
    }

    if (this.preventDefault) { // increases performance on Android? TODO: check!
      e.preventDefault();
    }

    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    const point = e.touches ? e.touches[0] : e;
    const timestamp = utils.getTime();
    let deltaX = point.pageX - this.pointX;
    let deltaY = point.pageY - this.pointY;
    let newX;
    let newY;

    this.pointX = point.pageX;
    this.pointY = point.pageY;

    this.distX += deltaX;
    this.distY += deltaY;

    const absDistX = Math.abs(this.distX);
    const absDistY = Math.abs(this.distY);

    // We need to move at least 10 pixels for the scrolling to initiate
    if (timestamp - this.endTime > 300 && (absDistX < 10 && absDistY < 10)) {
      return;
    }

    // If you are scrolling in one direction lock the other
    if (!this.directionLocked && !this.freeScroll) {
      if (absDistX > absDistY + this.directionLockThreshold) {
        this.directionLocked = 'h'; // lock horizontally
      } else if (absDistY >= absDistX + this.directionLockThreshold) {
        this.directionLocked = 'v'; // lock vertically
      } else {
        this.directionLocked = 'n'; // no lock
      }
    }

    if (this.directionLocked === 'h') {
      if (this.eventPassthrough === 'vertical') {
        e.preventDefault();
      } else if (this.eventPassthrough === 'horizontal') {
        this.initiated = false;
        return;
      }

      deltaY = 0;
    } else if (this.directionLocked === 'v') {
      if (this.eventPassthrough === 'horizontal') {
        e.preventDefault();
      } else if (this.eventPassthrough === 'vertical') {
        this.initiated = false;
        return;
      }

      deltaX = 0;
    }

    newX = this.x + deltaX;
    newY = this.y + deltaY;

    // Slow down if outside of the boundaries
    if (newX > 0) {
      newX = this.horizontalBounce ? this.x + deltaX / 3 : 0;
    } else if (newX < this.maxScrollX) {
      newX = this.horizontalBounce ? this.x + deltaX / 3 : this.maxScrollX;
    }

    if (newY > 0) {
      newY = this.verticalBounce ? this.y + deltaY / 3 : 0;
    } else if (newY < this.maxScrollY) {
      newY = this.verticalBounce ? this.y + deltaY / 3 : this.maxScrollY;
    }

    if (deltaX > 0) {
      this.directionX = -1;
    } else if (deltaX < 0) {
      this.directionX = 1;
    } else {
      this.directionX = 0;
    }

    if (deltaY > 0) {
      this.directionY = -1;
    } else if (deltaY < 0) {
      this.directionY = 1;
    } else {
      this.directionY = 0;
    }

    if (!this.moved) {
      this[execEvent]('onScrollStart');
    }

    this.moved = true;

    this[translate](newX, newY);

    if (timestamp - this.startTime > 300) {
      this.startTime = timestamp;
      this.startX = this.x;
      this.startY = this.y;
    }

    this[execEvent]('onScroll');
  }

  [handleTouchEnd](e) {
    if (this.disabled || utils.eventType[e.type] !== this.initiated) {
      return;
    }

    if (this.preventDefault && !utils.preventDefaultException(e.target, this.props.preventDefaultException)) {
      e.preventDefault();
    }

    if (this.props.stopPropagation) {
      e.stopPropagation();
    }

    let momentumX;
    let momentumY;
    const duration = utils.getTime() - this.startTime;
    let newX = Math.round(this.x);
    let newY = Math.round(this.y);
    let time = 0;

    this.isInTransition = 0;
    this.initiated = 0;
    this.endTime = utils.getTime();

    // reset if we are outside of the boundaries
    if (this[resetPosition](this.props.bounceTime)) {
      return;
    }

    this.scrollTo(newX, newY); // ensures that the last position is rounded

    if (!this.moved) {
      this[execEvent]('onScrollCancel');
      return;
    }

    // start momentum animation if needed
    if (this.props.momentum && duration < 300) {
      momentumX = this.hasHorizontalScroll ? utils.momentum(this.x, this.startX, duration, this.maxScrollX, this.horizontalBounce ? this.wrapperWidth : 0, this.props.deceleration) :
        {
          destination: newX,
          duration: 0
        };
      momentumY = this.hasVerticalScroll ? utils.momentum(this.y, this.startY, duration, this.maxScrollY, this.verticalBounce ? this.wrapperHeight : 0, this.props.deceleration) :
        {
          destination: newY,
          duration: 0
        };
      newX = momentumX.destination;
      newY = momentumY.destination;
      time = Math.max(momentumX.duration, momentumY.duration);
      this.isInTransition = 1;
    }

    if (newX !== this.x || newY !== this.y) {
      let easing;

      // change easing function when scroller goes out of the boundaries
      if (newX > 0 || newX < this.maxScrollX || newY > 0 || newY < this.maxScrollY) {
        easing = utils.ease.quadratic;
      }

      this.scrollTo(newX, newY, time, easing);
      this[execEvent]('onMomentumScrollBegin', {
        targetX: newX,
        targetY: newY
      });
      return;
    }

    this[execEvent]('onScrollEnd');
  }

  [handleTransitionEnd](e) {
    if (e.target !== this.scroller || !this.isInTransition) {
      return;
    }

    this[transitionTime]();
    if (!this[resetPosition](this.props.bounceTime)) {
      this.isInTransition = false;
      this[execEvent]('onScrollEnd');
    }
  }

  /**
   * @method stopAnimate
   * @description 停止当前的滚动动画，包括：惯性滚动、回弹、ScrollTo等。
   */
  stopAnimate() {
    if (this.useTransition && this.isInTransition) {
      this[transitionTime]();
      this.isInTransition = false;

      const pos = this[getComputedPosition]();

      this[translate](Math.round(pos.x), Math.round(pos.y));
      this[execEvent]('onScrollEnd');
    } else if (!this.useTransition && this.isAnimating) {
      this[execEvent]('onScrollEnd');
      cancelrAF(this.rAF);

      this.isAnimating = false;
    }
  }

  /**
   * @method _getComputedPosition
   * @returns {Object} 当前内容区域位移，{x: x, y: y}
   * @description 获取当前内容区域的位移
   * @skip
   */
  [getComputedPosition]() {
    let matrix = window.getComputedStyle(this.scroller, null);
    let x;
    let y;

    if (this.useTransform) {
      matrix = matrix[utils.style.transform].split(')')[0].split(', ');
      x = +(matrix[12] || matrix[4]);
      y = +(matrix[13] || matrix[5]);
    } else {
      x = +matrix.left.replace(/[^-\d.]/g, '');
      y = +matrix.top.replace(/[^-\d.]/g, '');
    }

    return {
      x,
      y
    };
  }

  /**
   * @method _execEvent
   * @param {string} eventType 事件类型
   * @param {Object} param 参数
   * @description 触发事件回调
   * @skip
   */
  [execEvent](eventType, param) {
    // console.log(eventType)
    if (eventType === 'onScrollStart') {
      this.isScrolling = true;
    }
    if (eventType === 'onScrollEnd') {
      this.isScrolling = false;
    }
    if (this.props[eventType]) {
      this.props[eventType].apply(this, [{
        contentOffset: {
          x: this.x,
          y: this.y
        },
        param
      }]);
    }
  }

  /**
   * @method refresh
   * @param {Object} [refreshOption] 刷新参数，{wrapperWidth, wrapperHeight, scrollerWidth, scrollerHeight}
   * @description 刷新 Scroller，一般场景**不推荐使用**，因为当内容改变的时候，Scroller 会自动 render。
   *
   * 使用场景1：需要强制设置 Scroller 本身的宽高和内容容器的宽高时，可以通过refreshOption来传入宽高代替dom的宽高。
   *
   * 使用场景2：在某些不是通过 setState 或 Redux 等方式来改变内容导致 Scroller 不会 render 时，可以强制重新获取Scroller宽高和内容容器宽高。
   */
  refresh(refreshOption = {}, callFromList) {
    if (!callFromList) {
      this.wrapperWidth = typeof refreshOption.wrapperWidth !== 'undefined' ? refreshOption.wrapperWidth : this.wrapper.clientWidth;
      this.wrapperHeight = typeof refreshOption.wrapperHeight !== 'undefined' ? refreshOption.wrapperHeight : this.wrapper.clientHeight;
      this.scrollerWidth = typeof refreshOption.scrollerWidth !== 'undefined' ? refreshOption.scrollerWidth : this.scroller.offsetWidth;

      if (this.wrapperDom) {
        this.wrapperOffsetTop = utils.getElementOffsetY(this.wrapperDom, null);
      }
    }

    this.scrollerHeight = typeof refreshOption.scrollerHeight !== 'undefined' ? refreshOption.scrollerHeight : this.scroller.offsetHeight;
    console.log(this.scrollerHeight);

    this.maxScrollX = this.wrapperWidth - this.scrollerWidth;
    this.maxScrollY = this.wrapperHeight - this.scrollerHeight - this.props.contentInset.bottom;

    this.hasHorizontalScroll = this.props.scrollX && this.maxScrollX < 0;
    this.hasVerticalScroll = this.props.scrollY && this.maxScrollY < 0;

    if (!this.hasHorizontalScroll) {
      this.maxScrollX = 0;
      this.scrollerWidth = this.wrapperWidth;
    }

    if (!this.hasVerticalScroll) {
      this.maxScrollY = 0;
      this.scrollerHeight = this.wrapperHeight;
    }

    this.endTime = 0;
    this.directionX = 0;
    this.directionY = 0;
  }

  [resetPosition](time) {
    let x = this.x;
    let y = this.y;
    const animateTime = time || 0;

    if (!this.hasHorizontalScroll || this.x > 0) {
      x = 0;
    } else if (this.x < this.maxScrollX) {
      x = this.maxScrollX;
    }

    if (!this.hasVerticalScroll || this.y > 0) {
      y = 0;
    } else if (this.y < this.maxScrollY) {
      y = this.maxScrollY;
    }

    if (x === this.x && y === this.y) {
      return false;
    }

    this.scrollTo(x, y, animateTime, this.props.bounceEasing);

    return true;
  }

  /**
   * @method scrollTo
   * @param {Number} x 水平位移，默认值为当前水平位移
   * @param {Number} y 垂直位移，默认值为当前垂直位移
   * @param {Number} time 滚动时间，默认值为0
   * @param {Object} [easing] 滚动动画对象。参照 `bounceEasing` 参数。
   *
   * @description 滚动到某个位置。
   */
  scrollTo(x = this.x, y = this.y, time, easing) { // TODO: 给scrollTo加上回调，由于transitionend事件并不能针对某一次的transition，所以暂时不好处理
    const _easing = easing || utils.ease.circular;
    const transitionType = this.useTransition && _easing.style;

    this.isInTransition = this.useTransition && time > 0;

    if (!time || transitionType) {
      if (transitionType) {
        this[transitionTimingFunction](_easing.style);
        this[transitionTime](time);
      }
      this[translate](x, y);
    } else {
      this[animate](x, y, time, _easing.fn);
    }
  }

  [transitionTimingFunction](easing) {
    this._scrollerStyle[utils.style.transitionTimingFunction] = easing;
  }

  [transitionTime](time) {
    const _time = time || 0;
    const durationProp = utils.style.transitionDuration;
    if (!this.useTransition) {
      return;
    }

    if (!durationProp) {
      return;
    }
    this._scrollerStyle[durationProp] = `${_time}ms`;

    if (!_time && utils.isBadAndroid) {
      this._scrollerStyle[durationProp] = '0.0001ms';

      // remove 0.0001ms
      rAF(() => {
        if (this._scrollerStyle[durationProp] === '0.0001ms') {
          this._scrollerStyle[durationProp] = '0s';
        }
      });
    }

    this[setStyle](this.scroller, this._scrollerStyle);
  }

  [setStyle](dom, style) {
    const _style = Object.assign({}, style);
    const _dom = dom;

    Object.keys(_style).forEach((key) => {
      _dom.style[key] = _style[key];
    });
  }

  [translate](x, y) {
    if (this.useTransform) {
      this._scrollerStyle[utils.style.transform] = `translate(${x}px,${y}px)${this.translateZ}`;

      this.x = x;
      this.y = y;

      this[setStyle](this.scroller, this._scrollerStyle);
    } else {
      const _x = Math.round(x);
      const _y = Math.round(y);

      this._scrollerStyle.left = `${_x}px`;
      this._scrollerStyle.top = `${_y}px`;

      this.x = _x;
      this.y = _y;

      this[setStyle](this.scroller, this._scrollerStyle);
    }
  }

  [animate](destX, destY, duration, easingFn) {
    const self = this;
    const startX = this.x;
    const startY = this.y;
    const startTime = utils.getTime();
    const destTime = startTime + duration;

    const step = () => {
      const now = utils.getTime();
      const easing = easingFn((now - startTime) / duration);
      const newX = (destX - startX) * easing + startX;
      const newY = (destY - startY) * easing + startY;

      if (now >= destTime) {
        self.isAnimating = false;
        self[translate](destX, destY);

        if (!self[resetPosition](self.props.bounceTime)) {
          self[execEvent]('onScrollEnd');
        }

        return;
      }

      self[translate](newX, newY);

      this[execEvent]('onScroll');

      if (self.isAnimating) {
        cancelrAF(self.rAF);
        self.rAF = rAF(step);
      }
    };

    this.isAnimating = true;
    step();
  }


  render() {
    let content = React.cloneElement(this.props.children, {
      ref: dom => {
        this.scrollerDom = dom;
      }
    });

    return (
      <div
        style={{
          width: '100%',
          height: '100%'
        }}
        ref={dom => {
          if (dom) {
            this.wrapperDom = dom;
          }
        }}
        onTouchStart={evt => this[handleTouchStart](evt)}
        onTouchMove={evt => this[handleTouchMove](evt)}
        onTouchEnd={evt => this[handleTouchEnd](evt)}
        onTouchCancel={evt => this[handleTouchEnd](evt)}
        onTransitionEnd={evt => this[handleTransitionEnd](evt)} >
        {content}
      </div>
    );
  }
}

export default Scroller;
