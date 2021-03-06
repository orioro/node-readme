import { someModule } from 'some-module'

/**
 * Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
 * nisi ut aliquip ex ea commodo consequat.
 *
 * @todo #3 Some issue
 * 
 * @typedef {Object} CustomType
 * @property {String} name
 * @property {Boolean} bool
 */

/**
 * Lorem ipsum dolor sit amet, consectetur adipiscing elit,
 * sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
 *
 * Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris
 * nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
 * reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
 * pariatur.
 * 
 * ```js
 * const result = func1('some string', 10)
 * // false
 * ```
 *
 * Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
 *
 * @function func1
 * @param {string} [strParam=''] Sed ut perspiciatis, unde omnis iste natus error
 *                          sit voluptatem accusantium doloremque laudantium.
 * @param {number} [numParam=0] Nemo enim ipsam voluptatem, quia voluptas
 *                          sit, aspernatur aut odit aut fugit.
 * @returns {boolean} result Nam libero tempore, cum soluta nobis est
 *                           eligendi optio.
 */
const func1 = (
  strParam,
  numParam
) => strParam.length <= numParam

/**
 * Aliquam at metus molestie, luctus arcu id, ornare ligula.
 * View `func1`
 *
 * @function func2
 * @param {Object} param1
 * @param {CustomType} param1.opt1 Some option
 * @param {string} param1.opt2 Some other option
 * @param {CustomType} param2
 * @returns {CustomType | null} result
 */
const func2 = (
  param1,
  param2
) => {
  return param2
}
