var _a;
import { strict as assert } from 'node:assert';
import * as util from 'node:util';
export class Logger {
    static recommendedLevel = 'info';
    static defaultLevel = this.recommendedLevel;
    static numericLevels = Object.freeze({
        silent: 0,
        error: 10,
        warn: 20,
        info: 30,
        verbose: 40,
        debug: 50,
        trace: 60,
        all: 70,
    });
    static numericLevelUndefined = Infinity;
    static numericLevelAlways = -1;
    static levelNames = Object.freeze(Object.keys(this.numericLevels));
    static isLogLevel(value) {
        return (typeof value === 'string' &&
            Object.prototype.hasOwnProperty.call(_a.numericLevels, value));
    }
    static assertLogLevel(value) {
        if (typeof value !== 'string') {
            throw new TypeError('Log level must be a string, not ' +
                `${value === null ? 'null' : typeof value}; ` +
                `valid levels are: ${_a.levelNames.join(', ')}`);
        }
        if (!_a.isLogLevel(value)) {
            throw new RangeError(`Unsupported log level ${util.inspect(value)}; ` +
                `valid levels are: ${_a.levelNames.join(', ')}`);
        }
    }
    #console = console;
    #numericLevel = _a.numericLevelUndefined;
    #levelName = undefined;
    #buffer = [];
    get _console() {
        return this.#console;
    }
    get levelNumericValue() {
        return this.#numericLevel;
    }
    set levelNumericValue(value) {
        this.#numericLevel = value;
    }
    get levelName() {
        return this.#levelName;
    }
    set levelName(value) {
        this.#levelName = value;
    }
    get buffer() {
        return this.#buffer;
    }
    set buffer(value) {
        this.#buffer = value;
    }
    constructor(params = {}) {
        if (params.console != null) {
            this.#console = params.console;
        }
        if (params.level !== undefined) {
            this.level = params.level;
        }
        assert(typeof this.#console.log === 'function', 'The console must have a log() function');
        assert(typeof this.#console.error === 'function', 'The console must have an error() function');
    }
    get hasLevel() {
        return this.#numericLevel !== _a.numericLevelUndefined;
    }
    set level(level) {
        _a.assertLogLevel(level);
        this.#numericLevel = _a.numericLevels[level];
        this.#levelName = level;
        if (this.#buffer.length > 0) {
            const records = this.#buffer;
            this.#buffer = [];
            records.forEach((record) => {
                if (this.#numericLevel >= record.numericLevel) {
                    record.func(record.message);
                }
            });
        }
    }
    get level() {
        return this.#levelName;
    }
    get isSilent() {
        return this.#numericLevel >= _a.numericLevels.silent;
    }
    get isError() {
        return this.#numericLevel >= _a.numericLevels.error;
    }
    get isWarn() {
        return this.#numericLevel >= _a.numericLevels.warn;
    }
    get isInfo() {
        return this.#numericLevel >= _a.numericLevels.info;
    }
    get isVerbose() {
        return this.#numericLevel >= _a.numericLevels.verbose;
    }
    get isDebug() {
        return this.#numericLevel >= _a.numericLevels.debug;
    }
    get isTrace() {
        return this.#numericLevel >= _a.numericLevels.trace;
    }
    get isAll() {
        return this.#numericLevel >= _a.numericLevels.all;
    }
    get console() {
        return this.#console;
    }
    isLevel(level) {
        _a.assertLogLevel(level);
        return this.#numericLevel >= _a.numericLevels[level];
    }
    write(numericLevel, loggerFunction, message) {
        if (message === undefined) {
            return;
        }
        if (this.#numericLevel !== _a.numericLevelUndefined) {
            loggerFunction(message);
        }
        else {
            this.#buffer.push({
                numericLevel,
                func: loggerFunction,
                message,
            });
        }
    }
    emit(numericLevel, stream, prefix, message, args) {
        if (this.#numericLevel < numericLevel) {
            return;
        }
        const str = util.format(message, ...args);
        this.write(numericLevel, (msg) => {
            if (stream === 'log') {
                this.#console.log(msg);
            }
            else {
                this.#console.error(msg);
            }
        }, prefix + str);
    }
    always(message = '', ...args) {
        this.emit(_a.numericLevelAlways, 'log', '', message, args);
    }
    error(message = '', ...args) {
        this.emit(_a.numericLevels.error, 'error', message instanceof Error ? '' : 'error: ', message, args);
    }
    output(message = '', ...args) {
        this.emit(_a.numericLevels.error, 'log', '', message, args);
    }
    warn(message = '', ...args) {
        this.emit(_a.numericLevels.warn, 'error', 'warning: ', message, args);
    }
    info(message = '', ...args) {
        this.emit(_a.numericLevels.info, 'log', '', message, args);
    }
    verbose(message = '', ...args) {
        this.emit(_a.numericLevels.verbose, 'log', '', message, args);
    }
    debug(message = '', ...args) {
        this.emit(_a.numericLevels.debug, 'log', 'debug: ', message, args);
    }
    trace(message = '', ...args) {
        this.emit(_a.numericLevels.trace, 'log', 'trace: ', message, args);
    }
}
_a = Logger;
Object.freeze(Logger);
//# sourceMappingURL=logger.js.map