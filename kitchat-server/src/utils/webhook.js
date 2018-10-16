import WebHookManager from './WebhookManager';

const webhooks = {};

const webhookMaker = (webhooks_options, secret) => (action_name) => {
  if (!webhooks_options[action_name]) {
    return () => null;
  }
  if (!webhooks[action_name]) {
    webhooks[action_name] = new WebHookManager({
      on: action_name,
      secret,
      base_url: webhooks_options[action_name].url || webhooks_options.default.url,
    });
  }
  return (data = {}) => {
    const Manager = webhooks[action_name];
    return Manager
      .createRequest({
        route: webhooks_options[action_name].route || webhooks_options.default.route,
        data,
      })
      .send();
  };
};

export default webhookMaker;
