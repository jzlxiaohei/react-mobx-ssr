/* eslint-disable  no-new-func */
const isNode = new Function('try {return this===global;}catch(e){return false;}');

export default isNode();