import _ from 'lodash';
export default class UserPolicy {
  constructor(user, record) {
    this.user = user;
    this.record = record;
  }

  canEdit() {
    return _.isEqual(this.user, this.record);
  }

  canUpdate() {
    return _.isEqual(this.user, this.record);
  }
}
