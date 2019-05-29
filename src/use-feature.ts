import { useState, useEffect } from 'react';
import { FeatureMatrix, Subscription } from 'featurematrix';

const fm = new FeatureMatrix({
    appKey: '571c1156-4bab-4208-9ba1-993dff0fe4c1',
    envKey: '8b076a1e-ee89-4f74-8e86-e6054ac7f2a4',
});

const setupUpdateSubscription = (featureKey: string, setFeatureState: (isOn: boolean) => void) => {
    return fm.on('update', feature => {
        if (feature.key === featureKey) {
            setFeatureState(feature.isOn);
        }
    });
};

export const useFeature = (featureKey: string) => {
    const [featureState, setFeatureState] = useState(false);
    
    useEffect(() => {
        let onReadySubscription: Subscription, onUpdateSubscription: Subscription;
        
        if (fm.initialized) {
            const isOn = fm.getFeatureState(featureKey);
            setFeatureState(isOn);
            onUpdateSubscription = setupUpdateSubscription(featureKey, setFeatureState);
        } else {
            onReadySubscription = fm.on('ready', () => {
                const isOn = fm.getFeatureState(featureKey);
                setFeatureState(isOn);
                onUpdateSubscription = setupUpdateSubscription(featureKey, setFeatureState);
            });
        }
        
        return () => {
            onReadySubscription && onReadySubscription.unsubscribe();
            onReadySubscription && onUpdateSubscription.unsubscribe();
        };
    }, [featureKey]);
    
    return featureState;
};