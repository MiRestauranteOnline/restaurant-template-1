import { useLayoutType } from '@/hooks/useLayoutType';
import Layout1 from './layouts/Layout1';
import Layout2 from './layouts/Layout2';
import Layout3 from './layouts/Layout3';
import Layout4 from './layouts/Layout4';

const LayoutRouter = () => {
  const layoutType = useLayoutType();
  
  switch (layoutType) {
    case 'layout2':
      return <Layout2 />;
    case 'layout3':
      return <Layout3 />;
    case 'layout4':
      return <Layout4 />;
    case 'layout1':
    default:
      return <Layout1 />;
  }
};

export default LayoutRouter;