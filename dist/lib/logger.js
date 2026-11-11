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
    static levelNames = Object.freeze(Object.keys(Logger.numericLevels));
    static isLogLevel(value) {
        return (typeof value === 'string' &&
            Object.prototype.hasOwnProperty.call(Logger.numericLevels, value));
    }
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
    }
    get hasLevel() {
        return this.levelNumericValue !== Logger.numericLevelUndefined;
    }
    set level(level) {
        assert(level);
        assert(Logger.isLogLevel(level), `Log level '${level}' not supported.`);
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
        assert(Logger.isLogLevel(level), `Log level '${level}' not supported.`);
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
    emit(numericLevel, stream, prefix, message, args) {
        if (this.levelNumericValue < numericLevel) {
            return;
        }
        const str = util.format(message, ...args);
        this.write(numericLevel, (msg) => {
            if (stream === 'log') {
                this._console.log(msg);
            }
            else {
                this._console.error(msg);
            }
        }, prefix + str);
    }
    always(message = '', ...args) {
        this.emit(Logger.numericLevelAlways, 'log', '', message, args);
    }
    error(message = '', ...args) {
        this.emit(Logger.numericLevels.error, 'error', message instanceof Error ? '' : 'error: ', message, args);
    }
    output(message = '', ...args) {
        this.emit(Logger.numericLevels.error, 'log', '', message, args);
    }
    warn(message = '', ...args) {
        this.emit(Logger.numericLevels.warn, 'error', 'warning: ', message, args);
    }
    info(message = '', ...args) {
        this.emit(Logger.numericLevels.info, 'log', '', message, args);
    }
    verbose(message = '', ...args) {
        this.emit(Logger.numericLevels.verbose, 'log', '', message, args);
    }
    debug(message = '', ...args) {
        this.emit(Logger.numericLevels.debug, 'log', 'debug: ', message, args);
    }
    trace(message = '', ...args) {
        this.emit(Logger.numericLevels.trace, 'log', 'trace: ', message, args);
    }
}
//# sourceMappingURL=logger.js.map