import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { RecoilRoot } from 'recoil';
import * as PIXI from 'pixi.js';
PIXI.TextMetrics.BASELINE_SYMBOL = 'あ';

// Styles
import 'react-toastify/dist/ReactToastify.css';
import 'swiper/css';
import './index.css';

// Components
import { App } from './App';

// Context
import {
    ImageDescriptionContext,
    ImageDescriptionContextType,
} from '@/context';

// Const
import { DefaultSlider, DefaultLabel, DefaultMessage } from '@/const';

// Utils
import {
    prepareMeowSound,
    prepareBuildSound,
    prepareCarSound,
    prepareDinoSound,
    prepareAvatarSound,
    prepareAlertSound,
    prepareWeatherSound,
    prepareBattleSound,
} from '@/util';

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
    prepareWeatherSound(),
    prepareBattleSound(),
]).then(([image]) => {
    ReactDOM.render(
        <React.StrictMode>
            <RecoilRoot>
                <ImageDescriptionContext.Provider value={image}>
                    <App />
                </ImageDescriptionContext.Provider>
            </RecoilRoot>
        </React.StrictMode>,
        document.getElementById('root')
    );
});
