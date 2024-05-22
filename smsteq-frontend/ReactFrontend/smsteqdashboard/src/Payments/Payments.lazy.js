import React, { lazy, Suspense } from 'react';

const LazyProfile = lazy(() => import('./payments'));

const Payments = props => (
  <Suspense fallback={null}>
    <LazyProfile {...props} />
  </Suspense>
);

export default Payments;