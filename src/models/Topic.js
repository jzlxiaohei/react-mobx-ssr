import { runInAction } from 'mobx';
import makeObs from 'core/makeObservable';
import BaseModel from 'core/BaseModel';
import ajax from '../utils/ajax';


class Topic extends BaseModel {
  constructor() {
    super();
    makeObs(this, {
      id: 0,
      title: '',
      url: '',
      content: '',
      content_rendered: '',
      replies: 0,
      created: 0,
      last_modified: 0,
      last_touched: 0,
      node: null,
      member: null,
    });
  }
}

class TopicList extends BaseModel {

  constructor() {
    super();
    makeObs(this, {
      hot: [],
      latest: [],
    });
  }

  getHot() {
    return ajax.get({
      url: '/topics/hot.json',
    }).then((res) => {
      runInAction('build hot', () => {
        this.hot = res.data;
      });
      return res;
    });
  }

  getLatest() {
    return ajax.get({
      url: '/topics/latest.json',
    }).then((res) => {
      this.$assign({ latest: res.data });
      return res;
    });
  }
}

export {
  Topic, TopicList,
};