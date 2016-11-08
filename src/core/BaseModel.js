import set from 'lodash/set';
import assign from 'lodash/assign';
import merge from 'lodash/merge';
import omit from 'lodash/omit';
import { action } from 'mobx';

class BaseModel {

  @action
  $set(fieldPath, value) {
    set(this, fieldPath, value);
  }

  @action
  $assign(data, excludeFields) {
    assign(this, omit(data, excludeFields || []));
  }

  @action
  $merge(data) {
    merge(this, data);
  }

  $bindActions(actions) {
    for (const key in actions) {
      if (process.env.NODE_ENV !== 'production') {
        if (key in this) {
          console.warn(`model has field: '${key}' already. old field will be override`);
        }
      }
      const value = actions[key];
      this[key] = value.bind(this);
    }
  }

}

export default BaseModel;