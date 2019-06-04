import { useState } from 'react';
import { FeatureMatrix } from 'featurematrix-js';
import { createUseFeature } from './use-feature';
import { createWithFeatures } from './with-feature';

export const featureClient = new FeatureMatrix();

export const useFeature = useState ? createUseFeature(featureClient) : () => {
    console.warn('Your version of react doesn\'t support hooks.');
};
export const withFeatures = createWithFeatures(featureClient);