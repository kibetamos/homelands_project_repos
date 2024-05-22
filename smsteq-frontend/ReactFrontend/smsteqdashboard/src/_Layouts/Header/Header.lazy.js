import React, { lazy, Suspense } from 'react';

const Header = lazy(() => import('./Layouts/header'));

const Header = props => (
  <Suspense fallback={null}>
    <LazyHeader {...props} />
  </Suspense>
);

export default Header;
