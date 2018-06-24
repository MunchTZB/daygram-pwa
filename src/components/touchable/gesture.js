/**
 * touchable手势处理,解决Scroller内部的手势冲突
 * 在滚动时不会触发active
 * 在active之后发生滚动会取消active状态
 */
import ReactDOM from 'react-dom';

const TAP_SLOP = 5;
export const TAP_DELAY = 50;
export const LONG_TAP_DELAY = 500;
/**
 * @param endPoint
 * @param startPoint
 * @returns {number}
 * 根据个点的坐标计算出位移
 */
function getDistance(endPoint, startPoint) {
  return Math.sqrt(Math.pow(endPoint.pageX - startPoint.pageX, 2) + Math.pow(endPoint.pageY - startPoint.pageY, 2));
}

/**
 * @param endPoint
 * @param startPoint
 * @returns {boolean}
 * 根据两个点的位移判断是否应该取消Tap事件的触发
 */
function onTouchMoveShouldCancelTap(endPoint, startPoint) {
  return getDistance(endPoint, startPoint) > TAP_SLOP;
}

/**
 * @param evt
 * @returns {touch/null}
 * 获取触点
 */
function getTouchPoint(evt) {
  return evt.touches.length ? { pageX: evt.touches[0].pageX, pageY: evt.touches[0].pageY } : null;
}

/**
 * @param domNode
 * @param activeClass
 * 移除item的activeClass
 */
function removeActiveClass(domNode, activeClass) {
  if (domNode && activeClass) {
    domNode.className = domNode.className.replace(` ${activeClass}`, '');
  }
}

/**
 * @param scroller
 * @returns {boolean}
 * 判断组件是否在滚动
 */
function isScrolling(scroller) {
  return scroller ? scroller.isScrolling : false;
}

/**
 * 判断组件是不是正在Hideable的动画中
 * @param hideable 
 * @returns {boolean}
 */
function isInHideableAni(hideable) {
  return hideable && hideable.status !== 'entered';
}

// touchStart的位置,是否需要放弃Tap触发,Tap周期(start,move,end)是否已经结束
let startPoint;
let shouldAbortTap;
let shouldAbortLongTap;
let longTapHandler;
let hasTriggerLongTap;
let captured = null;

export default function ({
  component,
  scroller,
  hideable,
  activeClass,
  onTap,
  onLongTap,
  onTouchStart,
  disabled,
}) {
  const gestureObj = {
    onTouchStart(evt) {
      const domNode = ReactDOM.findDOMNode(component);
      removeActiveClass(domNode, activeClass);
      // 如果组件正在滚动,直接放弃Tap和LongTap触发
      shouldAbortTap = isScrolling(scroller) || isInHideableAni(hideable);
      shouldAbortLongTap = isScrolling(scroller) || isInHideableAni(hideable);
      hasTriggerLongTap = false;
      startPoint = getTouchPoint(evt);
      onTouchStart(evt);

      if (!captured) {
        captured = domNode;
      }
      // TAP_DELAY之后再次判断是否要触发Tap,如果这段时间内出现了大的位移,if后面的逻辑就不会执行
      setTimeout(() => {
        const className = activeClass;
        if (!shouldAbortTap && className && captured === domNode && !disabled) {
          domNode.className += ` ${className}`;
        }
      }, TAP_DELAY);

      // 在LONG_TAP_DELAY之后判断是否要触发LongTap，如果在这段时间内出现了大的位移或者松开了手指，则不会触发；
      longTapHandler = setTimeout(() => {
        if (onLongTap && !shouldAbortLongTap) {
          onLongTap();
          hasTriggerLongTap = true;
        }
      }, LONG_TAP_DELAY);
    },
    onTouchMove(evt) {
      const domNode = ReactDOM.findDOMNode(component);
      const currentPoint = getTouchPoint(evt);
      // 根据touchmove的距离判断是否要放弃tap和longTap
      if (onTouchMoveShouldCancelTap(currentPoint, startPoint)) {
        shouldAbortTap = true;
        shouldAbortLongTap = true;
        captured = null;
        removeActiveClass(domNode, activeClass);
      }
    },
    onTouchEnd(evt) {
      // 当TouchEnd的时候直接赋值shouldAbortLongTap为true
      // 因为如果没触发则说明用户点按时间过短，不需要触发LongTap,
      // 如果触发过了那么赋值为shouldAbortLongTap为true也没有影响。
      shouldAbortLongTap = true;
      
      // 清楚longTap的计时器，如果用户多次连续点击Tap，没有清空计时器会有问题
      if (longTapHandler) {
        clearTimeout(longTapHandler);
        longTapHandler = null;
      }
      const { target } = evt;
      const domNode = ReactDOM.findDOMNode(component);
      // 如果需要触发tap,在TAP_DELAY之后触发onTap回调
      if (!shouldAbortTap && captured === domNode) {
        setTimeout(() => {
          // 没有触发LongTap的话，再触发onTap。
          if (!disabled && !hasTriggerLongTap) {
            onTap(target);
          }
          removeActiveClass(domNode, activeClass);
          captured = null;
        }, TAP_DELAY + 10);
      } else if (shouldAbortTap) {
        captured = null;
      }
    },
    onTouchCancel() {
      const domNode = ReactDOM.findDOMNode(component);
      removeActiveClass(domNode, activeClass);
    },
  };

  return gestureObj;
}
