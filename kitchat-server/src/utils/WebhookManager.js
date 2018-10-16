import jwt from 'jsonwebtoken';
import request from 'axios';
import uuid from 'uuid';

class WebHookRequest {
  constructor({
    url, data, Manager, secret, config, on,
  }) {
    this.url = url;
    this.on = on;
    this.data = data;
    this.secret = secret;
    this.config = config;
    this.id = uuid.v4();
    this.Manager = Manager;

    this.sign = this.sign.bind(this);
    this.send = this.send.bind(this);
  }

  async sign(secret) {
    this.signedData = await jwt.sign(this.data, secret || this.secret);
    return this;
  }

  async send() {
    const {
      Manager, id, url, signedData, config, on,
    } = this;
    await this.sign();
    console.log('[HOOK] send', on, 'to', url);
    request
      .post(url, signedData, config)
      .then(() => {
        Manager.removeRequest(id);
      })
      .catch((err) => {
        console.log('ERROR', err);
        Manager.removeRequest(id);
      });
    return Manager;
  }
}


class WebHookManager {
  constructor({
    on, secret, base_url, axios_config,
  }) {
    this.secret = secret;
    this.on = on;
    this.base_url = base_url;
    this.axios_config = axios_config;
    this.requests = {};

    this.set = this.set.bind(this);
    this.createRequest = this.createRequest.bind(this);
    this.removeRequest = this.removeRequest.bind(this);
  }

  set(key, value) {
    this[key] = value;
  }

  createRequest({ route, data, axios_config }) {
    const url = `${this.base_url}${route}`;
    const req = new WebHookRequest({
      secret: this.secret,
      url,
      data,
      on: this.on,
      Manager: this,
      config: axios_config || this.axios_config || null,
    });
    this.requests[req.id] = req;
    return req;
  }

  removeRequest(requestId) {
    if (this.requests[requestId]) {
      delete this.requests[requestId];
    }
    return this;
  }
}

export default WebHookManager;
