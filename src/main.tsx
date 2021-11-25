import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import { prepareMeowSound } from './util/useMeowSound';
import { prepareBuildSound } from './util/useBuildSound';
import { prepareCarSound } from './util/useCarSound';

Promise.all([prepareMeowSound(), prepareBuildSound(), prepareCarSound()]).then(
    () => {
        ReactDOM.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>,
            document.getElementById('root')
        );
    }
);
