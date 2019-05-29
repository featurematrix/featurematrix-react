import { useState, useEffect } from 'react';
import { FeatureMatrix, Subscription } from 'featurematrix';

const setupUpdateSubscription = (featureClient: FeatureMatrix, featureKey: string, setFeatureState: (isOn: boolean) => void) => {
    return featureClient.on('update', feature => {
        if (feature.key === featureKey) {
            setFeatureState(feature.isOn);
        }
    });
};

const getFeatureAndSubscribe = (featureClient: FeatureMatrix, featureKey: string, setFeatureState: (isOn: boolean) => void) => {
    const isOn = featureClient.getFeatureState(featureKey);
    setFeatureState(isOn);
    return setupUpdateSubscription(featureClient, featureKey, setFeatureState);
}

export const createUseFeature = (featureClient: FeatureMatrix) => (featureKey: string) => {
    const [featureState, setFeatureState] = useState(false);

    useEffect(() => {
        let onReadySubscription: Subscription, onUpdateSubscription: Subscription;

        if (featureClient.initialized) {
            onUpdateSubscription = getFeatureAndSubscribe(featureClient, featureKey, setFeatureState);
        } else {
            onReadySubscription = featureClient.on('ready', () => {
                onUpdateSubscription = getFeatureAndSubscribe(featureClient, featureKey, setFeatureState);
            });
        }

        return () => {
            onReadySubscription && onReadySubscription.unsubscribe();
            onReadySubscription && onUpdateSubscription.unsubscribe();
        };
    }, [featureKey]);

    return featureState;
};