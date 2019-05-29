import React, { ReactNode, ComponentType } from 'react';

export interface FeatureProps {
    getFeatureState: (key: string) => boolean;
}

const getFeatureState = (key: string) => {
    return 'foo';
};

export const withFeature = <T extends object>(Component: ComponentType<T>) => (props: T & FeatureProps): ReactNode => {
    return (
        <>
            <Component {...props} getFeatureState={getFeatureState} />
        </>
    );
};