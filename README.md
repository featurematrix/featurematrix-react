# FeatureMatrix React
FeatureMatrix SDK for React.  
Get feature states using `withFeatures` Higher Order Component and `useFeature` hook.  
If features are toggled on/off, components using those features will be rerendered in realtime. No need to refresh the page!  
Built on [FeautureMatrix JS](https://github.com/featurematrix/featurematrix-js).

## Installation

```bash
npm i featurematrix-react
```

## Getting started
Signup if you don't have an account yet at https://app.featurematrix.io/signup  
Get familiar with concepts at https://docs.featurematrix.io

## Usage
Start by initializing the `featureClient` with `appKey` and `envKey` which can be found at
https://test.featurematrix.io/apps and
https://test.featurematrix.io/environments

```js
import { featureClient } from 'featurematrix-react';

featureClient.init({
    appKey: 'ef445c2b-d4b4-43bc-b79a-7956baeef34a',
    envKey: '4306148c-3707-4b2d-99aa-4390f09b4f5a'
});
```

### `useFeature` hook
`useFeature(featureKey: string) => boolean`  

`useFeature` accepts a feature key as a single argument and returns the state of the feature as a boolean. If the `featureClient` is not initialized yet or the key is invalid it will return `null` and will complain in the console.

```jsx
import { useFeature } from 'featurematrix-react';

export const HomePage => () => {
    const feedbackIsEnabled = useFeature('feedback');

    return (
        <div className="home">
            {feedbackIsEnabled &&
                <Feedback />
            }
        </div>
    );
};

```

If the feature will be toggled in app dashboard, `HomePage` component will be rerendered.

### `withFeatures` Higher Order Component
`withFeatures<T>(featureKeys: string[], ComponentToWrap: React.ComponentType<T>) => React.ComponentType<T & FeatureProps>`  

`withFeatures` accepts the list of feature keys as the first argument and the component to be wrapped as the second argument. Returns a new component which has a `getFeatureState` prop.

`getFeatureState: (key: string) => boolean`

 If the `featureClient` is not initialized yet or the key is invalid `getFeatureState` will return `null` and will complain in the console.

```jsx
import { withFeatures } from 'featurematrix-react';

class HomePage extends Component {
    render() {
        const feedbackIsEnabled = props.getFeatureState('feedback');

        return (
            <div className="home">
                {feedbackIsEnabled &&
                    <Feedback />
                }
            </div>
        );
    }
}

export default withFeatures(['feedback'], HomePage);
// or with react-redux connect
export default connect(mapStateToProps, mapDispatchToProps)(withFeatures(['feedback'], HomePage));
``` 

If the feature will be toggled in app dashboard, `HomePage` component will be rerendered.