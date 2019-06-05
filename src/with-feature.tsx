import React, { ComponentType, Component } from 'react';
import { FeatureMatrix, Subscription } from 'featurematrix-js';
import { createSubscription } from './subscription';

export interface FeatureProps {
    getFeatureState: (key: string) => boolean;
}

export const createWithFeatures = (featureClient: FeatureMatrix) => <T extends object>(featureKeys: string[], WrappedComponent: ComponentType<T>) => {
    return class WithFeature extends Component<T & FeatureProps> {
        onReadySubscription: Subscription;
        onUpdateSubscription: Subscription;
        featureKeys: string[];
        mounted: boolean;

        constructor(props) {
            super(props);

            this.featureKeys = featureKeys;
            this.getFeatureState = this.getFeatureState.bind(this);
        }

        componentWillMount() {
            const setupSubscription = createSubscription(this.featureKeys, featureClient, () => this.mounted, () => this.forceUpdate());

            if (featureClient.initialized) {
                this.onUpdateSubscription = setupSubscription();
            } else {
                this.onReadySubscription = featureClient.on('ready', () => {
                    this.onUpdateSubscription = setupSubscription();
                });
            }
        }

        componentDidMount() {
            this.mounted = true;
        }

        componentWillUnmount() {
            this.onReadySubscription && this.onReadySubscription.unsubscribe();
            this.onUpdateSubscription && this.onUpdateSubscription.unsubscribe();
            this.mounted = false;
        }

        getFeatureState(key: string) {
            try {
                return featureClient.getFeatureState(key);
            } catch (err) {
                console.error(err);
                return null;
            }
        }

        render() {
            return <WrappedComponent {...this.props} getFeatureState={this.getFeatureState} updateKey={Date.now()} />;
        }
    }
};