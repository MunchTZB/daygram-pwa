import React from 'react';
import classNames from 'classnames';
import Touchable from '../../../components/touchable';

const Item = props => 
  (
    <div className={classNames({
      list__item: true
    })}>
      {
        props.data.get('content') ? 
          <div>
            {props.data.get('content')}
          </div> :
          props.isLast ? null :
          <div className="list__empty">
            <Touchable
              touchClass="g-touchable-opacity"
              onTap={() => {
                props.onTap(props.data.toJS());
              }}>
              <div className={classNames({
                list__dot: true,
                sunday: !props.data.get('weekDay')
              })} />
            </Touchable>
          </div>
      }
    </div>
  );

export default Item;
