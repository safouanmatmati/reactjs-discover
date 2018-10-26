// @flow strict
import RatingFactory, {type Rating} from './RatingFactory.js';

/**
 * Ratings type defintion
 * @type {Object}
 */
export type RatingsType = {[identifier: string]: Rating}

/**
 * RatingManager class.
 * @type {RatingManager}
 */
export default class RatingManager {
  /**
   * Rating list
   * @type {RatingsType}
   */
  ratings: RatingsType;

  /**
   * Last identifier.
   * @type {number}
   */
  last_identifier: number;

  /**
   * Constructor.
   *
   * @param {RatingsType|undefined} ratings 
   */
  constructor(ratings?: RatingsType) {
    this.fill(ratings || {});

    this.last_identifier = Number(Object.keys(this.ratings).reverse().slice(1,0));

    this.getAll = this.getAll.bind(this);
    this.get    = this.get.bind(this);
    this.post   = this.post.bind(this);
    this.delete = this.delete.bind(this);
    this.put    = this.put.bind(this);
    this.patch  = this.patch.bind(this);
  };

  /**
   * Fill rating list.
   * @param {RatingsType} ratings
   */
  fill = (ratings: RatingsType): void => {
    this.ratings = ratings;
    this.last_identifier = Number(Object.keys(this.ratings).reverse().slice(0,1));
  }

  /**
   * Return rating list.
   *
   * @return {RatingsType}
   */
  getAll = (): RatingsType => {
    return this.ratings;
  }

  /**
   * Return rating or rating list depending on "identifier" param.
   * @param {string} identifier
   * @return {Rating}
   */
  get = (identifier?: string): {data?: Rating|RatingsType, success: bool, message?: string} => {
    if (typeof identifier === 'string') {
      if (this.ratings[identifier]) {
        return {data: this.ratings[identifier], success: true};
      }
    } else {
      return {data: this.getAll(), success: true};
    }

    return {success: false, message: 'rating not found'};
  }

  /**
   * Insert new rating.
   *
   * @param {Object} data
   * @return {Object}
   */
  post = (data: {}): {success: bool, identifier?: string, message?: string} => {
    var validation = RatingFactory.validate(data);

    if (false === validation.success) {
      return {success: false, message: 'Failed to validate comment'};
    }

    const rating = RatingFactory.create(data)

    let identifier:string = (++this.last_identifier)+'';
    this.ratings[identifier] = rating;
    return {success: true, identifier: identifier};
  }

  /**
   * Delete a rating.
   *
   * @param {string} identifier
   * @return {Object}
   */
  delete = (identifier: string): {success: bool, message?: string} => {
    if (this.ratings[identifier] !== undefined) {
      delete this.ratings[identifier];
      return {success: true};
    }

    return {success: false, message: 'rating not found'};
  }

  /**
   * Put a rating.
   *
   * @param {string} identifier
   * @param {Rating} data
   * @return {Object}
   */
  put = (identifier: number, data: Rating): {success: bool, message: string} => {
    return {success: false, message: 'put not implmented yet.'};
  }

  /**
   * Patch a rating.
   *
   * @param {string} identifier
   * @param {{...Rating}} data
   * @return {Object}
   */
  patch = (identifier: string, data: {...Rating}): {rating?: Rating, success: bool, message?: string} => {
    if (this.ratings[identifier] !== undefined) {
      this.ratings[identifier] = {...this.ratings[identifier], ...data};
      return {success: true, rating: this.ratings[identifier]};
    }

    return {success: false, message: 'rating not found'};
  }
}
