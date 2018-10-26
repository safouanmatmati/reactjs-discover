// @flow strict
import * as React from 'react';

/**
 * Error404 React component.
 *
 * @type {Error404}
 * @extends React.Component
 */
export default class Error404 extends React.Component <{}> {

  /**
   * Render component.
   *
   * @type {React.Node}
   */
  render = (): React.Node => {
    return (
        <p className="text-center">Page not found.</p>
    );
  }
}
