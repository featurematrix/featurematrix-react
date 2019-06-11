import { useState, useEffect, useRef, useCallback } from 'react';
import { FeatureMatrix, Subscription } from 'featurematrix-js';
import { createSubscription } from './subscription';

export const createUseFeature = (featureClient: FeatureMatrix) => (featureKey: string) => {
    const [,update] = useState();
    const mountedRef = useRef<boolean>();

    const checkMounted = useCallback(() => mountedRef.current, [mountedRef.current]);

    useEffect(() => {
        mountedRef.current = true;
        let onReadySubscription: Subscription, onUpdateSubscription: Subscription;
        const setupSubscription = createSubscription([featureKey], featureClient, checkMounted, () => update({}));

        if (featureClient.initialized) {
            onUpdateSubscription = setupSubscription();
        } else {
            onReadySubscription = featureClient.on('ready', () => {
                onUpdateSubscription = setupSubscription();
            });
        }

        return () => {
            onReadySubscription && onReadySubscription.unsubscribe();
            onReadySubscription && onUpdateSubscription.unsubscribe();
            mountedRef.current = false;
        };
    }, [featureKey]);

    return featureClient.getFeatureState(featureKey);
};