import React, { lazy, Suspense } from 'react';

const LazySenderIds = lazy(() => import('./SenderIds'));

const SenderIds = props => (
  <Suspense fallback={null}>
    <LazySenderIds {...props} />
  </Suspense>
);

export default SenderIds;
