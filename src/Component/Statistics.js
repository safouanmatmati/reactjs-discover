// @flow strict
import * as React from 'react';
import { Form, FormGroup, Label, Input } from 'reactstrap';

/**
 * Components.
 */
import {type RatingsType as Ratings} from './RatingManager.js';

/**
 * Statistics React component properties.
 *
 * @type {Object}
 */
type Props = {
  ratings: Ratings
};

/**
 * Statistics React component states.
 *
 * @type {Object}
 */
type State = {average: ?number, count: number};

/**
 * Statistics React component.
 * @type {Statistics}
 */
export default class Statistics extends React.Component <Props, State> {
  /**
   * Constructor
   * @param {Props} props 
   */
  constructor(props: Props) {
    super(props);

    this.update = this.update.bind(this);

    this.state = this.update(this.props.ratings);
  }

  /**
   * Calculate statistics.
   *
   * @param {Ratings} ratings
   * @return {State}
   */
  update = (ratings:Ratings):State  =>  {
    var average: ?number = null;
    let count: number = 0;

    if (0 < Object.keys(ratings).length) {
      let total: number = 0;

      for (let index in ratings) {
        let rating = ratings[index];

        if (true === rating.allowed) {
            count++;
            total += Number(rating.score);
        }
      }

      if (0 !== count) {
        average = total/count;
      }
    }

    return {
      average: average,
      count: count
    };
  }

  /**
   * Render component.
   *
   * @type {React.Node}
   */
  render = (): React.Node => {
    return (
      <Form className="row justify-content-around">
        <FormGroup className="col-6 col-sm-4">
          <Label htmlFor="nb_ratings">Total ratings </Label>
          <Input id="nb_ratings" type="text" disabled value={this.state.count} />
        </FormGroup>

        <FormGroup className="col-6 col-sm-4">
          <Label htmlFor="average">Average </Label>
          <Input
            id="average" type="text" disabled
            value={this.state.average === null ? 'Rating required' : this.state.average} />
        </FormGroup>
      </Form>
    );
  }
}
