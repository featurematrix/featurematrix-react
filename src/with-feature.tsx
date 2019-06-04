import React, { ComponentType, Component } from 'react';
import { FeatureMatrix, Subscription } from 'featurematrix-js';

export interface FeatureProps {
    getFeatureState: (key: string) => boolean;
}

export const createWithFeatures = (featureClient: FeatureMatrix) => <T extends object>(featureKeys: string[], WrappedComponent: ComponentType<T>) => {
    return class WithFeature extends Component<T & FeatureProps> {
        onReadySubscription: Subscription;
        onUpdateSubscription: Subscription;

        constructor(props) {
            super(props);

            this.state = featureKeys.reduce((acc, curr) => {
                acc[curr] = null;
                return acc;
            }, {});

            this.getFeatureState = this.getFeatureState.bind(this);
        }

        setupUpdateSubscription() {
            return featureClient.on('update', feature => {
                if (feature.key in this.state) {
                    this.setState({
                        [feature.key]: feature.isOn
                    });
                }
            });
        };

        componentWillMount() {
            if (featureClient.initialized) {
                this.getFeaturesAndSubscribe();
            } else {
                this.onReadySubscription = featureClient.on('ready', () => {
                    this.getFeaturesAndSubscribe();
                });
            }
        }

        getFeaturesAndSubscribe() {
            this.onUpdateSubscription = this.setupUpdateSubscription();

            const featureStates = featureKeys
                .map<[string, boolean]>(key => ([
                    key,
                    featureClient.getFeatureState(key)
                ]))
                .reduce((acc, curr) => {
                    const [key, state] = curr;
                    acc[key] = state;
                    return acc;
                }, {});

            this.setState(featureStates);
        }

        componentWillUnmount() {
            this.onReadySubscription && this.onReadySubscription.unsubscribe();
            this.onReadySubscription && this.onUpdateSubscription.unsubscribe();
        }

        getFeatureState(key: string) {
            return this.state[key];
        }

        render() {
            return <WrappedComponent {...this.props} getFeatureState={this.getFeatureState} />;
        }
    }
};