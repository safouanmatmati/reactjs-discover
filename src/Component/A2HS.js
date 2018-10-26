// @flow strict

/**
 * A2HS React component.
 * Manage "add to home screen" prompt.
 */
export default class A2HS {
  onInstallable: () => void
  onInstalled: () => void

  /**
   * PWA add to home screen prompt
   * @type {Object}
   */
  prompt: any

  /**
   * Constructor.
   * @param {Object} props
   */
  constructor(onInstallable: () => void, onInstalled: () => void) {
    this.onInstallable = onInstallable;
    this.onInstalled = onInstalled;

    const instance = this;

    window.addEventListener('beforeinstallprompt', (e) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();

      instance.prompt = e;
      instance.onInstallable();
    });

    window.addEventListener('appinstalled', (e) => {
      instance.onInstalled();
    });
  }

  /**
   * Launch installation
   */
   promptInstall = async ():Promise<boolean> => {
    // Show the prompt
    this.prompt.prompt();

    // Wait for the user to respond to the prompt
    return await this.prompt.userChoice
      .then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          return true;
        } else {
          console.log('User dismissed the A2HS prompt');
          return false;
        }
      });
  }
}
