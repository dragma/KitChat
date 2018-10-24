class Logger {
  constructor() {
    this.debug = true;
    this.init = this.init.bind(this);
    this.log = this.log.bind(this);
  }

  init(debug) {
    this.debug = debug;
  }

  log(...args) {
    if (this.debug) console.log(...args);
  }
}

const logger = new Logger();

export const { init } = logger;
export default logger.log;
