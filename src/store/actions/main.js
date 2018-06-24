import types from '../types/main';
import { generateMonthArray } from '../../utils/date';

const actions = {
  setBottomBarStatus(type) {
    return (dispatch) => {
      dispatch({
        type: types.CHANGE_BOTTOM_BAR,
        payload: {
          bottomBarStatus: type
        }
      });
    };
  },
  chooseMonth(month) {
    return ((dispatch, getState) => {
      const state = getState(),
        payload = {
          choosenMonth: month,
          bottomBarStatus: 'default'
        };

      if (month !== state.main.get('choosenMonth')) {
        payload.list = generateMonthArray(state.main.get('choosenYear'), month);
      }

      dispatch({
        type: types.CHANGE_MONTH,
        payload
      });
    });
  },
  chooseYear(year) {
    return ((dispatch, getState) => {
      const state = getState(),
        payload = {
          choosenYear: year,
          bottomBarStatus: 'default'
        };

      if (year !== state.main.get('choosenYear')) {
        payload.list = generateMonthArray(year, state.main.get('choosenMonth'));
      };
  
      dispatch({
        type: types.CHANGE_YEAR,
        payload
      });
    });
  }
};

export default actions;
