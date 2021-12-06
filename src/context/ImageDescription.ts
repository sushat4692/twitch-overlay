import React from 'react';

export type ImageDescriptionContextType = {
    label: string[];
    message: string[];
    images: string[];
    description: string;
};

export const ImageDescriptionContext =
    React.createContext<ImageDescriptionContextType>({
        label: [],
        message: [],
        images: [],
        description: '',
    });
