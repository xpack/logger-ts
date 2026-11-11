import { strict as assert } from 'node:assert';
import * as util from 'node:util';
export class Logger {
    static defaultLevel = 'info';
    static numericLevels = {
        silent: 0,
        error: 10,
        warn: 20,
        info: 30,
        verbose: 40,
        debug: 50,
        trace: 60,
        all: 70,
    };
    static numericLevelUndefined = Infinity;
    static numericLevelAlways = -1;
    _console = console;
    levelNumericValue = Logger.numericLevelUndefined;
    levelName = undefined;
    buffer = [];
    constructor(params = {}) {
        if (params.console != null) {
            this._console = params.console;
        }
        if (params.level !== undefined) {
            this.level = params.level;
        }
        assert(typeof this._console.log === 'function', 'The console must have a log() function');
        assert(typeof this._console.error === 'function', 'The console must have an error() function');
        this.trace(`${this.constructor.name}.constructor()`);
    }
    get hasLevel() {
        return this.levelNumericValue !== Logger.numericLevelUndefined;
    }
    set level(level) {
        assert(level);
        assert(Object.prototype.hasOwnProperty.call(Logger.numericLevels, level), `Log level '${level}' not supported.`);
        this.levelNumericValue = Logger.numericLevels[level];
        this.levelName = level;
        if (this.buffer.length > 0) {
            const records = this.buffer;
            this.buffer = [];
            records.forEach((record) => {
                if (this.levelNumericValue >= record.numericLevel) {
                    record.func(record.message);
                }
            });
        }
    }
    get level() {
        return this.levelName;
    }
    get isSilent() {
        return this.levelNumericValue >= Logger.numericLevels.silent;
    }
    get isError() {
        return this.levelNumericValue >= Logger.numericLevels.error;
    }
    get isWarn() {
        return this.levelNumericValue >= Logger.numericLevels.warn;
    }
    get isInfo() {
        return this.levelNumericValue >= Logger.numericLevels.info;
    }
    get isVerbose() {
        return this.levelNumericValue >= Logger.numericLevels.verbose;
    }
    get isDebug() {
        return this.levelNumericValue >= Logger.numericLevels.debug;
    }
    get isTrace() {
        return this.levelNumericValue >= Logger.numericLevels.trace;
    }
    get isAll() {
        return this.levelNumericValue >= Logger.numericLevels.all;
    }
    get console() {
        return this._console;
    }
    isLevel(level) {
        assert(level);
        assert(Object.prototype.hasOwnProperty.call(Logger.numericLevels, level), `Log level '${level}' not supported.`);
        return this.levelNumericValue >= Logger.numericLevels[level];
    }
    write(numericLevel, loggerFunction, message) {
        if (message === undefined) {
            return;
        }
        if (this.levelNumericValue !== Logger.numericLevelUndefined) {
            loggerFunction(message);
        }
        else {
            this.buffer.push({
                numericLevel,
                func: loggerFunction,
                message,
            });
        }
    }
    always(message = '', ...args) {
        const str = util.format(message, ...args);
        this.write(Logger.numericLevelAlways, (msg) => {
            this._console.log(msg);
        }, str);
    }
    error(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.error) {
            if (message instanceof Error) {
                const str = util.format(message, ...args);
                this.write(Logger.numericLevels.error, (msg) => {
                    this._console.error(msg);
                }, str);
            }
            else {
                const str = util.format(message, ...args);
                this.write(Logger.numericLevels.error, (msg) => {
                    this._console.error(msg);
                }, 'error: ' + str);
            }
        }
    }
    output(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.error) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.error, (msg) => {
                this._console.log(msg);
            }, str);
        }
    }
    warn(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.warn) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.warn, (msg) => {
                this._console.error(msg);
            }, 'warning: ' + str);
        }
    }
    info(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.info) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.info, (msg) => {
                this._console.log(msg);
            }, str);
        }
    }
    verbose(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.verbose) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.verbose, (msg) => {
                this._console.log(msg);
            }, str);
        }
    }
    debug(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.debug) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.debug, (msg) => {
                this._console.log(msg);
            }, 'debug: ' + str);
        }
    }
    trace(message = '', ...args) {
        if (this.levelNumericValue >= Logger.numericLevels.trace) {
            const str = util.format(message, ...args);
            this.write(Logger.numericLevels.trace, (msg) => {
                this._console.log(msg);
            }, 'trace: ' + str);
        }
    }
}
//# sourceMappingURL=logger.js.map