import React from 'react';
import { VERSION, } from '@twilio/flex-ui';
import { FlexPlugin } from 'flex-plugin';
import Dashboard from './components/Dashboard';
import reducers, { namespace } from './states';

const PLUGIN_NAME = 'EbsFlexPlugin';

export default class EbsFlexPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof import('@twilio/flex-ui') }
   * @param manager { import('@twilio/flex-ui').Manager }
   */
  init(flex, manager) {

    this.registerReducers(manager);

      flex.CRMContainer.defaultProps.uriCallback = (task) => {
      flex.CRMContainer.Content.replace(
        <Dashboard
          key={"dashboard"}
          manager={manager}
          task={task}
        />
      );
    };
    flex.AgentDesktopView.defaultProps.splitterOptions = {
      minimumSecondPanelSize: "70%",
    };
   
  }

  /**
   * Registers the plugin reducers
   *
   * @param manager { Flex.Manager }
   */
  registerReducers(manager) {
    if (!manager.store.addReducer) {
      // eslint: disable-next-line
      console.error(`You need FlexUI > 1.9.0 to use built-in redux; you are currently on ${VERSION}`);
      return;
    }

    manager.store.addReducer(namespace, reducers);


  }

}
