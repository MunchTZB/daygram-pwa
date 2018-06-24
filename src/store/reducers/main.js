import { fromJS } from 'immutable';
import types from '../types/main';
import { generateMonthArray } from '../../utils/date';

const TODAY = new Date();

const initialState = fromJS({
  choosenMonth: TODAY.getMonth(),
  choosenYear: TODAY.getFullYear(),
  bottomBarStatus: 'default',
  list: generateMonthArray(TODAY.getFullYear(), TODAY.getMonth())
});

export default function reducer(state = initialState, action) {
  const { payload, type } = action;

  switch (type) {
    case types.CHANGE_BOTTOM_BAR: 
    case types.CHANGE_MONTH:
    case types.CHANGE_YEAR:
      return state.merge(fromJS(payload));
    default:
      return initialState;
  }
}
