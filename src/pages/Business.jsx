import React from 'react';
import { useLocation } from 'react-router-dom';
import FlowPage from './Business/flows'; 
import ComponentPage from './Business/components';
import Testcase from './Business/testcases';
import ObjectsPage from './Business/objects';
import ScenarioManager from './Business/scenario_manager';
import Cammands from './Business/cammand';
import Types from './Business/object_type';
import Modules from './Business/modules';

export default function Business() {
  const location = useLocation();  // Hook to get the current location
  const path = location.pathname.replace('/business', ''); // Remove /business from the path
  const SRC_URL = path;

  switch (SRC_URL) {
    case "/scenario":
      return <ScenarioManager />;
    case "/manager":
      return <FlowPage />;
    case "/components":
      return <ComponentPage />;
    case "/testcase":
      return <Testcase />;
    case "/objects":
      return <ObjectsPage />;
    case "/command":
      return <Cammands />;
    case "/types":
      return <Types />;
    case "/module":
      return <Modules />;
    default:
      return <div>Page not found</div>; // Default case to handle undefined paths
  }
}
