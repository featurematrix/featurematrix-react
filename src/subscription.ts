import { FeatureMatrix, Subscription } from 'featurematrix-js';

export const createSubscription = (featureKeys: string[], featureClient: FeatureMatrix, checkMounted: () => boolean, update: (any?) => void) => (): Subscription => {
    return featureClient.on('update', feature => {
        if (!checkMounted()) return;
        if (~featureKeys.indexOf(feature.key)) {
            update();
        }
    });
};