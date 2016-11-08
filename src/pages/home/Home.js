import React from 'react';
import { observer } from 'mobx-react';
import Link from 'comps/Link';
import injectStore from 'infra/injectStore';
import { TopicList } from '../../models/Topic';
import Layout from '../../layout/Layout';

require('./scss/home.scss');

/* eslint-disable react/prop-types*/

@injectStore({
  storeMap: {
    topicList: TopicList,
  },
  fetchInitData(options) {
    const stores = options.stores;
    return stores.topicList.getHot();
  },
  pageName: 'page_home',
}) @observer
class Home extends React.Component {

  render() {
    return (
      <Layout>
        <div className="page-home">
          <div><Link to="about">about</Link></div>
          { this.props.location && this.props.location.query && this.props.location.query.q}
          { this.props.topicList.hot.map(item => <li key={item.id}>{item.title}</li>) }
        </div>
      </Layout>
    );
  }
}

export default Home;