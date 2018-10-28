/*
 src/actions/simpleAction.js
*/
export const simpleAction = () => ({
  type: 'SIMPLE_ACTION',
  payload: 'result_of_simple_action',
});

export const changeSetting = (setting) => ({
   type: 'CHANGE_SETTING',
   setting: setting,
});