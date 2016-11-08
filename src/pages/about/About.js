import React from 'react';
import { observer } from 'mobx-react';
import Link from 'comps/Link';
import injectStore from 'infra/injectStore';
import Layout from '../../layout/Layout';
import { TopicList } from '../../models/Topic';
import './scss/about.scss';

/* eslint-disable react/prop-types*/
@injectStore({
  storeMap: {
    topicList: TopicList,
  },
  fetchInitData(options) {
    const stores = options.stores;
    return stores.topicList.getLatest();
  },
  pageName: 'page_about',
}) @observer
class Home extends React.Component {

  render() {
    return (
      <Layout>
        <div className="page-about">
          <div><Link to="/">home</Link></div>
          { this.props.topicList.latest.map(item => <li key={item.id}>{item.title}</li>) }
        </div>
      </Layout>
    );
  }
}

export default Home;