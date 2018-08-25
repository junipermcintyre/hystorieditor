import React from 'react';
import HystoriData from './hystoridata.json';
import HystoriSpec from './hystorispec.json';
import ReactDOM from 'react-dom';
import './index.css';
import HystoriEditor from './HystoriEditor.jsx';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<HystoriEditor data={HystoriData} spec={HystoriSpec}/>, document.getElementById('root'));
registerServiceWorker();
