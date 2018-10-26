// @flow strict
import * as React from 'react';

/**
 * Home React component.
 *
 * @type {Home}
 * @extends React.Component
 */
export default class Home extends React.Component<{}> {

  /**
   * Render component.
   *
   * @type {React.Node}
   */
  render = (): React.Node => {
    return (
        <p className="text-center">Welcome on my first React JS application experience!</p>
    );
  }
}
