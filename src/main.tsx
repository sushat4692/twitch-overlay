import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import axios from 'axios';

import {
    ImageDescriptionContext,
    ImageDescriptionContextType,
} from './context/ImageDescription';
import {
    DefaultSlider,
    DefaultLabel,
    DefaultMessage,
} from './const/WireImages';

import { prepare as prepareMeowSound } from './util/useMeowSound';
import { prepare as prepareBuildSound } from './util/useBuildSound';
import { prepare as prepareCarSound } from './util/useCarSound';
import { prepare as prepareDinoSound } from './util/useDinoSound';
import { prepare as prepareAvatarSound } from './util/useAvatarSound';
import { prepare as prepareAlertSound } from './util/useAlertSound';

Promise.all([
    (async () => {
        const result = await axios
            .get(`/image.json?t=${Date.now().toString()}`)
            .catch((e) => {
                console.error(e);
            });

        if (!result) {
            return {
                label: DefaultLabel,
                message: DefaultMessage,
                images: DefaultSlider,
                description: '',
            };
        }

        const {
            label,
            message,
            images,
            description,
        }: ImageDescriptionContextType = result.data;
        if (
            !label ||
            !Array.isArray(label) ||
            !message ||
            !Array.isArray(message) ||
            !images ||
            !Array.isArray(images) ||
            images.length <= 0
        ) {
            return {
                label: DefaultLabel,
                message: DefaultMessage,
                images: DefaultSlider,
                description: description ?? '',
            };
        }

        return {
            label,
            message,
            images,
            description: description ?? '',
        };
    })(),
    prepareMeowSound(),
    prepareBuildSound(),
    prepareCarSound(),
    prepareDinoSound(),
    prepareAvatarSound(),
    prepareAlertSound(),
]).then(([image]) => {
    ReactDOM.render(
        <React.StrictMode>
            <ImageDescriptionContext.Provider value={image}>
                <App />
            </ImageDescriptionContext.Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );
});
