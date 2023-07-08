require('./sourcemap-register.js');/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7351:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.issue = exports.issueCommand = void 0;
const os = __importStar(__nccwpck_require__(2037));
const utils_1 = __nccwpck_require__(5278);
/**
 * Commands
 *
 * Command Format:
 *   ::name key=value,key=value::message
 *
 * Examples:
 *   ::warning::This is the message
 *   ::set-env name=MY_VAR::some value
 */
function issueCommand(command, properties, message) {
    const cmd = new Command(command, properties, message);
    process.stdout.write(cmd.toString() + os.EOL);
}
exports.issueCommand = issueCommand;
function issue(name, message = '') {
    issueCommand(name, {}, message);
}
exports.issue = issue;
const CMD_STRING = '::';
class Command {
    constructor(command, properties, message) {
        if (!command) {
            command = 'missing.command';
        }
        this.command = command;
        this.properties = properties;
        this.message = message;
    }
    toString() {
        let cmdStr = CMD_STRING + this.command;
        if (this.properties && Object.keys(this.properties).length > 0) {
            cmdStr += ' ';
            let first = true;
            for (const key in this.properties) {
                if (this.properties.hasOwnProperty(key)) {
                    const val = this.properties[key];
                    if (val) {
                        if (first) {
                            first = false;
                        }
                        else {
                            cmdStr += ',';
                        }
                        cmdStr += `${key}=${escapeProperty(val)}`;
                    }
                }
            }
        }
        cmdStr += `${CMD_STRING}${escapeData(this.message)}`;
        return cmdStr;
    }
}
function escapeData(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A');
}
function escapeProperty(s) {
    return utils_1.toCommandValue(s)
        .replace(/%/g, '%25')
        .replace(/\r/g, '%0D')
        .replace(/\n/g, '%0A')
        .replace(/:/g, '%3A')
        .replace(/,/g, '%2C');
}
//# sourceMappingURL=command.js.map

/***/ }),

/***/ 2186:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.getIDToken = exports.getState = exports.saveState = exports.group = exports.endGroup = exports.startGroup = exports.info = exports.notice = exports.warning = exports.error = exports.debug = exports.isDebug = exports.setFailed = exports.setCommandEcho = exports.setOutput = exports.getBooleanInput = exports.getMultilineInput = exports.getInput = exports.addPath = exports.setSecret = exports.exportVariable = exports.ExitCode = void 0;
const command_1 = __nccwpck_require__(7351);
const file_command_1 = __nccwpck_require__(717);
const utils_1 = __nccwpck_require__(5278);
const os = __importStar(__nccwpck_require__(2037));
const path = __importStar(__nccwpck_require__(1017));
const oidc_utils_1 = __nccwpck_require__(8041);
/**
 * The code to exit an action
 */
var ExitCode;
(function (ExitCode) {
    /**
     * A code indicating that the action was successful
     */
    ExitCode[ExitCode["Success"] = 0] = "Success";
    /**
     * A code indicating that the action was a failure
     */
    ExitCode[ExitCode["Failure"] = 1] = "Failure";
})(ExitCode = exports.ExitCode || (exports.ExitCode = {}));
//-----------------------------------------------------------------------
// Variables
//-----------------------------------------------------------------------
/**
 * Sets env variable for this action and future actions in the job
 * @param name the name of the variable to set
 * @param val the value of the variable. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function exportVariable(name, val) {
    const convertedVal = utils_1.toCommandValue(val);
    process.env[name] = convertedVal;
    const filePath = process.env['GITHUB_ENV'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('ENV', file_command_1.prepareKeyValueMessage(name, val));
    }
    command_1.issueCommand('set-env', { name }, convertedVal);
}
exports.exportVariable = exportVariable;
/**
 * Registers a secret which will get masked from logs
 * @param secret value of the secret
 */
function setSecret(secret) {
    command_1.issueCommand('add-mask', {}, secret);
}
exports.setSecret = setSecret;
/**
 * Prepends inputPath to the PATH (for this action and future actions)
 * @param inputPath
 */
function addPath(inputPath) {
    const filePath = process.env['GITHUB_PATH'] || '';
    if (filePath) {
        file_command_1.issueFileCommand('PATH', inputPath);
    }
    else {
        command_1.issueCommand('add-path', {}, inputPath);
    }
    process.env['PATH'] = `${inputPath}${path.delimiter}${process.env['PATH']}`;
}
exports.addPath = addPath;
/**
 * Gets the value of an input.
 * Unless trimWhitespace is set to false in InputOptions, the value is also trimmed.
 * Returns an empty string if the value is not defined.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string
 */
function getInput(name, options) {
    const val = process.env[`INPUT_${name.replace(/ /g, '_').toUpperCase()}`] || '';
    if (options && options.required && !val) {
        throw new Error(`Input required and not supplied: ${name}`);
    }
    if (options && options.trimWhitespace === false) {
        return val;
    }
    return val.trim();
}
exports.getInput = getInput;
/**
 * Gets the values of an multiline input.  Each value is also trimmed.
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   string[]
 *
 */
function getMultilineInput(name, options) {
    const inputs = getInput(name, options)
        .split('\n')
        .filter(x => x !== '');
    if (options && options.trimWhitespace === false) {
        return inputs;
    }
    return inputs.map(input => input.trim());
}
exports.getMultilineInput = getMultilineInput;
/**
 * Gets the input value of the boolean type in the YAML 1.2 "core schema" specification.
 * Support boolean input list: `true | True | TRUE | false | False | FALSE` .
 * The return value is also in boolean type.
 * ref: https://yaml.org/spec/1.2/spec.html#id2804923
 *
 * @param     name     name of the input to get
 * @param     options  optional. See InputOptions.
 * @returns   boolean
 */
function getBooleanInput(name, options) {
    const trueValue = ['true', 'True', 'TRUE'];
    const falseValue = ['false', 'False', 'FALSE'];
    const val = getInput(name, options);
    if (trueValue.includes(val))
        return true;
    if (falseValue.includes(val))
        return false;
    throw new TypeError(`Input does not meet YAML 1.2 "Core Schema" specification: ${name}\n` +
        `Support boolean input list: \`true | True | TRUE | false | False | FALSE\``);
}
exports.getBooleanInput = getBooleanInput;
/**
 * Sets the value of an output.
 *
 * @param     name     name of the output to set
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function setOutput(name, value) {
    const filePath = process.env['GITHUB_OUTPUT'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('OUTPUT', file_command_1.prepareKeyValueMessage(name, value));
    }
    process.stdout.write(os.EOL);
    command_1.issueCommand('set-output', { name }, utils_1.toCommandValue(value));
}
exports.setOutput = setOutput;
/**
 * Enables or disables the echoing of commands into stdout for the rest of the step.
 * Echoing is disabled by default if ACTIONS_STEP_DEBUG is not set.
 *
 */
function setCommandEcho(enabled) {
    command_1.issue('echo', enabled ? 'on' : 'off');
}
exports.setCommandEcho = setCommandEcho;
//-----------------------------------------------------------------------
// Results
//-----------------------------------------------------------------------
/**
 * Sets the action status to failed.
 * When the action exits it will be with an exit code of 1
 * @param message add error issue message
 */
function setFailed(message) {
    process.exitCode = ExitCode.Failure;
    error(message);
}
exports.setFailed = setFailed;
//-----------------------------------------------------------------------
// Logging Commands
//-----------------------------------------------------------------------
/**
 * Gets whether Actions Step Debug is on or not
 */
function isDebug() {
    return process.env['RUNNER_DEBUG'] === '1';
}
exports.isDebug = isDebug;
/**
 * Writes debug message to user log
 * @param message debug message
 */
function debug(message) {
    command_1.issueCommand('debug', {}, message);
}
exports.debug = debug;
/**
 * Adds an error issue
 * @param message error issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function error(message, properties = {}) {
    command_1.issueCommand('error', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.error = error;
/**
 * Adds a warning issue
 * @param message warning issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function warning(message, properties = {}) {
    command_1.issueCommand('warning', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.warning = warning;
/**
 * Adds a notice issue
 * @param message notice issue message. Errors will be converted to string via toString()
 * @param properties optional properties to add to the annotation.
 */
function notice(message, properties = {}) {
    command_1.issueCommand('notice', utils_1.toCommandProperties(properties), message instanceof Error ? message.toString() : message);
}
exports.notice = notice;
/**
 * Writes info to log with console.log.
 * @param message info message
 */
function info(message) {
    process.stdout.write(message + os.EOL);
}
exports.info = info;
/**
 * Begin an output group.
 *
 * Output until the next `groupEnd` will be foldable in this group
 *
 * @param name The name of the output group
 */
function startGroup(name) {
    command_1.issue('group', name);
}
exports.startGroup = startGroup;
/**
 * End an output group.
 */
function endGroup() {
    command_1.issue('endgroup');
}
exports.endGroup = endGroup;
/**
 * Wrap an asynchronous function call in a group.
 *
 * Returns the same type as the function itself.
 *
 * @param name The name of the group
 * @param fn The function to wrap in the group
 */
function group(name, fn) {
    return __awaiter(this, void 0, void 0, function* () {
        startGroup(name);
        let result;
        try {
            result = yield fn();
        }
        finally {
            endGroup();
        }
        return result;
    });
}
exports.group = group;
//-----------------------------------------------------------------------
// Wrapper action state
//-----------------------------------------------------------------------
/**
 * Saves state for current action, the state can only be retrieved by this action's post job execution.
 *
 * @param     name     name of the state to store
 * @param     value    value to store. Non-string values will be converted to a string via JSON.stringify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function saveState(name, value) {
    const filePath = process.env['GITHUB_STATE'] || '';
    if (filePath) {
        return file_command_1.issueFileCommand('STATE', file_command_1.prepareKeyValueMessage(name, value));
    }
    command_1.issueCommand('save-state', { name }, utils_1.toCommandValue(value));
}
exports.saveState = saveState;
/**
 * Gets the value of an state set by this action's main execution.
 *
 * @param     name     name of the state to get
 * @returns   string
 */
function getState(name) {
    return process.env[`STATE_${name}`] || '';
}
exports.getState = getState;
function getIDToken(aud) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield oidc_utils_1.OidcClient.getIDToken(aud);
    });
}
exports.getIDToken = getIDToken;
/**
 * Summary exports
 */
var summary_1 = __nccwpck_require__(1327);
Object.defineProperty(exports, "summary", ({ enumerable: true, get: function () { return summary_1.summary; } }));
/**
 * @deprecated use core.summary
 */
var summary_2 = __nccwpck_require__(1327);
Object.defineProperty(exports, "markdownSummary", ({ enumerable: true, get: function () { return summary_2.markdownSummary; } }));
/**
 * Path exports
 */
var path_utils_1 = __nccwpck_require__(2981);
Object.defineProperty(exports, "toPosixPath", ({ enumerable: true, get: function () { return path_utils_1.toPosixPath; } }));
Object.defineProperty(exports, "toWin32Path", ({ enumerable: true, get: function () { return path_utils_1.toWin32Path; } }));
Object.defineProperty(exports, "toPlatformPath", ({ enumerable: true, get: function () { return path_utils_1.toPlatformPath; } }));
//# sourceMappingURL=core.js.map

/***/ }),

/***/ 717:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

// For internal use, subject to change.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.prepareKeyValueMessage = exports.issueFileCommand = void 0;
// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
const fs = __importStar(__nccwpck_require__(7147));
const os = __importStar(__nccwpck_require__(2037));
const uuid_1 = __nccwpck_require__(5840);
const utils_1 = __nccwpck_require__(5278);
function issueFileCommand(command, message) {
    const filePath = process.env[`GITHUB_${command}`];
    if (!filePath) {
        throw new Error(`Unable to find environment variable for file command ${command}`);
    }
    if (!fs.existsSync(filePath)) {
        throw new Error(`Missing file at path: ${filePath}`);
    }
    fs.appendFileSync(filePath, `${utils_1.toCommandValue(message)}${os.EOL}`, {
        encoding: 'utf8'
    });
}
exports.issueFileCommand = issueFileCommand;
function prepareKeyValueMessage(key, value) {
    const delimiter = `ghadelimiter_${uuid_1.v4()}`;
    const convertedValue = utils_1.toCommandValue(value);
    // These should realistically never happen, but just in case someone finds a
    // way to exploit uuid generation let's not allow keys or values that contain
    // the delimiter.
    if (key.includes(delimiter)) {
        throw new Error(`Unexpected input: name should not contain the delimiter "${delimiter}"`);
    }
    if (convertedValue.includes(delimiter)) {
        throw new Error(`Unexpected input: value should not contain the delimiter "${delimiter}"`);
    }
    return `${key}<<${delimiter}${os.EOL}${convertedValue}${os.EOL}${delimiter}`;
}
exports.prepareKeyValueMessage = prepareKeyValueMessage;
//# sourceMappingURL=file-command.js.map

/***/ }),

/***/ 8041:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OidcClient = void 0;
const http_client_1 = __nccwpck_require__(6255);
const auth_1 = __nccwpck_require__(5526);
const core_1 = __nccwpck_require__(2186);
class OidcClient {
    static createHttpClient(allowRetry = true, maxRetry = 10) {
        const requestOptions = {
            allowRetries: allowRetry,
            maxRetries: maxRetry
        };
        return new http_client_1.HttpClient('actions/oidc-client', [new auth_1.BearerCredentialHandler(OidcClient.getRequestToken())], requestOptions);
    }
    static getRequestToken() {
        const token = process.env['ACTIONS_ID_TOKEN_REQUEST_TOKEN'];
        if (!token) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_TOKEN env variable');
        }
        return token;
    }
    static getIDTokenUrl() {
        const runtimeUrl = process.env['ACTIONS_ID_TOKEN_REQUEST_URL'];
        if (!runtimeUrl) {
            throw new Error('Unable to get ACTIONS_ID_TOKEN_REQUEST_URL env variable');
        }
        return runtimeUrl;
    }
    static getCall(id_token_url) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const httpclient = OidcClient.createHttpClient();
            const res = yield httpclient
                .getJson(id_token_url)
                .catch(error => {
                throw new Error(`Failed to get ID Token. \n 
        Error Code : ${error.statusCode}\n 
        Error Message: ${error.result.message}`);
            });
            const id_token = (_a = res.result) === null || _a === void 0 ? void 0 : _a.value;
            if (!id_token) {
                throw new Error('Response json body do not have ID Token field');
            }
            return id_token;
        });
    }
    static getIDToken(audience) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // New ID Token is requested from action service
                let id_token_url = OidcClient.getIDTokenUrl();
                if (audience) {
                    const encodedAudience = encodeURIComponent(audience);
                    id_token_url = `${id_token_url}&audience=${encodedAudience}`;
                }
                core_1.debug(`ID token url is ${id_token_url}`);
                const id_token = yield OidcClient.getCall(id_token_url);
                core_1.setSecret(id_token);
                return id_token;
            }
            catch (error) {
                throw new Error(`Error message: ${error.message}`);
            }
        });
    }
}
exports.OidcClient = OidcClient;
//# sourceMappingURL=oidc-utils.js.map

/***/ }),

/***/ 2981:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toPlatformPath = exports.toWin32Path = exports.toPosixPath = void 0;
const path = __importStar(__nccwpck_require__(1017));
/**
 * toPosixPath converts the given path to the posix form. On Windows, \\ will be
 * replaced with /.
 *
 * @param pth. Path to transform.
 * @return string Posix path.
 */
function toPosixPath(pth) {
    return pth.replace(/[\\]/g, '/');
}
exports.toPosixPath = toPosixPath;
/**
 * toWin32Path converts the given path to the win32 form. On Linux, / will be
 * replaced with \\.
 *
 * @param pth. Path to transform.
 * @return string Win32 path.
 */
function toWin32Path(pth) {
    return pth.replace(/[/]/g, '\\');
}
exports.toWin32Path = toWin32Path;
/**
 * toPlatformPath converts the given path to a platform-specific path. It does
 * this by replacing instances of / and \ with the platform-specific path
 * separator.
 *
 * @param pth The path to platformize.
 * @return string The platform-specific path.
 */
function toPlatformPath(pth) {
    return pth.replace(/[/\\]/g, path.sep);
}
exports.toPlatformPath = toPlatformPath;
//# sourceMappingURL=path-utils.js.map

/***/ }),

/***/ 1327:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.summary = exports.markdownSummary = exports.SUMMARY_DOCS_URL = exports.SUMMARY_ENV_VAR = void 0;
const os_1 = __nccwpck_require__(2037);
const fs_1 = __nccwpck_require__(7147);
const { access, appendFile, writeFile } = fs_1.promises;
exports.SUMMARY_ENV_VAR = 'GITHUB_STEP_SUMMARY';
exports.SUMMARY_DOCS_URL = 'https://docs.github.com/actions/using-workflows/workflow-commands-for-github-actions#adding-a-job-summary';
class Summary {
    constructor() {
        this._buffer = '';
    }
    /**
     * Finds the summary file path from the environment, rejects if env var is not found or file does not exist
     * Also checks r/w permissions.
     *
     * @returns step summary file path
     */
    filePath() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._filePath) {
                return this._filePath;
            }
            const pathFromEnv = process.env[exports.SUMMARY_ENV_VAR];
            if (!pathFromEnv) {
                throw new Error(`Unable to find environment variable for $${exports.SUMMARY_ENV_VAR}. Check if your runtime environment supports job summaries.`);
            }
            try {
                yield access(pathFromEnv, fs_1.constants.R_OK | fs_1.constants.W_OK);
            }
            catch (_a) {
                throw new Error(`Unable to access summary file: '${pathFromEnv}'. Check if the file has correct read/write permissions.`);
            }
            this._filePath = pathFromEnv;
            return this._filePath;
        });
    }
    /**
     * Wraps content in an HTML tag, adding any HTML attributes
     *
     * @param {string} tag HTML tag to wrap
     * @param {string | null} content content within the tag
     * @param {[attribute: string]: string} attrs key-value list of HTML attributes to add
     *
     * @returns {string} content wrapped in HTML element
     */
    wrap(tag, content, attrs = {}) {
        const htmlAttrs = Object.entries(attrs)
            .map(([key, value]) => ` ${key}="${value}"`)
            .join('');
        if (!content) {
            return `<${tag}${htmlAttrs}>`;
        }
        return `<${tag}${htmlAttrs}>${content}</${tag}>`;
    }
    /**
     * Writes text in the buffer to the summary buffer file and empties buffer. Will append by default.
     *
     * @param {SummaryWriteOptions} [options] (optional) options for write operation
     *
     * @returns {Promise<Summary>} summary instance
     */
    write(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const overwrite = !!(options === null || options === void 0 ? void 0 : options.overwrite);
            const filePath = yield this.filePath();
            const writeFunc = overwrite ? writeFile : appendFile;
            yield writeFunc(filePath, this._buffer, { encoding: 'utf8' });
            return this.emptyBuffer();
        });
    }
    /**
     * Clears the summary buffer and wipes the summary file
     *
     * @returns {Summary} summary instance
     */
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.emptyBuffer().write({ overwrite: true });
        });
    }
    /**
     * Returns the current summary buffer as a string
     *
     * @returns {string} string of summary buffer
     */
    stringify() {
        return this._buffer;
    }
    /**
     * If the summary buffer is empty
     *
     * @returns {boolen} true if the buffer is empty
     */
    isEmptyBuffer() {
        return this._buffer.length === 0;
    }
    /**
     * Resets the summary buffer without writing to summary file
     *
     * @returns {Summary} summary instance
     */
    emptyBuffer() {
        this._buffer = '';
        return this;
    }
    /**
     * Adds raw text to the summary buffer
     *
     * @param {string} text content to add
     * @param {boolean} [addEOL=false] (optional) append an EOL to the raw text (default: false)
     *
     * @returns {Summary} summary instance
     */
    addRaw(text, addEOL = false) {
        this._buffer += text;
        return addEOL ? this.addEOL() : this;
    }
    /**
     * Adds the operating system-specific end-of-line marker to the buffer
     *
     * @returns {Summary} summary instance
     */
    addEOL() {
        return this.addRaw(os_1.EOL);
    }
    /**
     * Adds an HTML codeblock to the summary buffer
     *
     * @param {string} code content to render within fenced code block
     * @param {string} lang (optional) language to syntax highlight code
     *
     * @returns {Summary} summary instance
     */
    addCodeBlock(code, lang) {
        const attrs = Object.assign({}, (lang && { lang }));
        const element = this.wrap('pre', this.wrap('code', code), attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML list to the summary buffer
     *
     * @param {string[]} items list of items to render
     * @param {boolean} [ordered=false] (optional) if the rendered list should be ordered or not (default: false)
     *
     * @returns {Summary} summary instance
     */
    addList(items, ordered = false) {
        const tag = ordered ? 'ol' : 'ul';
        const listItems = items.map(item => this.wrap('li', item)).join('');
        const element = this.wrap(tag, listItems);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML table to the summary buffer
     *
     * @param {SummaryTableCell[]} rows table rows
     *
     * @returns {Summary} summary instance
     */
    addTable(rows) {
        const tableBody = rows
            .map(row => {
            const cells = row
                .map(cell => {
                if (typeof cell === 'string') {
                    return this.wrap('td', cell);
                }
                const { header, data, colspan, rowspan } = cell;
                const tag = header ? 'th' : 'td';
                const attrs = Object.assign(Object.assign({}, (colspan && { colspan })), (rowspan && { rowspan }));
                return this.wrap(tag, data, attrs);
            })
                .join('');
            return this.wrap('tr', cells);
        })
            .join('');
        const element = this.wrap('table', tableBody);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds a collapsable HTML details element to the summary buffer
     *
     * @param {string} label text for the closed state
     * @param {string} content collapsable content
     *
     * @returns {Summary} summary instance
     */
    addDetails(label, content) {
        const element = this.wrap('details', this.wrap('summary', label) + content);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML image tag to the summary buffer
     *
     * @param {string} src path to the image you to embed
     * @param {string} alt text description of the image
     * @param {SummaryImageOptions} options (optional) addition image attributes
     *
     * @returns {Summary} summary instance
     */
    addImage(src, alt, options) {
        const { width, height } = options || {};
        const attrs = Object.assign(Object.assign({}, (width && { width })), (height && { height }));
        const element = this.wrap('img', null, Object.assign({ src, alt }, attrs));
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML section heading element
     *
     * @param {string} text heading text
     * @param {number | string} [level=1] (optional) the heading level, default: 1
     *
     * @returns {Summary} summary instance
     */
    addHeading(text, level) {
        const tag = `h${level}`;
        const allowedTag = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)
            ? tag
            : 'h1';
        const element = this.wrap(allowedTag, text);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML thematic break (<hr>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addSeparator() {
        const element = this.wrap('hr', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML line break (<br>) to the summary buffer
     *
     * @returns {Summary} summary instance
     */
    addBreak() {
        const element = this.wrap('br', null);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML blockquote to the summary buffer
     *
     * @param {string} text quote text
     * @param {string} cite (optional) citation url
     *
     * @returns {Summary} summary instance
     */
    addQuote(text, cite) {
        const attrs = Object.assign({}, (cite && { cite }));
        const element = this.wrap('blockquote', text, attrs);
        return this.addRaw(element).addEOL();
    }
    /**
     * Adds an HTML anchor tag to the summary buffer
     *
     * @param {string} text link text/content
     * @param {string} href hyperlink
     *
     * @returns {Summary} summary instance
     */
    addLink(text, href) {
        const element = this.wrap('a', text, { href });
        return this.addRaw(element).addEOL();
    }
}
const _summary = new Summary();
/**
 * @deprecated use `core.summary`
 */
exports.markdownSummary = _summary;
exports.summary = _summary;
//# sourceMappingURL=summary.js.map

/***/ }),

/***/ 5278:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

// We use any as a valid input type
/* eslint-disable @typescript-eslint/no-explicit-any */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.toCommandProperties = exports.toCommandValue = void 0;
/**
 * Sanitizes an input into a string so it can be passed into issueCommand safely
 * @param input input to sanitize into a string
 */
function toCommandValue(input) {
    if (input === null || input === undefined) {
        return '';
    }
    else if (typeof input === 'string' || input instanceof String) {
        return input;
    }
    return JSON.stringify(input);
}
exports.toCommandValue = toCommandValue;
/**
 *
 * @param annotationProperties
 * @returns The command properties to send with the actual annotation command
 * See IssueCommandProperties: https://github.com/actions/runner/blob/main/src/Runner.Worker/ActionCommandManager.cs#L646
 */
function toCommandProperties(annotationProperties) {
    if (!Object.keys(annotationProperties).length) {
        return {};
    }
    return {
        title: annotationProperties.title,
        file: annotationProperties.file,
        line: annotationProperties.startLine,
        endLine: annotationProperties.endLine,
        col: annotationProperties.startColumn,
        endColumn: annotationProperties.endColumn
    };
}
exports.toCommandProperties = toCommandProperties;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 5526:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.PersonalAccessTokenCredentialHandler = exports.BearerCredentialHandler = exports.BasicCredentialHandler = void 0;
class BasicCredentialHandler {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`${this.username}:${this.password}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BasicCredentialHandler = BasicCredentialHandler;
class BearerCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Bearer ${this.token}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.BearerCredentialHandler = BearerCredentialHandler;
class PersonalAccessTokenCredentialHandler {
    constructor(token) {
        this.token = token;
    }
    // currently implements pre-authorization
    // TODO: support preAuth = false where it hooks on 401
    prepareRequest(options) {
        if (!options.headers) {
            throw Error('The request has no headers');
        }
        options.headers['Authorization'] = `Basic ${Buffer.from(`PAT:${this.token}`).toString('base64')}`;
    }
    // This handler cannot handle 401
    canHandleAuthentication() {
        return false;
    }
    handleAuthentication() {
        return __awaiter(this, void 0, void 0, function* () {
            throw new Error('not implemented');
        });
    }
}
exports.PersonalAccessTokenCredentialHandler = PersonalAccessTokenCredentialHandler;
//# sourceMappingURL=auth.js.map

/***/ }),

/***/ 6255:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

/* eslint-disable @typescript-eslint/no-explicit-any */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HttpClient = exports.isHttps = exports.HttpClientResponse = exports.HttpClientError = exports.getProxyUrl = exports.MediaTypes = exports.Headers = exports.HttpCodes = void 0;
const http = __importStar(__nccwpck_require__(3685));
const https = __importStar(__nccwpck_require__(5687));
const pm = __importStar(__nccwpck_require__(9835));
const tunnel = __importStar(__nccwpck_require__(4294));
var HttpCodes;
(function (HttpCodes) {
    HttpCodes[HttpCodes["OK"] = 200] = "OK";
    HttpCodes[HttpCodes["MultipleChoices"] = 300] = "MultipleChoices";
    HttpCodes[HttpCodes["MovedPermanently"] = 301] = "MovedPermanently";
    HttpCodes[HttpCodes["ResourceMoved"] = 302] = "ResourceMoved";
    HttpCodes[HttpCodes["SeeOther"] = 303] = "SeeOther";
    HttpCodes[HttpCodes["NotModified"] = 304] = "NotModified";
    HttpCodes[HttpCodes["UseProxy"] = 305] = "UseProxy";
    HttpCodes[HttpCodes["SwitchProxy"] = 306] = "SwitchProxy";
    HttpCodes[HttpCodes["TemporaryRedirect"] = 307] = "TemporaryRedirect";
    HttpCodes[HttpCodes["PermanentRedirect"] = 308] = "PermanentRedirect";
    HttpCodes[HttpCodes["BadRequest"] = 400] = "BadRequest";
    HttpCodes[HttpCodes["Unauthorized"] = 401] = "Unauthorized";
    HttpCodes[HttpCodes["PaymentRequired"] = 402] = "PaymentRequired";
    HttpCodes[HttpCodes["Forbidden"] = 403] = "Forbidden";
    HttpCodes[HttpCodes["NotFound"] = 404] = "NotFound";
    HttpCodes[HttpCodes["MethodNotAllowed"] = 405] = "MethodNotAllowed";
    HttpCodes[HttpCodes["NotAcceptable"] = 406] = "NotAcceptable";
    HttpCodes[HttpCodes["ProxyAuthenticationRequired"] = 407] = "ProxyAuthenticationRequired";
    HttpCodes[HttpCodes["RequestTimeout"] = 408] = "RequestTimeout";
    HttpCodes[HttpCodes["Conflict"] = 409] = "Conflict";
    HttpCodes[HttpCodes["Gone"] = 410] = "Gone";
    HttpCodes[HttpCodes["TooManyRequests"] = 429] = "TooManyRequests";
    HttpCodes[HttpCodes["InternalServerError"] = 500] = "InternalServerError";
    HttpCodes[HttpCodes["NotImplemented"] = 501] = "NotImplemented";
    HttpCodes[HttpCodes["BadGateway"] = 502] = "BadGateway";
    HttpCodes[HttpCodes["ServiceUnavailable"] = 503] = "ServiceUnavailable";
    HttpCodes[HttpCodes["GatewayTimeout"] = 504] = "GatewayTimeout";
})(HttpCodes = exports.HttpCodes || (exports.HttpCodes = {}));
var Headers;
(function (Headers) {
    Headers["Accept"] = "accept";
    Headers["ContentType"] = "content-type";
})(Headers = exports.Headers || (exports.Headers = {}));
var MediaTypes;
(function (MediaTypes) {
    MediaTypes["ApplicationJson"] = "application/json";
})(MediaTypes = exports.MediaTypes || (exports.MediaTypes = {}));
/**
 * Returns the proxy URL, depending upon the supplied url and proxy environment variables.
 * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
 */
function getProxyUrl(serverUrl) {
    const proxyUrl = pm.getProxyUrl(new URL(serverUrl));
    return proxyUrl ? proxyUrl.href : '';
}
exports.getProxyUrl = getProxyUrl;
const HttpRedirectCodes = [
    HttpCodes.MovedPermanently,
    HttpCodes.ResourceMoved,
    HttpCodes.SeeOther,
    HttpCodes.TemporaryRedirect,
    HttpCodes.PermanentRedirect
];
const HttpResponseRetryCodes = [
    HttpCodes.BadGateway,
    HttpCodes.ServiceUnavailable,
    HttpCodes.GatewayTimeout
];
const RetryableHttpVerbs = ['OPTIONS', 'GET', 'DELETE', 'HEAD'];
const ExponentialBackoffCeiling = 10;
const ExponentialBackoffTimeSlice = 5;
class HttpClientError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.name = 'HttpClientError';
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, HttpClientError.prototype);
    }
}
exports.HttpClientError = HttpClientError;
class HttpClientResponse {
    constructor(message) {
        this.message = message;
    }
    readBody() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                let output = Buffer.alloc(0);
                this.message.on('data', (chunk) => {
                    output = Buffer.concat([output, chunk]);
                });
                this.message.on('end', () => {
                    resolve(output.toString());
                });
            }));
        });
    }
}
exports.HttpClientResponse = HttpClientResponse;
function isHttps(requestUrl) {
    const parsedUrl = new URL(requestUrl);
    return parsedUrl.protocol === 'https:';
}
exports.isHttps = isHttps;
class HttpClient {
    constructor(userAgent, handlers, requestOptions) {
        this._ignoreSslError = false;
        this._allowRedirects = true;
        this._allowRedirectDowngrade = false;
        this._maxRedirects = 50;
        this._allowRetries = false;
        this._maxRetries = 1;
        this._keepAlive = false;
        this._disposed = false;
        this.userAgent = userAgent;
        this.handlers = handlers || [];
        this.requestOptions = requestOptions;
        if (requestOptions) {
            if (requestOptions.ignoreSslError != null) {
                this._ignoreSslError = requestOptions.ignoreSslError;
            }
            this._socketTimeout = requestOptions.socketTimeout;
            if (requestOptions.allowRedirects != null) {
                this._allowRedirects = requestOptions.allowRedirects;
            }
            if (requestOptions.allowRedirectDowngrade != null) {
                this._allowRedirectDowngrade = requestOptions.allowRedirectDowngrade;
            }
            if (requestOptions.maxRedirects != null) {
                this._maxRedirects = Math.max(requestOptions.maxRedirects, 0);
            }
            if (requestOptions.keepAlive != null) {
                this._keepAlive = requestOptions.keepAlive;
            }
            if (requestOptions.allowRetries != null) {
                this._allowRetries = requestOptions.allowRetries;
            }
            if (requestOptions.maxRetries != null) {
                this._maxRetries = requestOptions.maxRetries;
            }
        }
    }
    options(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('OPTIONS', requestUrl, null, additionalHeaders || {});
        });
    }
    get(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('GET', requestUrl, null, additionalHeaders || {});
        });
    }
    del(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('DELETE', requestUrl, null, additionalHeaders || {});
        });
    }
    post(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('POST', requestUrl, data, additionalHeaders || {});
        });
    }
    patch(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PATCH', requestUrl, data, additionalHeaders || {});
        });
    }
    put(requestUrl, data, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('PUT', requestUrl, data, additionalHeaders || {});
        });
    }
    head(requestUrl, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request('HEAD', requestUrl, null, additionalHeaders || {});
        });
    }
    sendStream(verb, requestUrl, stream, additionalHeaders) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.request(verb, requestUrl, stream, additionalHeaders);
        });
    }
    /**
     * Gets a typed object from an endpoint
     * Be aware that not found returns a null.  Other errors (4xx, 5xx) reject the promise
     */
    getJson(requestUrl, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            const res = yield this.get(requestUrl, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    postJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.post(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    putJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.put(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    patchJson(requestUrl, obj, additionalHeaders = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = JSON.stringify(obj, null, 2);
            additionalHeaders[Headers.Accept] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.Accept, MediaTypes.ApplicationJson);
            additionalHeaders[Headers.ContentType] = this._getExistingOrDefaultHeader(additionalHeaders, Headers.ContentType, MediaTypes.ApplicationJson);
            const res = yield this.patch(requestUrl, data, additionalHeaders);
            return this._processResponse(res, this.requestOptions);
        });
    }
    /**
     * Makes a raw http request.
     * All other methods such as get, post, patch, and request ultimately call this.
     * Prefer get, del, post and patch
     */
    request(verb, requestUrl, data, headers) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._disposed) {
                throw new Error('Client has already been disposed.');
            }
            const parsedUrl = new URL(requestUrl);
            let info = this._prepareRequest(verb, parsedUrl, headers);
            // Only perform retries on reads since writes may not be idempotent.
            const maxTries = this._allowRetries && RetryableHttpVerbs.includes(verb)
                ? this._maxRetries + 1
                : 1;
            let numTries = 0;
            let response;
            do {
                response = yield this.requestRaw(info, data);
                // Check if it's an authentication challenge
                if (response &&
                    response.message &&
                    response.message.statusCode === HttpCodes.Unauthorized) {
                    let authenticationHandler;
                    for (const handler of this.handlers) {
                        if (handler.canHandleAuthentication(response)) {
                            authenticationHandler = handler;
                            break;
                        }
                    }
                    if (authenticationHandler) {
                        return authenticationHandler.handleAuthentication(this, info, data);
                    }
                    else {
                        // We have received an unauthorized response but have no handlers to handle it.
                        // Let the response return to the caller.
                        return response;
                    }
                }
                let redirectsRemaining = this._maxRedirects;
                while (response.message.statusCode &&
                    HttpRedirectCodes.includes(response.message.statusCode) &&
                    this._allowRedirects &&
                    redirectsRemaining > 0) {
                    const redirectUrl = response.message.headers['location'];
                    if (!redirectUrl) {
                        // if there's no location to redirect to, we won't
                        break;
                    }
                    const parsedRedirectUrl = new URL(redirectUrl);
                    if (parsedUrl.protocol === 'https:' &&
                        parsedUrl.protocol !== parsedRedirectUrl.protocol &&
                        !this._allowRedirectDowngrade) {
                        throw new Error('Redirect from HTTPS to HTTP protocol. This downgrade is not allowed for security reasons. If you want to allow this behavior, set the allowRedirectDowngrade option to true.');
                    }
                    // we need to finish reading the response before reassigning response
                    // which will leak the open socket.
                    yield response.readBody();
                    // strip authorization header if redirected to a different hostname
                    if (parsedRedirectUrl.hostname !== parsedUrl.hostname) {
                        for (const header in headers) {
                            // header names are case insensitive
                            if (header.toLowerCase() === 'authorization') {
                                delete headers[header];
                            }
                        }
                    }
                    // let's make the request with the new redirectUrl
                    info = this._prepareRequest(verb, parsedRedirectUrl, headers);
                    response = yield this.requestRaw(info, data);
                    redirectsRemaining--;
                }
                if (!response.message.statusCode ||
                    !HttpResponseRetryCodes.includes(response.message.statusCode)) {
                    // If not a retry code, return immediately instead of retrying
                    return response;
                }
                numTries += 1;
                if (numTries < maxTries) {
                    yield response.readBody();
                    yield this._performExponentialBackoff(numTries);
                }
            } while (numTries < maxTries);
            return response;
        });
    }
    /**
     * Needs to be called if keepAlive is set to true in request options.
     */
    dispose() {
        if (this._agent) {
            this._agent.destroy();
        }
        this._disposed = true;
    }
    /**
     * Raw request.
     * @param info
     * @param data
     */
    requestRaw(info, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                function callbackForResult(err, res) {
                    if (err) {
                        reject(err);
                    }
                    else if (!res) {
                        // If `err` is not passed, then `res` must be passed.
                        reject(new Error('Unknown error'));
                    }
                    else {
                        resolve(res);
                    }
                }
                this.requestRawWithCallback(info, data, callbackForResult);
            });
        });
    }
    /**
     * Raw request with callback.
     * @param info
     * @param data
     * @param onResult
     */
    requestRawWithCallback(info, data, onResult) {
        if (typeof data === 'string') {
            if (!info.options.headers) {
                info.options.headers = {};
            }
            info.options.headers['Content-Length'] = Buffer.byteLength(data, 'utf8');
        }
        let callbackCalled = false;
        function handleResult(err, res) {
            if (!callbackCalled) {
                callbackCalled = true;
                onResult(err, res);
            }
        }
        const req = info.httpModule.request(info.options, (msg) => {
            const res = new HttpClientResponse(msg);
            handleResult(undefined, res);
        });
        let socket;
        req.on('socket', sock => {
            socket = sock;
        });
        // If we ever get disconnected, we want the socket to timeout eventually
        req.setTimeout(this._socketTimeout || 3 * 60000, () => {
            if (socket) {
                socket.end();
            }
            handleResult(new Error(`Request timeout: ${info.options.path}`));
        });
        req.on('error', function (err) {
            // err has statusCode property
            // res should have headers
            handleResult(err);
        });
        if (data && typeof data === 'string') {
            req.write(data, 'utf8');
        }
        if (data && typeof data !== 'string') {
            data.on('close', function () {
                req.end();
            });
            data.pipe(req);
        }
        else {
            req.end();
        }
    }
    /**
     * Gets an http agent. This function is useful when you need an http agent that handles
     * routing through a proxy server - depending upon the url and proxy environment variables.
     * @param serverUrl  The server URL where the request will be sent. For example, https://api.github.com
     */
    getAgent(serverUrl) {
        const parsedUrl = new URL(serverUrl);
        return this._getAgent(parsedUrl);
    }
    _prepareRequest(method, requestUrl, headers) {
        const info = {};
        info.parsedUrl = requestUrl;
        const usingSsl = info.parsedUrl.protocol === 'https:';
        info.httpModule = usingSsl ? https : http;
        const defaultPort = usingSsl ? 443 : 80;
        info.options = {};
        info.options.host = info.parsedUrl.hostname;
        info.options.port = info.parsedUrl.port
            ? parseInt(info.parsedUrl.port)
            : defaultPort;
        info.options.path =
            (info.parsedUrl.pathname || '') + (info.parsedUrl.search || '');
        info.options.method = method;
        info.options.headers = this._mergeHeaders(headers);
        if (this.userAgent != null) {
            info.options.headers['user-agent'] = this.userAgent;
        }
        info.options.agent = this._getAgent(info.parsedUrl);
        // gives handlers an opportunity to participate
        if (this.handlers) {
            for (const handler of this.handlers) {
                handler.prepareRequest(info.options);
            }
        }
        return info;
    }
    _mergeHeaders(headers) {
        if (this.requestOptions && this.requestOptions.headers) {
            return Object.assign({}, lowercaseKeys(this.requestOptions.headers), lowercaseKeys(headers || {}));
        }
        return lowercaseKeys(headers || {});
    }
    _getExistingOrDefaultHeader(additionalHeaders, header, _default) {
        let clientHeader;
        if (this.requestOptions && this.requestOptions.headers) {
            clientHeader = lowercaseKeys(this.requestOptions.headers)[header];
        }
        return additionalHeaders[header] || clientHeader || _default;
    }
    _getAgent(parsedUrl) {
        let agent;
        const proxyUrl = pm.getProxyUrl(parsedUrl);
        const useProxy = proxyUrl && proxyUrl.hostname;
        if (this._keepAlive && useProxy) {
            agent = this._proxyAgent;
        }
        if (this._keepAlive && !useProxy) {
            agent = this._agent;
        }
        // if agent is already assigned use that agent.
        if (agent) {
            return agent;
        }
        const usingSsl = parsedUrl.protocol === 'https:';
        let maxSockets = 100;
        if (this.requestOptions) {
            maxSockets = this.requestOptions.maxSockets || http.globalAgent.maxSockets;
        }
        // This is `useProxy` again, but we need to check `proxyURl` directly for TypeScripts's flow analysis.
        if (proxyUrl && proxyUrl.hostname) {
            const agentOptions = {
                maxSockets,
                keepAlive: this._keepAlive,
                proxy: Object.assign(Object.assign({}, ((proxyUrl.username || proxyUrl.password) && {
                    proxyAuth: `${proxyUrl.username}:${proxyUrl.password}`
                })), { host: proxyUrl.hostname, port: proxyUrl.port })
            };
            let tunnelAgent;
            const overHttps = proxyUrl.protocol === 'https:';
            if (usingSsl) {
                tunnelAgent = overHttps ? tunnel.httpsOverHttps : tunnel.httpsOverHttp;
            }
            else {
                tunnelAgent = overHttps ? tunnel.httpOverHttps : tunnel.httpOverHttp;
            }
            agent = tunnelAgent(agentOptions);
            this._proxyAgent = agent;
        }
        // if reusing agent across request and tunneling agent isn't assigned create a new agent
        if (this._keepAlive && !agent) {
            const options = { keepAlive: this._keepAlive, maxSockets };
            agent = usingSsl ? new https.Agent(options) : new http.Agent(options);
            this._agent = agent;
        }
        // if not using private agent and tunnel agent isn't setup then use global agent
        if (!agent) {
            agent = usingSsl ? https.globalAgent : http.globalAgent;
        }
        if (usingSsl && this._ignoreSslError) {
            // we don't want to set NODE_TLS_REJECT_UNAUTHORIZED=0 since that will affect request for entire process
            // http.RequestOptions doesn't expose a way to modify RequestOptions.agent.options
            // we have to cast it to any and change it directly
            agent.options = Object.assign(agent.options || {}, {
                rejectUnauthorized: false
            });
        }
        return agent;
    }
    _performExponentialBackoff(retryNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            retryNumber = Math.min(ExponentialBackoffCeiling, retryNumber);
            const ms = ExponentialBackoffTimeSlice * Math.pow(2, retryNumber);
            return new Promise(resolve => setTimeout(() => resolve(), ms));
        });
    }
    _processResponse(res, options) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const statusCode = res.message.statusCode || 0;
                const response = {
                    statusCode,
                    result: null,
                    headers: {}
                };
                // not found leads to null obj returned
                if (statusCode === HttpCodes.NotFound) {
                    resolve(response);
                }
                // get the result from the body
                function dateTimeDeserializer(key, value) {
                    if (typeof value === 'string') {
                        const a = new Date(value);
                        if (!isNaN(a.valueOf())) {
                            return a;
                        }
                    }
                    return value;
                }
                let obj;
                let contents;
                try {
                    contents = yield res.readBody();
                    if (contents && contents.length > 0) {
                        if (options && options.deserializeDates) {
                            obj = JSON.parse(contents, dateTimeDeserializer);
                        }
                        else {
                            obj = JSON.parse(contents);
                        }
                        response.result = obj;
                    }
                    response.headers = res.message.headers;
                }
                catch (err) {
                    // Invalid resource (contents not json);  leaving result obj null
                }
                // note that 3xx redirects are handled by the http layer.
                if (statusCode > 299) {
                    let msg;
                    // if exception/error in body, attempt to get better error
                    if (obj && obj.message) {
                        msg = obj.message;
                    }
                    else if (contents && contents.length > 0) {
                        // it may be the case that the exception is in the body message as string
                        msg = contents;
                    }
                    else {
                        msg = `Failed request: (${statusCode})`;
                    }
                    const err = new HttpClientError(msg, statusCode);
                    err.result = response.result;
                    reject(err);
                }
                else {
                    resolve(response);
                }
            }));
        });
    }
}
exports.HttpClient = HttpClient;
const lowercaseKeys = (obj) => Object.keys(obj).reduce((c, k) => ((c[k.toLowerCase()] = obj[k]), c), {});
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 9835:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.checkBypass = exports.getProxyUrl = void 0;
function getProxyUrl(reqUrl) {
    const usingSsl = reqUrl.protocol === 'https:';
    if (checkBypass(reqUrl)) {
        return undefined;
    }
    const proxyVar = (() => {
        if (usingSsl) {
            return process.env['https_proxy'] || process.env['HTTPS_PROXY'];
        }
        else {
            return process.env['http_proxy'] || process.env['HTTP_PROXY'];
        }
    })();
    if (proxyVar) {
        return new URL(proxyVar);
    }
    else {
        return undefined;
    }
}
exports.getProxyUrl = getProxyUrl;
function checkBypass(reqUrl) {
    if (!reqUrl.hostname) {
        return false;
    }
    const reqHost = reqUrl.hostname;
    if (isLoopbackAddress(reqHost)) {
        return true;
    }
    const noProxy = process.env['no_proxy'] || process.env['NO_PROXY'] || '';
    if (!noProxy) {
        return false;
    }
    // Determine the request port
    let reqPort;
    if (reqUrl.port) {
        reqPort = Number(reqUrl.port);
    }
    else if (reqUrl.protocol === 'http:') {
        reqPort = 80;
    }
    else if (reqUrl.protocol === 'https:') {
        reqPort = 443;
    }
    // Format the request hostname and hostname with port
    const upperReqHosts = [reqUrl.hostname.toUpperCase()];
    if (typeof reqPort === 'number') {
        upperReqHosts.push(`${upperReqHosts[0]}:${reqPort}`);
    }
    // Compare request host against noproxy
    for (const upperNoProxyItem of noProxy
        .split(',')
        .map(x => x.trim().toUpperCase())
        .filter(x => x)) {
        if (upperNoProxyItem === '*' ||
            upperReqHosts.some(x => x === upperNoProxyItem ||
                x.endsWith(`.${upperNoProxyItem}`) ||
                (upperNoProxyItem.startsWith('.') &&
                    x.endsWith(`${upperNoProxyItem}`)))) {
            return true;
        }
    }
    return false;
}
exports.checkBypass = checkBypass;
function isLoopbackAddress(host) {
    const hostLower = host.toLowerCase();
    return (hostLower === 'localhost' ||
        hostLower.startsWith('127.') ||
        hostLower.startsWith('[::1]') ||
        hostLower.startsWith('[0:0:0:0:0:0:0:1]'));
}
//# sourceMappingURL=proxy.js.map

/***/ }),

/***/ 3040:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.output = exports.exists = exports.hash = exports.bytes = exports.bool = exports.number = void 0;
function number(n) {
    if (!Number.isSafeInteger(n) || n < 0)
        throw new Error(`Wrong positive integer: ${n}`);
}
exports.number = number;
function bool(b) {
    if (typeof b !== 'boolean')
        throw new Error(`Expected boolean, not ${b}`);
}
exports.bool = bool;
function bytes(b, ...lengths) {
    if (!(b instanceof Uint8Array))
        throw new TypeError('Expected Uint8Array');
    if (lengths.length > 0 && !lengths.includes(b.length))
        throw new TypeError(`Expected Uint8Array of length ${lengths}, not of length=${b.length}`);
}
exports.bytes = bytes;
function hash(hash) {
    if (typeof hash !== 'function' || typeof hash.create !== 'function')
        throw new Error('Hash should be wrapped by utils.wrapConstructor');
    number(hash.outputLen);
    number(hash.blockLen);
}
exports.hash = hash;
function exists(instance, checkFinished = true) {
    if (instance.destroyed)
        throw new Error('Hash instance has been destroyed');
    if (checkFinished && instance.finished)
        throw new Error('Hash#digest() has already been called');
}
exports.exists = exists;
function output(out, instance) {
    bytes(out);
    const min = instance.outputLen;
    if (out.length < min) {
        throw new Error(`digestInto() expects output buffer of length at least ${min}`);
    }
}
exports.output = output;
const assert = {
    number,
    bool,
    bytes,
    hash,
    exists,
    output,
};
exports["default"] = assert;
//# sourceMappingURL=_assert.js.map

/***/ }),

/***/ 4919:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SHA2 = void 0;
const _assert_js_1 = __nccwpck_require__(3040);
const utils_js_1 = __nccwpck_require__(6161);
// Polyfill for Safari 14
function setBigUint64(view, byteOffset, value, isLE) {
    if (typeof view.setBigUint64 === 'function')
        return view.setBigUint64(byteOffset, value, isLE);
    const _32n = BigInt(32);
    const _u32_max = BigInt(0xffffffff);
    const wh = Number((value >> _32n) & _u32_max);
    const wl = Number(value & _u32_max);
    const h = isLE ? 4 : 0;
    const l = isLE ? 0 : 4;
    view.setUint32(byteOffset + h, wh, isLE);
    view.setUint32(byteOffset + l, wl, isLE);
}
// Base SHA2 class (RFC 6234)
class SHA2 extends utils_js_1.Hash {
    constructor(blockLen, outputLen, padOffset, isLE) {
        super();
        this.blockLen = blockLen;
        this.outputLen = outputLen;
        this.padOffset = padOffset;
        this.isLE = isLE;
        this.finished = false;
        this.length = 0;
        this.pos = 0;
        this.destroyed = false;
        this.buffer = new Uint8Array(blockLen);
        this.view = (0, utils_js_1.createView)(this.buffer);
    }
    update(data) {
        _assert_js_1.default.exists(this);
        const { view, buffer, blockLen } = this;
        data = (0, utils_js_1.toBytes)(data);
        const len = data.length;
        for (let pos = 0; pos < len;) {
            const take = Math.min(blockLen - this.pos, len - pos);
            // Fast path: we have at least one block in input, cast it to view and process
            if (take === blockLen) {
                const dataView = (0, utils_js_1.createView)(data);
                for (; blockLen <= len - pos; pos += blockLen)
                    this.process(dataView, pos);
                continue;
            }
            buffer.set(data.subarray(pos, pos + take), this.pos);
            this.pos += take;
            pos += take;
            if (this.pos === blockLen) {
                this.process(view, 0);
                this.pos = 0;
            }
        }
        this.length += data.length;
        this.roundClean();
        return this;
    }
    digestInto(out) {
        _assert_js_1.default.exists(this);
        _assert_js_1.default.output(out, this);
        this.finished = true;
        // Padding
        // We can avoid allocation of buffer for padding completely if it
        // was previously not allocated here. But it won't change performance.
        const { buffer, view, blockLen, isLE } = this;
        let { pos } = this;
        // append the bit '1' to the message
        buffer[pos++] = 0b10000000;
        this.buffer.subarray(pos).fill(0);
        // we have less than padOffset left in buffer, so we cannot put length in current block, need process it and pad again
        if (this.padOffset > blockLen - pos) {
            this.process(view, 0);
            pos = 0;
        }
        // Pad until full block byte with zeros
        for (let i = pos; i < blockLen; i++)
            buffer[i] = 0;
        // Note: sha512 requires length to be 128bit integer, but length in JS will overflow before that
        // You need to write around 2 exabytes (u64_max / 8 / (1024**6)) for this to happen.
        // So we just write lowest 64 bits of that value.
        setBigUint64(view, blockLen - 8, BigInt(this.length * 8), isLE);
        this.process(view, 0);
        const oview = (0, utils_js_1.createView)(out);
        const len = this.outputLen;
        // NOTE: we do division by 4 later, which should be fused in single op with modulo by JIT
        if (len % 4)
            throw new Error('_sha2: outputLen should be aligned to 32bit');
        const outLen = len / 4;
        const state = this.get();
        if (outLen > state.length)
            throw new Error('_sha2: outputLen bigger than state');
        for (let i = 0; i < outLen; i++)
            oview.setUint32(4 * i, state[i], isLE);
    }
    digest() {
        const { buffer, outputLen } = this;
        this.digestInto(buffer);
        const res = buffer.slice(0, outputLen);
        this.destroy();
        return res;
    }
    _cloneInto(to) {
        to || (to = new this.constructor());
        to.set(...this.get());
        const { blockLen, buffer, length, finished, destroyed, pos } = this;
        to.length = length;
        to.pos = pos;
        to.finished = finished;
        to.destroyed = destroyed;
        if (length % blockLen)
            to.buffer.set(buffer);
        return to;
    }
}
exports.SHA2 = SHA2;
//# sourceMappingURL=_sha2.js.map

/***/ }),

/***/ 7155:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.add = exports.toBig = exports.split = exports.fromBig = void 0;
const U32_MASK64 = BigInt(2 ** 32 - 1);
const _32n = BigInt(32);
// We are not using BigUint64Array, because they are extremely slow as per 2022
function fromBig(n, le = false) {
    if (le)
        return { h: Number(n & U32_MASK64), l: Number((n >> _32n) & U32_MASK64) };
    return { h: Number((n >> _32n) & U32_MASK64) | 0, l: Number(n & U32_MASK64) | 0 };
}
exports.fromBig = fromBig;
function split(lst, le = false) {
    let Ah = new Uint32Array(lst.length);
    let Al = new Uint32Array(lst.length);
    for (let i = 0; i < lst.length; i++) {
        const { h, l } = fromBig(lst[i], le);
        [Ah[i], Al[i]] = [h, l];
    }
    return [Ah, Al];
}
exports.split = split;
const toBig = (h, l) => (BigInt(h >>> 0) << _32n) | BigInt(l >>> 0);
exports.toBig = toBig;
// for Shift in [0, 32)
const shrSH = (h, l, s) => h >>> s;
const shrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in [1, 32)
const rotrSH = (h, l, s) => (h >>> s) | (l << (32 - s));
const rotrSL = (h, l, s) => (h << (32 - s)) | (l >>> s);
// Right rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotrBH = (h, l, s) => (h << (64 - s)) | (l >>> (s - 32));
const rotrBL = (h, l, s) => (h >>> (s - 32)) | (l << (64 - s));
// Right rotate for shift===32 (just swaps l&h)
const rotr32H = (h, l) => l;
const rotr32L = (h, l) => h;
// Left rotate for Shift in [1, 32)
const rotlSH = (h, l, s) => (h << s) | (l >>> (32 - s));
const rotlSL = (h, l, s) => (l << s) | (h >>> (32 - s));
// Left rotate for Shift in (32, 64), NOTE: 32 is special case.
const rotlBH = (h, l, s) => (l << (s - 32)) | (h >>> (64 - s));
const rotlBL = (h, l, s) => (h << (s - 32)) | (l >>> (64 - s));
// JS uses 32-bit signed integers for bitwise operations which means we cannot
// simple take carry out of low bit sum by shift, we need to use division.
// Removing "export" has 5% perf penalty -_-
function add(Ah, Al, Bh, Bl) {
    const l = (Al >>> 0) + (Bl >>> 0);
    return { h: (Ah + Bh + ((l / 2 ** 32) | 0)) | 0, l: l | 0 };
}
exports.add = add;
// Addition with more than 2 elements
const add3L = (Al, Bl, Cl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0);
const add3H = (low, Ah, Bh, Ch) => (Ah + Bh + Ch + ((low / 2 ** 32) | 0)) | 0;
const add4L = (Al, Bl, Cl, Dl) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0);
const add4H = (low, Ah, Bh, Ch, Dh) => (Ah + Bh + Ch + Dh + ((low / 2 ** 32) | 0)) | 0;
const add5L = (Al, Bl, Cl, Dl, El) => (Al >>> 0) + (Bl >>> 0) + (Cl >>> 0) + (Dl >>> 0) + (El >>> 0);
const add5H = (low, Ah, Bh, Ch, Dh, Eh) => (Ah + Bh + Ch + Dh + Eh + ((low / 2 ** 32) | 0)) | 0;
// prettier-ignore
const u64 = {
    fromBig, split, toBig: exports.toBig,
    shrSH, shrSL,
    rotrSH, rotrSL, rotrBH, rotrBL,
    rotr32H, rotr32L,
    rotlSH, rotlSL, rotlBH, rotlBL,
    add, add3L, add3H, add4L, add4H, add5H, add5L,
};
exports["default"] = u64;
//# sourceMappingURL=_u64.js.map

/***/ }),

/***/ 1116:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.crypto = void 0;
const nodeCrypto = __nccwpck_require__(6113);
exports.crypto = {
    node: nodeCrypto,
    web: undefined,
};
//# sourceMappingURL=crypto.js.map

/***/ }),

/***/ 9149:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hmac = void 0;
const _assert_js_1 = __nccwpck_require__(3040);
const utils_js_1 = __nccwpck_require__(6161);
// HMAC (RFC 2104)
class HMAC extends utils_js_1.Hash {
    constructor(hash, _key) {
        super();
        this.finished = false;
        this.destroyed = false;
        _assert_js_1.default.hash(hash);
        const key = (0, utils_js_1.toBytes)(_key);
        this.iHash = hash.create();
        if (typeof this.iHash.update !== 'function')
            throw new TypeError('Expected instance of class which extends utils.Hash');
        this.blockLen = this.iHash.blockLen;
        this.outputLen = this.iHash.outputLen;
        const blockLen = this.blockLen;
        const pad = new Uint8Array(blockLen);
        // blockLen can be bigger than outputLen
        pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36;
        this.iHash.update(pad);
        // By doing update (processing of first block) of outer hash here we can re-use it between multiple calls via clone
        this.oHash = hash.create();
        // Undo internal XOR && apply outer XOR
        for (let i = 0; i < pad.length; i++)
            pad[i] ^= 0x36 ^ 0x5c;
        this.oHash.update(pad);
        pad.fill(0);
    }
    update(buf) {
        _assert_js_1.default.exists(this);
        this.iHash.update(buf);
        return this;
    }
    digestInto(out) {
        _assert_js_1.default.exists(this);
        _assert_js_1.default.bytes(out, this.outputLen);
        this.finished = true;
        this.iHash.digestInto(out);
        this.oHash.update(out);
        this.oHash.digestInto(out);
        this.destroy();
    }
    digest() {
        const out = new Uint8Array(this.oHash.outputLen);
        this.digestInto(out);
        return out;
    }
    _cloneInto(to) {
        // Create new instance without calling constructor since key already in state and we don't know it.
        to || (to = Object.create(Object.getPrototypeOf(this), {}));
        const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
        to = to;
        to.finished = finished;
        to.destroyed = destroyed;
        to.blockLen = blockLen;
        to.outputLen = outputLen;
        to.oHash = oHash._cloneInto(to.oHash);
        to.iHash = iHash._cloneInto(to.iHash);
        return to;
    }
    destroy() {
        this.destroyed = true;
        this.oHash.destroy();
        this.iHash.destroy();
    }
}
/**
 * HMAC: RFC2104 message authentication code.
 * @param hash - function that would be used e.g. sha256
 * @param key - message key
 * @param message - message data
 */
const hmac = (hash, key, message) => new HMAC(hash, key).update(message).digest();
exports.hmac = hmac;
exports.hmac.create = (hash, key) => new HMAC(hash, key);
//# sourceMappingURL=hmac.js.map

/***/ }),

/***/ 5058:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.pbkdf2Async = exports.pbkdf2 = void 0;
const _assert_js_1 = __nccwpck_require__(3040);
const hmac_js_1 = __nccwpck_require__(9149);
const utils_js_1 = __nccwpck_require__(6161);
// Common prologue and epilogue for sync/async functions
function pbkdf2Init(hash, _password, _salt, _opts) {
    _assert_js_1.default.hash(hash);
    const opts = (0, utils_js_1.checkOpts)({ dkLen: 32, asyncTick: 10 }, _opts);
    const { c, dkLen, asyncTick } = opts;
    _assert_js_1.default.number(c);
    _assert_js_1.default.number(dkLen);
    _assert_js_1.default.number(asyncTick);
    if (c < 1)
        throw new Error('PBKDF2: iterations (c) should be >= 1');
    const password = (0, utils_js_1.toBytes)(_password);
    const salt = (0, utils_js_1.toBytes)(_salt);
    // DK = PBKDF2(PRF, Password, Salt, c, dkLen);
    const DK = new Uint8Array(dkLen);
    // U1 = PRF(Password, Salt + INT_32_BE(i))
    const PRF = hmac_js_1.hmac.create(hash, password);
    const PRFSalt = PRF._cloneInto().update(salt);
    return { c, dkLen, asyncTick, DK, PRF, PRFSalt };
}
function pbkdf2Output(PRF, PRFSalt, DK, prfW, u) {
    PRF.destroy();
    PRFSalt.destroy();
    if (prfW)
        prfW.destroy();
    u.fill(0);
    return DK;
}
/**
 * PBKDF2-HMAC: RFC 2898 key derivation function
 * @param hash - hash function that would be used e.g. sha256
 * @param password - password from which a derived key is generated
 * @param salt - cryptographic salt
 * @param opts - {c, dkLen} where c is work factor and dkLen is output message size
 */
function pbkdf2(hash, password, salt, opts) {
    const { c, dkLen, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = (0, utils_js_1.createView)(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ⋯ + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        for (let ui = 1; ui < c; ui++) {
            // Uc = PRF(Password, Uc−1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        }
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
exports.pbkdf2 = pbkdf2;
async function pbkdf2Async(hash, password, salt, opts) {
    const { c, dkLen, asyncTick, DK, PRF, PRFSalt } = pbkdf2Init(hash, password, salt, opts);
    let prfW; // Working copy
    const arr = new Uint8Array(4);
    const view = (0, utils_js_1.createView)(arr);
    const u = new Uint8Array(PRF.outputLen);
    // DK = T1 + T2 + ⋯ + Tdklen/hlen
    for (let ti = 1, pos = 0; pos < dkLen; ti++, pos += PRF.outputLen) {
        // Ti = F(Password, Salt, c, i)
        const Ti = DK.subarray(pos, pos + PRF.outputLen);
        view.setInt32(0, ti, false);
        // F(Password, Salt, c, i) = U1 ^ U2 ^ ⋯ ^ Uc
        // U1 = PRF(Password, Salt + INT_32_BE(i))
        (prfW = PRFSalt._cloneInto(prfW)).update(arr).digestInto(u);
        Ti.set(u.subarray(0, Ti.length));
        await (0, utils_js_1.asyncLoop)(c - 1, asyncTick, (i) => {
            // Uc = PRF(Password, Uc−1)
            PRF._cloneInto(prfW).update(u).digestInto(u);
            for (let i = 0; i < Ti.length; i++)
                Ti[i] ^= u[i];
        });
    }
    return pbkdf2Output(PRF, PRFSalt, DK, prfW, u);
}
exports.pbkdf2Async = pbkdf2Async;
//# sourceMappingURL=pbkdf2.js.map

/***/ }),

/***/ 8369:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ripemd160 = exports.RIPEMD160 = void 0;
const _sha2_js_1 = __nccwpck_require__(4919);
const utils_js_1 = __nccwpck_require__(6161);
// https://homes.esat.kuleuven.be/~bosselae/ripemd160.html
// https://homes.esat.kuleuven.be/~bosselae/ripemd160/pdf/AB-9601/AB-9601.pdf
const Rho = new Uint8Array([7, 4, 13, 1, 10, 6, 15, 3, 12, 0, 9, 5, 2, 14, 11, 8]);
const Id = Uint8Array.from({ length: 16 }, (_, i) => i);
const Pi = Id.map((i) => (9 * i + 5) % 16);
let idxL = [Id];
let idxR = [Pi];
for (let i = 0; i < 4; i++)
    for (let j of [idxL, idxR])
        j.push(j[i].map((k) => Rho[k]));
const shifts = [
    [11, 14, 15, 12, 5, 8, 7, 9, 11, 13, 14, 15, 6, 7, 9, 8],
    [12, 13, 11, 15, 6, 9, 9, 7, 12, 15, 11, 13, 7, 8, 7, 7],
    [13, 15, 14, 11, 7, 7, 6, 8, 13, 14, 13, 12, 5, 5, 6, 9],
    [14, 11, 12, 14, 8, 6, 5, 5, 15, 12, 15, 14, 9, 9, 8, 6],
    [15, 12, 13, 13, 9, 5, 8, 6, 14, 11, 12, 11, 8, 6, 5, 5],
].map((i) => new Uint8Array(i));
const shiftsL = idxL.map((idx, i) => idx.map((j) => shifts[i][j]));
const shiftsR = idxR.map((idx, i) => idx.map((j) => shifts[i][j]));
const Kl = new Uint32Array([0x00000000, 0x5a827999, 0x6ed9eba1, 0x8f1bbcdc, 0xa953fd4e]);
const Kr = new Uint32Array([0x50a28be6, 0x5c4dd124, 0x6d703ef3, 0x7a6d76e9, 0x00000000]);
// The rotate left (circular left shift) operation for uint32
const rotl = (word, shift) => (word << shift) | (word >>> (32 - shift));
// It's called f() in spec.
function f(group, x, y, z) {
    if (group === 0)
        return x ^ y ^ z;
    else if (group === 1)
        return (x & y) | (~x & z);
    else if (group === 2)
        return (x | ~y) ^ z;
    else if (group === 3)
        return (x & z) | (y & ~z);
    else
        return x ^ (y | ~z);
}
// Temporary buffer, not used to store anything between runs
const BUF = new Uint32Array(16);
class RIPEMD160 extends _sha2_js_1.SHA2 {
    constructor() {
        super(64, 20, 8, true);
        this.h0 = 0x67452301 | 0;
        this.h1 = 0xefcdab89 | 0;
        this.h2 = 0x98badcfe | 0;
        this.h3 = 0x10325476 | 0;
        this.h4 = 0xc3d2e1f0 | 0;
    }
    get() {
        const { h0, h1, h2, h3, h4 } = this;
        return [h0, h1, h2, h3, h4];
    }
    set(h0, h1, h2, h3, h4) {
        this.h0 = h0 | 0;
        this.h1 = h1 | 0;
        this.h2 = h2 | 0;
        this.h3 = h3 | 0;
        this.h4 = h4 | 0;
    }
    process(view, offset) {
        for (let i = 0; i < 16; i++, offset += 4)
            BUF[i] = view.getUint32(offset, true);
        // prettier-ignore
        let al = this.h0 | 0, ar = al, bl = this.h1 | 0, br = bl, cl = this.h2 | 0, cr = cl, dl = this.h3 | 0, dr = dl, el = this.h4 | 0, er = el;
        // Instead of iterating 0 to 80, we split it into 5 groups
        // And use the groups in constants, functions, etc. Much simpler
        for (let group = 0; group < 5; group++) {
            const rGroup = 4 - group;
            const hbl = Kl[group], hbr = Kr[group]; // prettier-ignore
            const rl = idxL[group], rr = idxR[group]; // prettier-ignore
            const sl = shiftsL[group], sr = shiftsR[group]; // prettier-ignore
            for (let i = 0; i < 16; i++) {
                const tl = (rotl(al + f(group, bl, cl, dl) + BUF[rl[i]] + hbl, sl[i]) + el) | 0;
                al = el, el = dl, dl = rotl(cl, 10) | 0, cl = bl, bl = tl; // prettier-ignore
            }
            // 2 loops are 10% faster
            for (let i = 0; i < 16; i++) {
                const tr = (rotl(ar + f(rGroup, br, cr, dr) + BUF[rr[i]] + hbr, sr[i]) + er) | 0;
                ar = er, er = dr, dr = rotl(cr, 10) | 0, cr = br, br = tr; // prettier-ignore
            }
        }
        // Add the compressed chunk to the current hash value
        this.set((this.h1 + cl + dr) | 0, (this.h2 + dl + er) | 0, (this.h3 + el + ar) | 0, (this.h4 + al + br) | 0, (this.h0 + bl + cr) | 0);
    }
    roundClean() {
        BUF.fill(0);
    }
    destroy() {
        this.destroyed = true;
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0);
    }
}
exports.RIPEMD160 = RIPEMD160;
/**
 * RIPEMD-160 - a hash function from 1990s.
 * @param message - msg that would be hashed
 */
exports.ripemd160 = (0, utils_js_1.wrapConstructor)(() => new RIPEMD160());
//# sourceMappingURL=ripemd160.js.map

/***/ }),

/***/ 708:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sha224 = exports.sha256 = void 0;
const _sha2_js_1 = __nccwpck_require__(4919);
const utils_js_1 = __nccwpck_require__(6161);
// Choice: a ? b : c
const Chi = (a, b, c) => (a & b) ^ (~a & c);
// Majority function, true if any two inpust is true
const Maj = (a, b, c) => (a & b) ^ (a & c) ^ (b & c);
// Round constants:
// first 32 bits of the fractional parts of the cube roots of the first 64 primes 2..311)
// prettier-ignore
const SHA256_K = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
]);
// Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
// prettier-ignore
const IV = new Uint32Array([
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
]);
// Temporary buffer, not used to store anything between runs
// Named this way because it matches specification.
const SHA256_W = new Uint32Array(64);
class SHA256 extends _sha2_js_1.SHA2 {
    constructor() {
        super(64, 32, 8, false);
        // We cannot use array here since array allows indexing by variable
        // which means optimizer/compiler cannot use registers.
        this.A = IV[0] | 0;
        this.B = IV[1] | 0;
        this.C = IV[2] | 0;
        this.D = IV[3] | 0;
        this.E = IV[4] | 0;
        this.F = IV[5] | 0;
        this.G = IV[6] | 0;
        this.H = IV[7] | 0;
    }
    get() {
        const { A, B, C, D, E, F, G, H } = this;
        return [A, B, C, D, E, F, G, H];
    }
    // prettier-ignore
    set(A, B, C, D, E, F, G, H) {
        this.A = A | 0;
        this.B = B | 0;
        this.C = C | 0;
        this.D = D | 0;
        this.E = E | 0;
        this.F = F | 0;
        this.G = G | 0;
        this.H = H | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 48 words w[16..63] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4)
            SHA256_W[i] = view.getUint32(offset, false);
        for (let i = 16; i < 64; i++) {
            const W15 = SHA256_W[i - 15];
            const W2 = SHA256_W[i - 2];
            const s0 = (0, utils_js_1.rotr)(W15, 7) ^ (0, utils_js_1.rotr)(W15, 18) ^ (W15 >>> 3);
            const s1 = (0, utils_js_1.rotr)(W2, 17) ^ (0, utils_js_1.rotr)(W2, 19) ^ (W2 >>> 10);
            SHA256_W[i] = (s1 + SHA256_W[i - 7] + s0 + SHA256_W[i - 16]) | 0;
        }
        // Compression function main loop, 64 rounds
        let { A, B, C, D, E, F, G, H } = this;
        for (let i = 0; i < 64; i++) {
            const sigma1 = (0, utils_js_1.rotr)(E, 6) ^ (0, utils_js_1.rotr)(E, 11) ^ (0, utils_js_1.rotr)(E, 25);
            const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const sigma0 = (0, utils_js_1.rotr)(A, 2) ^ (0, utils_js_1.rotr)(A, 13) ^ (0, utils_js_1.rotr)(A, 22);
            const T2 = (sigma0 + Maj(A, B, C)) | 0;
            H = G;
            G = F;
            F = E;
            E = (D + T1) | 0;
            D = C;
            C = B;
            B = A;
            A = (T1 + T2) | 0;
        }
        // Add the compressed chunk to the current hash value
        A = (A + this.A) | 0;
        B = (B + this.B) | 0;
        C = (C + this.C) | 0;
        D = (D + this.D) | 0;
        E = (E + this.E) | 0;
        F = (F + this.F) | 0;
        G = (G + this.G) | 0;
        H = (H + this.H) | 0;
        this.set(A, B, C, D, E, F, G, H);
    }
    roundClean() {
        SHA256_W.fill(0);
    }
    destroy() {
        this.set(0, 0, 0, 0, 0, 0, 0, 0);
        this.buffer.fill(0);
    }
}
// Constants from https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf
class SHA224 extends SHA256 {
    constructor() {
        super();
        this.A = 0xc1059ed8 | 0;
        this.B = 0x367cd507 | 0;
        this.C = 0x3070dd17 | 0;
        this.D = 0xf70e5939 | 0;
        this.E = 0xffc00b31 | 0;
        this.F = 0x68581511 | 0;
        this.G = 0x64f98fa7 | 0;
        this.H = 0xbefa4fa4 | 0;
        this.outputLen = 28;
    }
}
/**
 * SHA2-256 hash function
 * @param message - data that would be hashed
 */
exports.sha256 = (0, utils_js_1.wrapConstructor)(() => new SHA256());
exports.sha224 = (0, utils_js_1.wrapConstructor)(() => new SHA224());
//# sourceMappingURL=sha256.js.map

/***/ }),

/***/ 5251:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.sha384 = exports.sha512_256 = exports.sha512_224 = exports.sha512 = exports.SHA512 = void 0;
const _sha2_js_1 = __nccwpck_require__(4919);
const _u64_js_1 = __nccwpck_require__(7155);
const utils_js_1 = __nccwpck_require__(6161);
// Round contants (first 32 bits of the fractional parts of the cube roots of the first 80 primes 2..409):
// prettier-ignore
const [SHA512_Kh, SHA512_Kl] = _u64_js_1.default.split([
    '0x428a2f98d728ae22', '0x7137449123ef65cd', '0xb5c0fbcfec4d3b2f', '0xe9b5dba58189dbbc',
    '0x3956c25bf348b538', '0x59f111f1b605d019', '0x923f82a4af194f9b', '0xab1c5ed5da6d8118',
    '0xd807aa98a3030242', '0x12835b0145706fbe', '0x243185be4ee4b28c', '0x550c7dc3d5ffb4e2',
    '0x72be5d74f27b896f', '0x80deb1fe3b1696b1', '0x9bdc06a725c71235', '0xc19bf174cf692694',
    '0xe49b69c19ef14ad2', '0xefbe4786384f25e3', '0x0fc19dc68b8cd5b5', '0x240ca1cc77ac9c65',
    '0x2de92c6f592b0275', '0x4a7484aa6ea6e483', '0x5cb0a9dcbd41fbd4', '0x76f988da831153b5',
    '0x983e5152ee66dfab', '0xa831c66d2db43210', '0xb00327c898fb213f', '0xbf597fc7beef0ee4',
    '0xc6e00bf33da88fc2', '0xd5a79147930aa725', '0x06ca6351e003826f', '0x142929670a0e6e70',
    '0x27b70a8546d22ffc', '0x2e1b21385c26c926', '0x4d2c6dfc5ac42aed', '0x53380d139d95b3df',
    '0x650a73548baf63de', '0x766a0abb3c77b2a8', '0x81c2c92e47edaee6', '0x92722c851482353b',
    '0xa2bfe8a14cf10364', '0xa81a664bbc423001', '0xc24b8b70d0f89791', '0xc76c51a30654be30',
    '0xd192e819d6ef5218', '0xd69906245565a910', '0xf40e35855771202a', '0x106aa07032bbd1b8',
    '0x19a4c116b8d2d0c8', '0x1e376c085141ab53', '0x2748774cdf8eeb99', '0x34b0bcb5e19b48a8',
    '0x391c0cb3c5c95a63', '0x4ed8aa4ae3418acb', '0x5b9cca4f7763e373', '0x682e6ff3d6b2b8a3',
    '0x748f82ee5defb2fc', '0x78a5636f43172f60', '0x84c87814a1f0ab72', '0x8cc702081a6439ec',
    '0x90befffa23631e28', '0xa4506cebde82bde9', '0xbef9a3f7b2c67915', '0xc67178f2e372532b',
    '0xca273eceea26619c', '0xd186b8c721c0c207', '0xeada7dd6cde0eb1e', '0xf57d4f7fee6ed178',
    '0x06f067aa72176fba', '0x0a637dc5a2c898a6', '0x113f9804bef90dae', '0x1b710b35131c471b',
    '0x28db77f523047d84', '0x32caab7b40c72493', '0x3c9ebe0a15c9bebc', '0x431d67c49c100d4c',
    '0x4cc5d4becb3e42b6', '0x597f299cfc657e2a', '0x5fcb6fab3ad6faec', '0x6c44198c4a475817'
].map(n => BigInt(n)));
// Temporary buffer, not used to store anything between runs
const SHA512_W_H = new Uint32Array(80);
const SHA512_W_L = new Uint32Array(80);
class SHA512 extends _sha2_js_1.SHA2 {
    constructor() {
        super(128, 64, 16, false);
        // We cannot use array here since array allows indexing by variable which means optimizer/compiler cannot use registers.
        // Also looks cleaner and easier to verify with spec.
        // Initial state (first 32 bits of the fractional parts of the square roots of the first 8 primes 2..19):
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x6a09e667 | 0;
        this.Al = 0xf3bcc908 | 0;
        this.Bh = 0xbb67ae85 | 0;
        this.Bl = 0x84caa73b | 0;
        this.Ch = 0x3c6ef372 | 0;
        this.Cl = 0xfe94f82b | 0;
        this.Dh = 0xa54ff53a | 0;
        this.Dl = 0x5f1d36f1 | 0;
        this.Eh = 0x510e527f | 0;
        this.El = 0xade682d1 | 0;
        this.Fh = 0x9b05688c | 0;
        this.Fl = 0x2b3e6c1f | 0;
        this.Gh = 0x1f83d9ab | 0;
        this.Gl = 0xfb41bd6b | 0;
        this.Hh = 0x5be0cd19 | 0;
        this.Hl = 0x137e2179 | 0;
    }
    // prettier-ignore
    get() {
        const { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        return [Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl];
    }
    // prettier-ignore
    set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl) {
        this.Ah = Ah | 0;
        this.Al = Al | 0;
        this.Bh = Bh | 0;
        this.Bl = Bl | 0;
        this.Ch = Ch | 0;
        this.Cl = Cl | 0;
        this.Dh = Dh | 0;
        this.Dl = Dl | 0;
        this.Eh = Eh | 0;
        this.El = El | 0;
        this.Fh = Fh | 0;
        this.Fl = Fl | 0;
        this.Gh = Gh | 0;
        this.Gl = Gl | 0;
        this.Hh = Hh | 0;
        this.Hl = Hl | 0;
    }
    process(view, offset) {
        // Extend the first 16 words into the remaining 64 words w[16..79] of the message schedule array
        for (let i = 0; i < 16; i++, offset += 4) {
            SHA512_W_H[i] = view.getUint32(offset);
            SHA512_W_L[i] = view.getUint32((offset += 4));
        }
        for (let i = 16; i < 80; i++) {
            // s0 := (w[i-15] rightrotate 1) xor (w[i-15] rightrotate 8) xor (w[i-15] rightshift 7)
            const W15h = SHA512_W_H[i - 15] | 0;
            const W15l = SHA512_W_L[i - 15] | 0;
            const s0h = _u64_js_1.default.rotrSH(W15h, W15l, 1) ^ _u64_js_1.default.rotrSH(W15h, W15l, 8) ^ _u64_js_1.default.shrSH(W15h, W15l, 7);
            const s0l = _u64_js_1.default.rotrSL(W15h, W15l, 1) ^ _u64_js_1.default.rotrSL(W15h, W15l, 8) ^ _u64_js_1.default.shrSL(W15h, W15l, 7);
            // s1 := (w[i-2] rightrotate 19) xor (w[i-2] rightrotate 61) xor (w[i-2] rightshift 6)
            const W2h = SHA512_W_H[i - 2] | 0;
            const W2l = SHA512_W_L[i - 2] | 0;
            const s1h = _u64_js_1.default.rotrSH(W2h, W2l, 19) ^ _u64_js_1.default.rotrBH(W2h, W2l, 61) ^ _u64_js_1.default.shrSH(W2h, W2l, 6);
            const s1l = _u64_js_1.default.rotrSL(W2h, W2l, 19) ^ _u64_js_1.default.rotrBL(W2h, W2l, 61) ^ _u64_js_1.default.shrSL(W2h, W2l, 6);
            // SHA256_W[i] = s0 + s1 + SHA256_W[i - 7] + SHA256_W[i - 16];
            const SUMl = _u64_js_1.default.add4L(s0l, s1l, SHA512_W_L[i - 7], SHA512_W_L[i - 16]);
            const SUMh = _u64_js_1.default.add4H(SUMl, s0h, s1h, SHA512_W_H[i - 7], SHA512_W_H[i - 16]);
            SHA512_W_H[i] = SUMh | 0;
            SHA512_W_L[i] = SUMl | 0;
        }
        let { Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl } = this;
        // Compression function main loop, 80 rounds
        for (let i = 0; i < 80; i++) {
            // S1 := (e rightrotate 14) xor (e rightrotate 18) xor (e rightrotate 41)
            const sigma1h = _u64_js_1.default.rotrSH(Eh, El, 14) ^ _u64_js_1.default.rotrSH(Eh, El, 18) ^ _u64_js_1.default.rotrBH(Eh, El, 41);
            const sigma1l = _u64_js_1.default.rotrSL(Eh, El, 14) ^ _u64_js_1.default.rotrSL(Eh, El, 18) ^ _u64_js_1.default.rotrBL(Eh, El, 41);
            //const T1 = (H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i]) | 0;
            const CHIh = (Eh & Fh) ^ (~Eh & Gh);
            const CHIl = (El & Fl) ^ (~El & Gl);
            // T1 = H + sigma1 + Chi(E, F, G) + SHA512_K[i] + SHA512_W[i]
            // prettier-ignore
            const T1ll = _u64_js_1.default.add5L(Hl, sigma1l, CHIl, SHA512_Kl[i], SHA512_W_L[i]);
            const T1h = _u64_js_1.default.add5H(T1ll, Hh, sigma1h, CHIh, SHA512_Kh[i], SHA512_W_H[i]);
            const T1l = T1ll | 0;
            // S0 := (a rightrotate 28) xor (a rightrotate 34) xor (a rightrotate 39)
            const sigma0h = _u64_js_1.default.rotrSH(Ah, Al, 28) ^ _u64_js_1.default.rotrBH(Ah, Al, 34) ^ _u64_js_1.default.rotrBH(Ah, Al, 39);
            const sigma0l = _u64_js_1.default.rotrSL(Ah, Al, 28) ^ _u64_js_1.default.rotrBL(Ah, Al, 34) ^ _u64_js_1.default.rotrBL(Ah, Al, 39);
            const MAJh = (Ah & Bh) ^ (Ah & Ch) ^ (Bh & Ch);
            const MAJl = (Al & Bl) ^ (Al & Cl) ^ (Bl & Cl);
            Hh = Gh | 0;
            Hl = Gl | 0;
            Gh = Fh | 0;
            Gl = Fl | 0;
            Fh = Eh | 0;
            Fl = El | 0;
            ({ h: Eh, l: El } = _u64_js_1.default.add(Dh | 0, Dl | 0, T1h | 0, T1l | 0));
            Dh = Ch | 0;
            Dl = Cl | 0;
            Ch = Bh | 0;
            Cl = Bl | 0;
            Bh = Ah | 0;
            Bl = Al | 0;
            const All = _u64_js_1.default.add3L(T1l, sigma0l, MAJl);
            Ah = _u64_js_1.default.add3H(All, T1h, sigma0h, MAJh);
            Al = All | 0;
        }
        // Add the compressed chunk to the current hash value
        ({ h: Ah, l: Al } = _u64_js_1.default.add(this.Ah | 0, this.Al | 0, Ah | 0, Al | 0));
        ({ h: Bh, l: Bl } = _u64_js_1.default.add(this.Bh | 0, this.Bl | 0, Bh | 0, Bl | 0));
        ({ h: Ch, l: Cl } = _u64_js_1.default.add(this.Ch | 0, this.Cl | 0, Ch | 0, Cl | 0));
        ({ h: Dh, l: Dl } = _u64_js_1.default.add(this.Dh | 0, this.Dl | 0, Dh | 0, Dl | 0));
        ({ h: Eh, l: El } = _u64_js_1.default.add(this.Eh | 0, this.El | 0, Eh | 0, El | 0));
        ({ h: Fh, l: Fl } = _u64_js_1.default.add(this.Fh | 0, this.Fl | 0, Fh | 0, Fl | 0));
        ({ h: Gh, l: Gl } = _u64_js_1.default.add(this.Gh | 0, this.Gl | 0, Gh | 0, Gl | 0));
        ({ h: Hh, l: Hl } = _u64_js_1.default.add(this.Hh | 0, this.Hl | 0, Hh | 0, Hl | 0));
        this.set(Ah, Al, Bh, Bl, Ch, Cl, Dh, Dl, Eh, El, Fh, Fl, Gh, Gl, Hh, Hl);
    }
    roundClean() {
        SHA512_W_H.fill(0);
        SHA512_W_L.fill(0);
    }
    destroy() {
        this.buffer.fill(0);
        this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    }
}
exports.SHA512 = SHA512;
class SHA512_224 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x8c3d37c8 | 0;
        this.Al = 0x19544da2 | 0;
        this.Bh = 0x73e19966 | 0;
        this.Bl = 0x89dcd4d6 | 0;
        this.Ch = 0x1dfab7ae | 0;
        this.Cl = 0x32ff9c82 | 0;
        this.Dh = 0x679dd514 | 0;
        this.Dl = 0x582f9fcf | 0;
        this.Eh = 0x0f6d2b69 | 0;
        this.El = 0x7bd44da8 | 0;
        this.Fh = 0x77e36f73 | 0;
        this.Fl = 0x04c48942 | 0;
        this.Gh = 0x3f9d85a8 | 0;
        this.Gl = 0x6a1d36c8 | 0;
        this.Hh = 0x1112e6ad | 0;
        this.Hl = 0x91d692a1 | 0;
        this.outputLen = 28;
    }
}
class SHA512_256 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0x22312194 | 0;
        this.Al = 0xfc2bf72c | 0;
        this.Bh = 0x9f555fa3 | 0;
        this.Bl = 0xc84c64c2 | 0;
        this.Ch = 0x2393b86b | 0;
        this.Cl = 0x6f53b151 | 0;
        this.Dh = 0x96387719 | 0;
        this.Dl = 0x5940eabd | 0;
        this.Eh = 0x96283ee2 | 0;
        this.El = 0xa88effe3 | 0;
        this.Fh = 0xbe5e1e25 | 0;
        this.Fl = 0x53863992 | 0;
        this.Gh = 0x2b0199fc | 0;
        this.Gl = 0x2c85b8aa | 0;
        this.Hh = 0x0eb72ddc | 0;
        this.Hl = 0x81c52ca2 | 0;
        this.outputLen = 32;
    }
}
class SHA384 extends SHA512 {
    constructor() {
        super();
        // h -- high 32 bits, l -- low 32 bits
        this.Ah = 0xcbbb9d5d | 0;
        this.Al = 0xc1059ed8 | 0;
        this.Bh = 0x629a292a | 0;
        this.Bl = 0x367cd507 | 0;
        this.Ch = 0x9159015a | 0;
        this.Cl = 0x3070dd17 | 0;
        this.Dh = 0x152fecd8 | 0;
        this.Dl = 0xf70e5939 | 0;
        this.Eh = 0x67332667 | 0;
        this.El = 0xffc00b31 | 0;
        this.Fh = 0x8eb44a87 | 0;
        this.Fl = 0x68581511 | 0;
        this.Gh = 0xdb0c2e0d | 0;
        this.Gl = 0x64f98fa7 | 0;
        this.Hh = 0x47b5481d | 0;
        this.Hl = 0xbefa4fa4 | 0;
        this.outputLen = 48;
    }
}
exports.sha512 = (0, utils_js_1.wrapConstructor)(() => new SHA512());
exports.sha512_224 = (0, utils_js_1.wrapConstructor)(() => new SHA512_224());
exports.sha512_256 = (0, utils_js_1.wrapConstructor)(() => new SHA512_256());
exports.sha384 = (0, utils_js_1.wrapConstructor)(() => new SHA384());
//# sourceMappingURL=sha512.js.map

/***/ }),

/***/ 6161:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*! noble-hashes - MIT License (c) 2022 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.randomBytes = exports.wrapConstructorWithOpts = exports.wrapConstructor = exports.checkOpts = exports.Hash = exports.concatBytes = exports.toBytes = exports.utf8ToBytes = exports.asyncLoop = exports.nextTick = exports.hexToBytes = exports.bytesToHex = exports.isLE = exports.rotr = exports.createView = exports.u32 = exports.u8 = void 0;
// The import here is via the package name. This is to ensure
// that exports mapping/resolution does fall into place.
const crypto_1 = __nccwpck_require__(1116);
// Cast array to different type
const u8 = (arr) => new Uint8Array(arr.buffer, arr.byteOffset, arr.byteLength);
exports.u8 = u8;
const u32 = (arr) => new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
exports.u32 = u32;
// Cast array to view
const createView = (arr) => new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
exports.createView = createView;
// The rotate right (circular right shift) operation for uint32
const rotr = (word, shift) => (word << (32 - shift)) | (word >>> shift);
exports.rotr = rotr;
exports.isLE = new Uint8Array(new Uint32Array([0x11223344]).buffer)[0] === 0x44;
// There is almost no big endian hardware, but js typed arrays uses platform specific endianness.
// So, just to be sure not to corrupt anything.
if (!exports.isLE)
    throw new Error('Non little-endian hardware is not supported');
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
/**
 * @example bytesToHex(Uint8Array.from([0xde, 0xad, 0xbe, 0xef]))
 */
function bytesToHex(uint8a) {
    // pre-caching improves the speed 6x
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Uint8Array expected');
    let hex = '';
    for (let i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
    }
    return hex;
}
exports.bytesToHex = bytesToHex;
/**
 * @example hexToBytes('deadbeef')
 */
function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
    }
    if (hex.length % 2)
        throw new Error('hexToBytes: received invalid unpadded hex');
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
exports.hexToBytes = hexToBytes;
// There is no setImmediate in browser and setTimeout is slow. However, call to async function will return Promise
// which will be fullfiled only on next scheduler queue processing step and this is exactly what we need.
const nextTick = async () => { };
exports.nextTick = nextTick;
// Returns control to thread each 'tick' ms to avoid blocking
async function asyncLoop(iters, tick, cb) {
    let ts = Date.now();
    for (let i = 0; i < iters; i++) {
        cb(i);
        // Date.now() is not monotonic, so in case if clock goes backwards we return return control too
        const diff = Date.now() - ts;
        if (diff >= 0 && diff < tick)
            continue;
        await (0, exports.nextTick)();
        ts += diff;
    }
}
exports.asyncLoop = asyncLoop;
function utf8ToBytes(str) {
    if (typeof str !== 'string') {
        throw new TypeError(`utf8ToBytes expected string, got ${typeof str}`);
    }
    return new TextEncoder().encode(str);
}
exports.utf8ToBytes = utf8ToBytes;
function toBytes(data) {
    if (typeof data === 'string')
        data = utf8ToBytes(data);
    if (!(data instanceof Uint8Array))
        throw new TypeError(`Expected input type is Uint8Array (got ${typeof data})`);
    return data;
}
exports.toBytes = toBytes;
/**
 * Concats Uint8Array-s into one; like `Buffer.concat([buf1, buf2])`
 * @example concatBytes(buf1, buf2)
 */
function concatBytes(...arrays) {
    if (!arrays.every((a) => a instanceof Uint8Array))
        throw new Error('Uint8Array list expected');
    if (arrays.length === 1)
        return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
    }
    return result;
}
exports.concatBytes = concatBytes;
// For runtime check if class implements interface
class Hash {
    // Safe version that clones internal state
    clone() {
        return this._cloneInto();
    }
}
exports.Hash = Hash;
// Check if object doens't have custom constructor (like Uint8Array/Array)
const isPlainObject = (obj) => Object.prototype.toString.call(obj) === '[object Object]' && obj.constructor === Object;
function checkOpts(defaults, opts) {
    if (opts !== undefined && (typeof opts !== 'object' || !isPlainObject(opts)))
        throw new TypeError('Options should be object or undefined');
    const merged = Object.assign(defaults, opts);
    return merged;
}
exports.checkOpts = checkOpts;
function wrapConstructor(hashConstructor) {
    const hashC = (message) => hashConstructor().update(toBytes(message)).digest();
    const tmp = hashConstructor();
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = () => hashConstructor();
    return hashC;
}
exports.wrapConstructor = wrapConstructor;
function wrapConstructorWithOpts(hashCons) {
    const hashC = (msg, opts) => hashCons(opts).update(toBytes(msg)).digest();
    const tmp = hashCons({});
    hashC.outputLen = tmp.outputLen;
    hashC.blockLen = tmp.blockLen;
    hashC.create = (opts) => hashCons(opts);
    return hashC;
}
exports.wrapConstructorWithOpts = wrapConstructorWithOpts;
/**
 * Secure PRNG
 */
function randomBytes(bytesLength = 32) {
    if (crypto_1.crypto.web) {
        return crypto_1.crypto.web.getRandomValues(new Uint8Array(bytesLength));
    }
    else if (crypto_1.crypto.node) {
        return new Uint8Array(crypto_1.crypto.node.randomBytes(bytesLength).buffer);
    }
    else {
        throw new Error("The environment doesn't have randomBytes function");
    }
}
exports.randomBytes = randomBytes;
//# sourceMappingURL=utils.js.map

/***/ }),

/***/ 451:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

/*! noble-secp256k1 - MIT License (c) 2019 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.utils = exports.schnorr = exports.verify = exports.signSync = exports.sign = exports.getSharedSecret = exports.recoverPublicKey = exports.getPublicKey = exports.Signature = exports.Point = exports.CURVE = void 0;
const nodeCrypto = __nccwpck_require__(6113);
const _0n = BigInt(0);
const _1n = BigInt(1);
const _2n = BigInt(2);
const _3n = BigInt(3);
const _8n = BigInt(8);
const CURVE = Object.freeze({
    a: _0n,
    b: BigInt(7),
    P: BigInt('0xfffffffffffffffffffffffffffffffffffffffffffffffffffffffefffffc2f'),
    n: BigInt('0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141'),
    h: _1n,
    Gx: BigInt('55066263022277343669578718895168534326250603453777594175500187360389116729240'),
    Gy: BigInt('32670510020758816978083085130507043184471273380659243275938904335757337482424'),
    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
});
exports.CURVE = CURVE;
const divNearest = (a, b) => (a + b / _2n) / b;
const endo = {
    beta: BigInt('0x7ae96a2b657c07106e64479eac3434e99cf0497512f58995c1396c28719501ee'),
    splitScalar(k) {
        const { n } = CURVE;
        const a1 = BigInt('0x3086d221a7d46bcde86c90e49284eb15');
        const b1 = -_1n * BigInt('0xe4437ed6010e88286f547fa90abfe4c3');
        const a2 = BigInt('0x114ca50f7a8e2f3f657c1108d9d44cfd8');
        const b2 = a1;
        const POW_2_128 = BigInt('0x100000000000000000000000000000000');
        const c1 = divNearest(b2 * k, n);
        const c2 = divNearest(-b1 * k, n);
        let k1 = mod(k - c1 * a1 - c2 * a2, n);
        let k2 = mod(-c1 * b1 - c2 * b2, n);
        const k1neg = k1 > POW_2_128;
        const k2neg = k2 > POW_2_128;
        if (k1neg)
            k1 = n - k1;
        if (k2neg)
            k2 = n - k2;
        if (k1 > POW_2_128 || k2 > POW_2_128) {
            throw new Error('splitScalarEndo: Endomorphism failed, k=' + k);
        }
        return { k1neg, k1, k2neg, k2 };
    },
};
const fieldLen = 32;
const groupLen = 32;
const hashLen = 32;
const compressedLen = fieldLen + 1;
const uncompressedLen = 2 * fieldLen + 1;
function weierstrass(x) {
    const { a, b } = CURVE;
    const x2 = mod(x * x);
    const x3 = mod(x2 * x);
    return mod(x3 + a * x + b);
}
const USE_ENDOMORPHISM = CURVE.a === _0n;
class ShaError extends Error {
    constructor(message) {
        super(message);
    }
}
function assertJacPoint(other) {
    if (!(other instanceof JacobianPoint))
        throw new TypeError('JacobianPoint expected');
}
class JacobianPoint {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    static fromAffine(p) {
        if (!(p instanceof Point)) {
            throw new TypeError('JacobianPoint#fromAffine: expected Point');
        }
        if (p.equals(Point.ZERO))
            return JacobianPoint.ZERO;
        return new JacobianPoint(p.x, p.y, _1n);
    }
    static toAffineBatch(points) {
        const toInv = invertBatch(points.map((p) => p.z));
        return points.map((p, i) => p.toAffine(toInv[i]));
    }
    static normalizeZ(points) {
        return JacobianPoint.toAffineBatch(points).map(JacobianPoint.fromAffine);
    }
    equals(other) {
        assertJacPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        const Z1Z1 = mod(Z1 * Z1);
        const Z2Z2 = mod(Z2 * Z2);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        return U1 === U2 && S1 === S2;
    }
    negate() {
        return new JacobianPoint(this.x, mod(-this.y), this.z);
    }
    double() {
        const { x: X1, y: Y1, z: Z1 } = this;
        const A = mod(X1 * X1);
        const B = mod(Y1 * Y1);
        const C = mod(B * B);
        const x1b = X1 + B;
        const D = mod(_2n * (mod(x1b * x1b) - A - C));
        const E = mod(_3n * A);
        const F = mod(E * E);
        const X3 = mod(F - _2n * D);
        const Y3 = mod(E * (D - X3) - _8n * C);
        const Z3 = mod(_2n * Y1 * Z1);
        return new JacobianPoint(X3, Y3, Z3);
    }
    add(other) {
        assertJacPoint(other);
        const { x: X1, y: Y1, z: Z1 } = this;
        const { x: X2, y: Y2, z: Z2 } = other;
        if (X2 === _0n || Y2 === _0n)
            return this;
        if (X1 === _0n || Y1 === _0n)
            return other;
        const Z1Z1 = mod(Z1 * Z1);
        const Z2Z2 = mod(Z2 * Z2);
        const U1 = mod(X1 * Z2Z2);
        const U2 = mod(X2 * Z1Z1);
        const S1 = mod(mod(Y1 * Z2) * Z2Z2);
        const S2 = mod(mod(Y2 * Z1) * Z1Z1);
        const H = mod(U2 - U1);
        const r = mod(S2 - S1);
        if (H === _0n) {
            if (r === _0n) {
                return this.double();
            }
            else {
                return JacobianPoint.ZERO;
            }
        }
        const HH = mod(H * H);
        const HHH = mod(H * HH);
        const V = mod(U1 * HH);
        const X3 = mod(r * r - HHH - _2n * V);
        const Y3 = mod(r * (V - X3) - S1 * HHH);
        const Z3 = mod(Z1 * Z2 * H);
        return new JacobianPoint(X3, Y3, Z3);
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiplyUnsafe(scalar) {
        const P0 = JacobianPoint.ZERO;
        if (typeof scalar === 'bigint' && scalar === _0n)
            return P0;
        let n = normalizeScalar(scalar);
        if (n === _1n)
            return this;
        if (!USE_ENDOMORPHISM) {
            let p = P0;
            let d = this;
            while (n > _0n) {
                if (n & _1n)
                    p = p.add(d);
                d = d.double();
                n >>= _1n;
            }
            return p;
        }
        let { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
        let k1p = P0;
        let k2p = P0;
        let d = this;
        while (k1 > _0n || k2 > _0n) {
            if (k1 & _1n)
                k1p = k1p.add(d);
            if (k2 & _1n)
                k2p = k2p.add(d);
            d = d.double();
            k1 >>= _1n;
            k2 >>= _1n;
        }
        if (k1neg)
            k1p = k1p.negate();
        if (k2neg)
            k2p = k2p.negate();
        k2p = new JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
        return k1p.add(k2p);
    }
    precomputeWindow(W) {
        const windows = USE_ENDOMORPHISM ? 128 / W + 1 : 256 / W + 1;
        const points = [];
        let p = this;
        let base = p;
        for (let window = 0; window < windows; window++) {
            base = p;
            points.push(base);
            for (let i = 1; i < 2 ** (W - 1); i++) {
                base = base.add(p);
                points.push(base);
            }
            p = base.double();
        }
        return points;
    }
    wNAF(n, affinePoint) {
        if (!affinePoint && this.equals(JacobianPoint.BASE))
            affinePoint = Point.BASE;
        const W = (affinePoint && affinePoint._WINDOW_SIZE) || 1;
        if (256 % W) {
            throw new Error('Point#wNAF: Invalid precomputation window, must be power of 2');
        }
        let precomputes = affinePoint && pointPrecomputes.get(affinePoint);
        if (!precomputes) {
            precomputes = this.precomputeWindow(W);
            if (affinePoint && W !== 1) {
                precomputes = JacobianPoint.normalizeZ(precomputes);
                pointPrecomputes.set(affinePoint, precomputes);
            }
        }
        let p = JacobianPoint.ZERO;
        let f = JacobianPoint.BASE;
        const windows = 1 + (USE_ENDOMORPHISM ? 128 / W : 256 / W);
        const windowSize = 2 ** (W - 1);
        const mask = BigInt(2 ** W - 1);
        const maxNumber = 2 ** W;
        const shiftBy = BigInt(W);
        for (let window = 0; window < windows; window++) {
            const offset = window * windowSize;
            let wbits = Number(n & mask);
            n >>= shiftBy;
            if (wbits > windowSize) {
                wbits -= maxNumber;
                n += _1n;
            }
            const offset1 = offset;
            const offset2 = offset + Math.abs(wbits) - 1;
            const cond1 = window % 2 !== 0;
            const cond2 = wbits < 0;
            if (wbits === 0) {
                f = f.add(constTimeNegate(cond1, precomputes[offset1]));
            }
            else {
                p = p.add(constTimeNegate(cond2, precomputes[offset2]));
            }
        }
        return { p, f };
    }
    multiply(scalar, affinePoint) {
        let n = normalizeScalar(scalar);
        let point;
        let fake;
        if (USE_ENDOMORPHISM) {
            const { k1neg, k1, k2neg, k2 } = endo.splitScalar(n);
            let { p: k1p, f: f1p } = this.wNAF(k1, affinePoint);
            let { p: k2p, f: f2p } = this.wNAF(k2, affinePoint);
            k1p = constTimeNegate(k1neg, k1p);
            k2p = constTimeNegate(k2neg, k2p);
            k2p = new JacobianPoint(mod(k2p.x * endo.beta), k2p.y, k2p.z);
            point = k1p.add(k2p);
            fake = f1p.add(f2p);
        }
        else {
            const { p, f } = this.wNAF(n, affinePoint);
            point = p;
            fake = f;
        }
        return JacobianPoint.normalizeZ([point, fake])[0];
    }
    toAffine(invZ) {
        const { x, y, z } = this;
        const is0 = this.equals(JacobianPoint.ZERO);
        if (invZ == null)
            invZ = is0 ? _8n : invert(z);
        const iz1 = invZ;
        const iz2 = mod(iz1 * iz1);
        const iz3 = mod(iz2 * iz1);
        const ax = mod(x * iz2);
        const ay = mod(y * iz3);
        const zz = mod(z * iz1);
        if (is0)
            return Point.ZERO;
        if (zz !== _1n)
            throw new Error('invZ was invalid');
        return new Point(ax, ay);
    }
}
JacobianPoint.BASE = new JacobianPoint(CURVE.Gx, CURVE.Gy, _1n);
JacobianPoint.ZERO = new JacobianPoint(_0n, _1n, _0n);
function constTimeNegate(condition, item) {
    const neg = item.negate();
    return condition ? neg : item;
}
const pointPrecomputes = new WeakMap();
class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    _setWindowSize(windowSize) {
        this._WINDOW_SIZE = windowSize;
        pointPrecomputes.delete(this);
    }
    hasEvenY() {
        return this.y % _2n === _0n;
    }
    static fromCompressedHex(bytes) {
        const isShort = bytes.length === 32;
        const x = bytesToNumber(isShort ? bytes : bytes.subarray(1));
        if (!isValidFieldElement(x))
            throw new Error('Point is not on curve');
        const y2 = weierstrass(x);
        let y = sqrtMod(y2);
        const isYOdd = (y & _1n) === _1n;
        if (isShort) {
            if (isYOdd)
                y = mod(-y);
        }
        else {
            const isFirstByteOdd = (bytes[0] & 1) === 1;
            if (isFirstByteOdd !== isYOdd)
                y = mod(-y);
        }
        const point = new Point(x, y);
        point.assertValidity();
        return point;
    }
    static fromUncompressedHex(bytes) {
        const x = bytesToNumber(bytes.subarray(1, fieldLen + 1));
        const y = bytesToNumber(bytes.subarray(fieldLen + 1, fieldLen * 2 + 1));
        const point = new Point(x, y);
        point.assertValidity();
        return point;
    }
    static fromHex(hex) {
        const bytes = ensureBytes(hex);
        const len = bytes.length;
        const header = bytes[0];
        if (len === fieldLen)
            return this.fromCompressedHex(bytes);
        if (len === compressedLen && (header === 0x02 || header === 0x03)) {
            return this.fromCompressedHex(bytes);
        }
        if (len === uncompressedLen && header === 0x04)
            return this.fromUncompressedHex(bytes);
        throw new Error(`Point.fromHex: received invalid point. Expected 32-${compressedLen} compressed bytes or ${uncompressedLen} uncompressed bytes, not ${len}`);
    }
    static fromPrivateKey(privateKey) {
        return Point.BASE.multiply(normalizePrivateKey(privateKey));
    }
    static fromSignature(msgHash, signature, recovery) {
        const { r, s } = normalizeSignature(signature);
        if (![0, 1, 2, 3].includes(recovery))
            throw new Error('Cannot recover: invalid recovery bit');
        const h = truncateHash(ensureBytes(msgHash));
        const { n } = CURVE;
        const radj = recovery === 2 || recovery === 3 ? r + n : r;
        const rinv = invert(radj, n);
        const u1 = mod(-h * rinv, n);
        const u2 = mod(s * rinv, n);
        const prefix = recovery & 1 ? '03' : '02';
        const R = Point.fromHex(prefix + numTo32bStr(radj));
        const Q = Point.BASE.multiplyAndAddUnsafe(R, u1, u2);
        if (!Q)
            throw new Error('Cannot recover signature: point at infinify');
        Q.assertValidity();
        return Q;
    }
    toRawBytes(isCompressed = false) {
        return hexToBytes(this.toHex(isCompressed));
    }
    toHex(isCompressed = false) {
        const x = numTo32bStr(this.x);
        if (isCompressed) {
            const prefix = this.hasEvenY() ? '02' : '03';
            return `${prefix}${x}`;
        }
        else {
            return `04${x}${numTo32bStr(this.y)}`;
        }
    }
    toHexX() {
        return this.toHex(true).slice(2);
    }
    toRawX() {
        return this.toRawBytes(true).slice(1);
    }
    assertValidity() {
        const msg = 'Point is not on elliptic curve';
        const { x, y } = this;
        if (!isValidFieldElement(x) || !isValidFieldElement(y))
            throw new Error(msg);
        const left = mod(y * y);
        const right = weierstrass(x);
        if (mod(left - right) !== _0n)
            throw new Error(msg);
    }
    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
    negate() {
        return new Point(this.x, mod(-this.y));
    }
    double() {
        return JacobianPoint.fromAffine(this).double().toAffine();
    }
    add(other) {
        return JacobianPoint.fromAffine(this).add(JacobianPoint.fromAffine(other)).toAffine();
    }
    subtract(other) {
        return this.add(other.negate());
    }
    multiply(scalar) {
        return JacobianPoint.fromAffine(this).multiply(scalar, this).toAffine();
    }
    multiplyAndAddUnsafe(Q, a, b) {
        const P = JacobianPoint.fromAffine(this);
        const aP = a === _0n || a === _1n || this !== Point.BASE ? P.multiplyUnsafe(a) : P.multiply(a);
        const bQ = JacobianPoint.fromAffine(Q).multiplyUnsafe(b);
        const sum = aP.add(bQ);
        return sum.equals(JacobianPoint.ZERO) ? undefined : sum.toAffine();
    }
}
exports.Point = Point;
Point.BASE = new Point(CURVE.Gx, CURVE.Gy);
Point.ZERO = new Point(_0n, _0n);
function sliceDER(s) {
    return Number.parseInt(s[0], 16) >= 8 ? '00' + s : s;
}
function parseDERInt(data) {
    if (data.length < 2 || data[0] !== 0x02) {
        throw new Error(`Invalid signature integer tag: ${bytesToHex(data)}`);
    }
    const len = data[1];
    const res = data.subarray(2, len + 2);
    if (!len || res.length !== len) {
        throw new Error(`Invalid signature integer: wrong length`);
    }
    if (res[0] === 0x00 && res[1] <= 0x7f) {
        throw new Error('Invalid signature integer: trailing length');
    }
    return { data: bytesToNumber(res), left: data.subarray(len + 2) };
}
function parseDERSignature(data) {
    if (data.length < 2 || data[0] != 0x30) {
        throw new Error(`Invalid signature tag: ${bytesToHex(data)}`);
    }
    if (data[1] !== data.length - 2) {
        throw new Error('Invalid signature: incorrect length');
    }
    const { data: r, left: sBytes } = parseDERInt(data.subarray(2));
    const { data: s, left: rBytesLeft } = parseDERInt(sBytes);
    if (rBytesLeft.length) {
        throw new Error(`Invalid signature: left bytes after parsing: ${bytesToHex(rBytesLeft)}`);
    }
    return { r, s };
}
class Signature {
    constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
    }
    static fromCompact(hex) {
        const arr = hex instanceof Uint8Array;
        const name = 'Signature.fromCompact';
        if (typeof hex !== 'string' && !arr)
            throw new TypeError(`${name}: Expected string or Uint8Array`);
        const str = arr ? bytesToHex(hex) : hex;
        if (str.length !== 128)
            throw new Error(`${name}: Expected 64-byte hex`);
        return new Signature(hexToNumber(str.slice(0, 64)), hexToNumber(str.slice(64, 128)));
    }
    static fromDER(hex) {
        const arr = hex instanceof Uint8Array;
        if (typeof hex !== 'string' && !arr)
            throw new TypeError(`Signature.fromDER: Expected string or Uint8Array`);
        const { r, s } = parseDERSignature(arr ? hex : hexToBytes(hex));
        return new Signature(r, s);
    }
    static fromHex(hex) {
        return this.fromDER(hex);
    }
    assertValidity() {
        const { r, s } = this;
        if (!isWithinCurveOrder(r))
            throw new Error('Invalid Signature: r must be 0 < r < n');
        if (!isWithinCurveOrder(s))
            throw new Error('Invalid Signature: s must be 0 < s < n');
    }
    hasHighS() {
        const HALF = CURVE.n >> _1n;
        return this.s > HALF;
    }
    normalizeS() {
        return this.hasHighS() ? new Signature(this.r, mod(-this.s, CURVE.n)) : this;
    }
    toDERRawBytes() {
        return hexToBytes(this.toDERHex());
    }
    toDERHex() {
        const sHex = sliceDER(numberToHexUnpadded(this.s));
        const rHex = sliceDER(numberToHexUnpadded(this.r));
        const sHexL = sHex.length / 2;
        const rHexL = rHex.length / 2;
        const sLen = numberToHexUnpadded(sHexL);
        const rLen = numberToHexUnpadded(rHexL);
        const length = numberToHexUnpadded(rHexL + sHexL + 4);
        return `30${length}02${rLen}${rHex}02${sLen}${sHex}`;
    }
    toRawBytes() {
        return this.toDERRawBytes();
    }
    toHex() {
        return this.toDERHex();
    }
    toCompactRawBytes() {
        return hexToBytes(this.toCompactHex());
    }
    toCompactHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
    }
}
exports.Signature = Signature;
function concatBytes(...arrays) {
    if (!arrays.every((b) => b instanceof Uint8Array))
        throw new Error('Uint8Array list expected');
    if (arrays.length === 1)
        return arrays[0];
    const length = arrays.reduce((a, arr) => a + arr.length, 0);
    const result = new Uint8Array(length);
    for (let i = 0, pad = 0; i < arrays.length; i++) {
        const arr = arrays[i];
        result.set(arr, pad);
        pad += arr.length;
    }
    return result;
}
const hexes = Array.from({ length: 256 }, (v, i) => i.toString(16).padStart(2, '0'));
function bytesToHex(uint8a) {
    if (!(uint8a instanceof Uint8Array))
        throw new Error('Expected Uint8Array');
    let hex = '';
    for (let i = 0; i < uint8a.length; i++) {
        hex += hexes[uint8a[i]];
    }
    return hex;
}
const POW_2_256 = BigInt('0x10000000000000000000000000000000000000000000000000000000000000000');
function numTo32bStr(num) {
    if (typeof num !== 'bigint')
        throw new Error('Expected bigint');
    if (!(_0n <= num && num < POW_2_256))
        throw new Error('Expected number 0 <= n < 2^256');
    return num.toString(16).padStart(64, '0');
}
function numTo32b(num) {
    const b = hexToBytes(numTo32bStr(num));
    if (b.length !== 32)
        throw new Error('Error: expected 32 bytes');
    return b;
}
function numberToHexUnpadded(num) {
    const hex = num.toString(16);
    return hex.length & 1 ? `0${hex}` : hex;
}
function hexToNumber(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToNumber: expected string, got ' + typeof hex);
    }
    return BigInt(`0x${hex}`);
}
function hexToBytes(hex) {
    if (typeof hex !== 'string') {
        throw new TypeError('hexToBytes: expected string, got ' + typeof hex);
    }
    if (hex.length % 2)
        throw new Error('hexToBytes: received invalid unpadded hex' + hex.length);
    const array = new Uint8Array(hex.length / 2);
    for (let i = 0; i < array.length; i++) {
        const j = i * 2;
        const hexByte = hex.slice(j, j + 2);
        const byte = Number.parseInt(hexByte, 16);
        if (Number.isNaN(byte) || byte < 0)
            throw new Error('Invalid byte sequence');
        array[i] = byte;
    }
    return array;
}
function bytesToNumber(bytes) {
    return hexToNumber(bytesToHex(bytes));
}
function ensureBytes(hex) {
    return hex instanceof Uint8Array ? Uint8Array.from(hex) : hexToBytes(hex);
}
function normalizeScalar(num) {
    if (typeof num === 'number' && Number.isSafeInteger(num) && num > 0)
        return BigInt(num);
    if (typeof num === 'bigint' && isWithinCurveOrder(num))
        return num;
    throw new TypeError('Expected valid private scalar: 0 < scalar < curve.n');
}
function mod(a, b = CURVE.P) {
    const result = a % b;
    return result >= _0n ? result : b + result;
}
function pow2(x, power) {
    const { P } = CURVE;
    let res = x;
    while (power-- > _0n) {
        res *= res;
        res %= P;
    }
    return res;
}
function sqrtMod(x) {
    const { P } = CURVE;
    const _6n = BigInt(6);
    const _11n = BigInt(11);
    const _22n = BigInt(22);
    const _23n = BigInt(23);
    const _44n = BigInt(44);
    const _88n = BigInt(88);
    const b2 = (x * x * x) % P;
    const b3 = (b2 * b2 * x) % P;
    const b6 = (pow2(b3, _3n) * b3) % P;
    const b9 = (pow2(b6, _3n) * b3) % P;
    const b11 = (pow2(b9, _2n) * b2) % P;
    const b22 = (pow2(b11, _11n) * b11) % P;
    const b44 = (pow2(b22, _22n) * b22) % P;
    const b88 = (pow2(b44, _44n) * b44) % P;
    const b176 = (pow2(b88, _88n) * b88) % P;
    const b220 = (pow2(b176, _44n) * b44) % P;
    const b223 = (pow2(b220, _3n) * b3) % P;
    const t1 = (pow2(b223, _23n) * b22) % P;
    const t2 = (pow2(t1, _6n) * b2) % P;
    const rt = pow2(t2, _2n);
    const xc = (rt * rt) % P;
    if (xc !== x)
        throw new Error('Cannot find square root');
    return rt;
}
function invert(number, modulo = CURVE.P) {
    if (number === _0n || modulo <= _0n) {
        throw new Error(`invert: expected positive integers, got n=${number} mod=${modulo}`);
    }
    let a = mod(number, modulo);
    let b = modulo;
    let x = _0n, y = _1n, u = _1n, v = _0n;
    while (a !== _0n) {
        const q = b / a;
        const r = b % a;
        const m = x - u * q;
        const n = y - v * q;
        b = a, a = r, x = u, y = v, u = m, v = n;
    }
    const gcd = b;
    if (gcd !== _1n)
        throw new Error('invert: does not exist');
    return mod(x, modulo);
}
function invertBatch(nums, p = CURVE.P) {
    const scratch = new Array(nums.length);
    const lastMultiplied = nums.reduce((acc, num, i) => {
        if (num === _0n)
            return acc;
        scratch[i] = acc;
        return mod(acc * num, p);
    }, _1n);
    const inverted = invert(lastMultiplied, p);
    nums.reduceRight((acc, num, i) => {
        if (num === _0n)
            return acc;
        scratch[i] = mod(acc * scratch[i], p);
        return mod(acc * num, p);
    }, inverted);
    return scratch;
}
function bits2int_2(bytes) {
    const delta = bytes.length * 8 - groupLen * 8;
    const num = bytesToNumber(bytes);
    return delta > 0 ? num >> BigInt(delta) : num;
}
function truncateHash(hash, truncateOnly = false) {
    const h = bits2int_2(hash);
    if (truncateOnly)
        return h;
    const { n } = CURVE;
    return h >= n ? h - n : h;
}
let _sha256Sync;
let _hmacSha256Sync;
class HmacDrbg {
    constructor(hashLen, qByteLen) {
        this.hashLen = hashLen;
        this.qByteLen = qByteLen;
        if (typeof hashLen !== 'number' || hashLen < 2)
            throw new Error('hashLen must be a number');
        if (typeof qByteLen !== 'number' || qByteLen < 2)
            throw new Error('qByteLen must be a number');
        this.v = new Uint8Array(hashLen).fill(1);
        this.k = new Uint8Array(hashLen).fill(0);
        this.counter = 0;
    }
    hmac(...values) {
        return exports.utils.hmacSha256(this.k, ...values);
    }
    hmacSync(...values) {
        return _hmacSha256Sync(this.k, ...values);
    }
    checkSync() {
        if (typeof _hmacSha256Sync !== 'function')
            throw new ShaError('hmacSha256Sync needs to be set');
    }
    incr() {
        if (this.counter >= 1000)
            throw new Error('Tried 1,000 k values for sign(), all were invalid');
        this.counter += 1;
    }
    async reseed(seed = new Uint8Array()) {
        this.k = await this.hmac(this.v, Uint8Array.from([0x00]), seed);
        this.v = await this.hmac(this.v);
        if (seed.length === 0)
            return;
        this.k = await this.hmac(this.v, Uint8Array.from([0x01]), seed);
        this.v = await this.hmac(this.v);
    }
    reseedSync(seed = new Uint8Array()) {
        this.checkSync();
        this.k = this.hmacSync(this.v, Uint8Array.from([0x00]), seed);
        this.v = this.hmacSync(this.v);
        if (seed.length === 0)
            return;
        this.k = this.hmacSync(this.v, Uint8Array.from([0x01]), seed);
        this.v = this.hmacSync(this.v);
    }
    async generate() {
        this.incr();
        let len = 0;
        const out = [];
        while (len < this.qByteLen) {
            this.v = await this.hmac(this.v);
            const sl = this.v.slice();
            out.push(sl);
            len += this.v.length;
        }
        return concatBytes(...out);
    }
    generateSync() {
        this.checkSync();
        this.incr();
        let len = 0;
        const out = [];
        while (len < this.qByteLen) {
            this.v = this.hmacSync(this.v);
            const sl = this.v.slice();
            out.push(sl);
            len += this.v.length;
        }
        return concatBytes(...out);
    }
}
function isWithinCurveOrder(num) {
    return _0n < num && num < CURVE.n;
}
function isValidFieldElement(num) {
    return _0n < num && num < CURVE.P;
}
function kmdToSig(kBytes, m, d, lowS = true) {
    const { n } = CURVE;
    const k = truncateHash(kBytes, true);
    if (!isWithinCurveOrder(k))
        return;
    const kinv = invert(k, n);
    const q = Point.BASE.multiply(k);
    const r = mod(q.x, n);
    if (r === _0n)
        return;
    const s = mod(kinv * mod(m + d * r, n), n);
    if (s === _0n)
        return;
    let sig = new Signature(r, s);
    let recovery = (q.x === sig.r ? 0 : 2) | Number(q.y & _1n);
    if (lowS && sig.hasHighS()) {
        sig = sig.normalizeS();
        recovery ^= 1;
    }
    return { sig, recovery };
}
function normalizePrivateKey(key) {
    let num;
    if (typeof key === 'bigint') {
        num = key;
    }
    else if (typeof key === 'number' && Number.isSafeInteger(key) && key > 0) {
        num = BigInt(key);
    }
    else if (typeof key === 'string') {
        if (key.length !== 2 * groupLen)
            throw new Error('Expected 32 bytes of private key');
        num = hexToNumber(key);
    }
    else if (key instanceof Uint8Array) {
        if (key.length !== groupLen)
            throw new Error('Expected 32 bytes of private key');
        num = bytesToNumber(key);
    }
    else {
        throw new TypeError('Expected valid private key');
    }
    if (!isWithinCurveOrder(num))
        throw new Error('Expected private key: 0 < key < n');
    return num;
}
function normalizePublicKey(publicKey) {
    if (publicKey instanceof Point) {
        publicKey.assertValidity();
        return publicKey;
    }
    else {
        return Point.fromHex(publicKey);
    }
}
function normalizeSignature(signature) {
    if (signature instanceof Signature) {
        signature.assertValidity();
        return signature;
    }
    try {
        return Signature.fromDER(signature);
    }
    catch (error) {
        return Signature.fromCompact(signature);
    }
}
function getPublicKey(privateKey, isCompressed = false) {
    return Point.fromPrivateKey(privateKey).toRawBytes(isCompressed);
}
exports.getPublicKey = getPublicKey;
function recoverPublicKey(msgHash, signature, recovery, isCompressed = false) {
    return Point.fromSignature(msgHash, signature, recovery).toRawBytes(isCompressed);
}
exports.recoverPublicKey = recoverPublicKey;
function isProbPub(item) {
    const arr = item instanceof Uint8Array;
    const str = typeof item === 'string';
    const len = (arr || str) && item.length;
    if (arr)
        return len === compressedLen || len === uncompressedLen;
    if (str)
        return len === compressedLen * 2 || len === uncompressedLen * 2;
    if (item instanceof Point)
        return true;
    return false;
}
function getSharedSecret(privateA, publicB, isCompressed = false) {
    if (isProbPub(privateA))
        throw new TypeError('getSharedSecret: first arg must be private key');
    if (!isProbPub(publicB))
        throw new TypeError('getSharedSecret: second arg must be public key');
    const b = normalizePublicKey(publicB);
    b.assertValidity();
    return b.multiply(normalizePrivateKey(privateA)).toRawBytes(isCompressed);
}
exports.getSharedSecret = getSharedSecret;
function bits2int(bytes) {
    const slice = bytes.length > fieldLen ? bytes.slice(0, fieldLen) : bytes;
    return bytesToNumber(slice);
}
function bits2octets(bytes) {
    const z1 = bits2int(bytes);
    const z2 = mod(z1, CURVE.n);
    return int2octets(z2 < _0n ? z1 : z2);
}
function int2octets(num) {
    return numTo32b(num);
}
function initSigArgs(msgHash, privateKey, extraEntropy) {
    if (msgHash == null)
        throw new Error(`sign: expected valid message hash, not "${msgHash}"`);
    const h1 = ensureBytes(msgHash);
    const d = normalizePrivateKey(privateKey);
    const seedArgs = [int2octets(d), bits2octets(h1)];
    if (extraEntropy != null) {
        if (extraEntropy === true)
            extraEntropy = exports.utils.randomBytes(fieldLen);
        const e = ensureBytes(extraEntropy);
        if (e.length !== fieldLen)
            throw new Error(`sign: Expected ${fieldLen} bytes of extra data`);
        seedArgs.push(e);
    }
    const seed = concatBytes(...seedArgs);
    const m = bits2int(h1);
    return { seed, m, d };
}
function finalizeSig(recSig, opts) {
    const { sig, recovery } = recSig;
    const { der, recovered } = Object.assign({ canonical: true, der: true }, opts);
    const hashed = der ? sig.toDERRawBytes() : sig.toCompactRawBytes();
    return recovered ? [hashed, recovery] : hashed;
}
async function sign(msgHash, privKey, opts = {}) {
    const { seed, m, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
    const drbg = new HmacDrbg(hashLen, groupLen);
    await drbg.reseed(seed);
    let sig;
    while (!(sig = kmdToSig(await drbg.generate(), m, d, opts.canonical)))
        await drbg.reseed();
    return finalizeSig(sig, opts);
}
exports.sign = sign;
function signSync(msgHash, privKey, opts = {}) {
    const { seed, m, d } = initSigArgs(msgHash, privKey, opts.extraEntropy);
    const drbg = new HmacDrbg(hashLen, groupLen);
    drbg.reseedSync(seed);
    let sig;
    while (!(sig = kmdToSig(drbg.generateSync(), m, d, opts.canonical)))
        drbg.reseedSync();
    return finalizeSig(sig, opts);
}
exports.signSync = signSync;
const vopts = { strict: true };
function verify(signature, msgHash, publicKey, opts = vopts) {
    let sig;
    try {
        sig = normalizeSignature(signature);
        msgHash = ensureBytes(msgHash);
    }
    catch (error) {
        return false;
    }
    const { r, s } = sig;
    if (opts.strict && sig.hasHighS())
        return false;
    const h = truncateHash(msgHash);
    let P;
    try {
        P = normalizePublicKey(publicKey);
    }
    catch (error) {
        return false;
    }
    const { n } = CURVE;
    const sinv = invert(s, n);
    const u1 = mod(h * sinv, n);
    const u2 = mod(r * sinv, n);
    const R = Point.BASE.multiplyAndAddUnsafe(P, u1, u2);
    if (!R)
        return false;
    const v = mod(R.x, n);
    return v === r;
}
exports.verify = verify;
function schnorrChallengeFinalize(ch) {
    return mod(bytesToNumber(ch), CURVE.n);
}
class SchnorrSignature {
    constructor(r, s) {
        this.r = r;
        this.s = s;
        this.assertValidity();
    }
    static fromHex(hex) {
        const bytes = ensureBytes(hex);
        if (bytes.length !== 64)
            throw new TypeError(`SchnorrSignature.fromHex: expected 64 bytes, not ${bytes.length}`);
        const r = bytesToNumber(bytes.subarray(0, 32));
        const s = bytesToNumber(bytes.subarray(32, 64));
        return new SchnorrSignature(r, s);
    }
    assertValidity() {
        const { r, s } = this;
        if (!isValidFieldElement(r) || !isWithinCurveOrder(s))
            throw new Error('Invalid signature');
    }
    toHex() {
        return numTo32bStr(this.r) + numTo32bStr(this.s);
    }
    toRawBytes() {
        return hexToBytes(this.toHex());
    }
}
function schnorrGetPublicKey(privateKey) {
    return Point.fromPrivateKey(privateKey).toRawX();
}
class InternalSchnorrSignature {
    constructor(message, privateKey, auxRand = exports.utils.randomBytes()) {
        if (message == null)
            throw new TypeError(`sign: Expected valid message, not "${message}"`);
        this.m = ensureBytes(message);
        const { x, scalar } = this.getScalar(normalizePrivateKey(privateKey));
        this.px = x;
        this.d = scalar;
        this.rand = ensureBytes(auxRand);
        if (this.rand.length !== 32)
            throw new TypeError('sign: Expected 32 bytes of aux randomness');
    }
    getScalar(priv) {
        const point = Point.fromPrivateKey(priv);
        const scalar = point.hasEvenY() ? priv : CURVE.n - priv;
        return { point, scalar, x: point.toRawX() };
    }
    initNonce(d, t0h) {
        return numTo32b(d ^ bytesToNumber(t0h));
    }
    finalizeNonce(k0h) {
        const k0 = mod(bytesToNumber(k0h), CURVE.n);
        if (k0 === _0n)
            throw new Error('sign: Creation of signature failed. k is zero');
        const { point: R, x: rx, scalar: k } = this.getScalar(k0);
        return { R, rx, k };
    }
    finalizeSig(R, k, e, d) {
        return new SchnorrSignature(R.x, mod(k + e * d, CURVE.n)).toRawBytes();
    }
    error() {
        throw new Error('sign: Invalid signature produced');
    }
    async calc() {
        const { m, d, px, rand } = this;
        const tag = exports.utils.taggedHash;
        const t = this.initNonce(d, await tag(TAGS.aux, rand));
        const { R, rx, k } = this.finalizeNonce(await tag(TAGS.nonce, t, px, m));
        const e = schnorrChallengeFinalize(await tag(TAGS.challenge, rx, px, m));
        const sig = this.finalizeSig(R, k, e, d);
        if (!(await schnorrVerify(sig, m, px)))
            this.error();
        return sig;
    }
    calcSync() {
        const { m, d, px, rand } = this;
        const tag = exports.utils.taggedHashSync;
        const t = this.initNonce(d, tag(TAGS.aux, rand));
        const { R, rx, k } = this.finalizeNonce(tag(TAGS.nonce, t, px, m));
        const e = schnorrChallengeFinalize(tag(TAGS.challenge, rx, px, m));
        const sig = this.finalizeSig(R, k, e, d);
        if (!schnorrVerifySync(sig, m, px))
            this.error();
        return sig;
    }
}
async function schnorrSign(msg, privKey, auxRand) {
    return new InternalSchnorrSignature(msg, privKey, auxRand).calc();
}
function schnorrSignSync(msg, privKey, auxRand) {
    return new InternalSchnorrSignature(msg, privKey, auxRand).calcSync();
}
function initSchnorrVerify(signature, message, publicKey) {
    const raw = signature instanceof SchnorrSignature;
    const sig = raw ? signature : SchnorrSignature.fromHex(signature);
    if (raw)
        sig.assertValidity();
    return {
        ...sig,
        m: ensureBytes(message),
        P: normalizePublicKey(publicKey),
    };
}
function finalizeSchnorrVerify(r, P, s, e) {
    const R = Point.BASE.multiplyAndAddUnsafe(P, normalizePrivateKey(s), mod(-e, CURVE.n));
    if (!R || !R.hasEvenY() || R.x !== r)
        return false;
    return true;
}
async function schnorrVerify(signature, message, publicKey) {
    try {
        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
        const e = schnorrChallengeFinalize(await exports.utils.taggedHash(TAGS.challenge, numTo32b(r), P.toRawX(), m));
        return finalizeSchnorrVerify(r, P, s, e);
    }
    catch (error) {
        return false;
    }
}
function schnorrVerifySync(signature, message, publicKey) {
    try {
        const { r, s, m, P } = initSchnorrVerify(signature, message, publicKey);
        const e = schnorrChallengeFinalize(exports.utils.taggedHashSync(TAGS.challenge, numTo32b(r), P.toRawX(), m));
        return finalizeSchnorrVerify(r, P, s, e);
    }
    catch (error) {
        if (error instanceof ShaError)
            throw error;
        return false;
    }
}
exports.schnorr = {
    Signature: SchnorrSignature,
    getPublicKey: schnorrGetPublicKey,
    sign: schnorrSign,
    verify: schnorrVerify,
    signSync: schnorrSignSync,
    verifySync: schnorrVerifySync,
};
Point.BASE._setWindowSize(8);
const crypto = {
    node: nodeCrypto,
    web: typeof self === 'object' && 'crypto' in self ? self.crypto : undefined,
};
const TAGS = {
    challenge: 'BIP0340/challenge',
    aux: 'BIP0340/aux',
    nonce: 'BIP0340/nonce',
};
const TAGGED_HASH_PREFIXES = {};
exports.utils = {
    bytesToHex,
    hexToBytes,
    concatBytes,
    mod,
    invert,
    isValidPrivateKey(privateKey) {
        try {
            normalizePrivateKey(privateKey);
            return true;
        }
        catch (error) {
            return false;
        }
    },
    _bigintTo32Bytes: numTo32b,
    _normalizePrivateKey: normalizePrivateKey,
    hashToPrivateKey: (hash) => {
        hash = ensureBytes(hash);
        const minLen = groupLen + 8;
        if (hash.length < minLen || hash.length > 1024) {
            throw new Error(`Expected valid bytes of private key as per FIPS 186`);
        }
        const num = mod(bytesToNumber(hash), CURVE.n - _1n) + _1n;
        return numTo32b(num);
    },
    randomBytes: (bytesLength = 32) => {
        if (crypto.web) {
            return crypto.web.getRandomValues(new Uint8Array(bytesLength));
        }
        else if (crypto.node) {
            const { randomBytes } = crypto.node;
            return Uint8Array.from(randomBytes(bytesLength));
        }
        else {
            throw new Error("The environment doesn't have randomBytes function");
        }
    },
    randomPrivateKey: () => exports.utils.hashToPrivateKey(exports.utils.randomBytes(groupLen + 8)),
    precompute(windowSize = 8, point = Point.BASE) {
        const cached = point === Point.BASE ? point : new Point(point.x, point.y);
        cached._setWindowSize(windowSize);
        cached.multiply(_3n);
        return cached;
    },
    sha256: async (...messages) => {
        if (crypto.web) {
            const buffer = await crypto.web.subtle.digest('SHA-256', concatBytes(...messages));
            return new Uint8Array(buffer);
        }
        else if (crypto.node) {
            const { createHash } = crypto.node;
            const hash = createHash('sha256');
            messages.forEach((m) => hash.update(m));
            return Uint8Array.from(hash.digest());
        }
        else {
            throw new Error("The environment doesn't have sha256 function");
        }
    },
    hmacSha256: async (key, ...messages) => {
        if (crypto.web) {
            const ckey = await crypto.web.subtle.importKey('raw', key, { name: 'HMAC', hash: { name: 'SHA-256' } }, false, ['sign']);
            const message = concatBytes(...messages);
            const buffer = await crypto.web.subtle.sign('HMAC', ckey, message);
            return new Uint8Array(buffer);
        }
        else if (crypto.node) {
            const { createHmac } = crypto.node;
            const hash = createHmac('sha256', key);
            messages.forEach((m) => hash.update(m));
            return Uint8Array.from(hash.digest());
        }
        else {
            throw new Error("The environment doesn't have hmac-sha256 function");
        }
    },
    sha256Sync: undefined,
    hmacSha256Sync: undefined,
    taggedHash: async (tag, ...messages) => {
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === undefined) {
            const tagH = await exports.utils.sha256(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes(tagH, tagH);
            TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return exports.utils.sha256(tagP, ...messages);
    },
    taggedHashSync: (tag, ...messages) => {
        if (typeof _sha256Sync !== 'function')
            throw new ShaError('sha256Sync is undefined, you need to set it');
        let tagP = TAGGED_HASH_PREFIXES[tag];
        if (tagP === undefined) {
            const tagH = _sha256Sync(Uint8Array.from(tag, (c) => c.charCodeAt(0)));
            tagP = concatBytes(tagH, tagH);
            TAGGED_HASH_PREFIXES[tag] = tagP;
        }
        return _sha256Sync(tagP, ...messages);
    },
    _JacobianPoint: JacobianPoint,
};
Object.defineProperties(exports.utils, {
    sha256Sync: {
        configurable: false,
        get() {
            return _sha256Sync;
        },
        set(val) {
            if (!_sha256Sync)
                _sha256Sync = val;
        },
    },
    hmacSha256Sync: {
        configurable: false,
        get() {
            return _hmacSha256Sync;
        },
        set(val) {
            if (!_hmacSha256Sync)
                _hmacSha256Sync = val;
        },
    },
});


/***/ }),

/***/ 9891:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

/*! scure-base - MIT License (c) 2022 Paul Miller (paulmillr.com) */
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.bytes = exports.stringToBytes = exports.str = exports.bytesToString = exports.hex = exports.utf8 = exports.bech32m = exports.bech32 = exports.base58check = exports.base58xmr = exports.base58xrp = exports.base58flickr = exports.base58 = exports.base64url = exports.base64 = exports.base32crockford = exports.base32hex = exports.base32 = exports.base16 = exports.utils = exports.assertNumber = void 0;
function assertNumber(n) {
    if (!Number.isSafeInteger(n))
        throw new Error(`Wrong integer: ${n}`);
}
exports.assertNumber = assertNumber;
function chain(...args) {
    const wrap = (a, b) => (c) => a(b(c));
    const encode = Array.from(args)
        .reverse()
        .reduce((acc, i) => (acc ? wrap(acc, i.encode) : i.encode), undefined);
    const decode = args.reduce((acc, i) => (acc ? wrap(acc, i.decode) : i.decode), undefined);
    return { encode, decode };
}
function alphabet(alphabet) {
    return {
        encode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('alphabet.encode input should be an array of numbers');
            return digits.map((i) => {
                assertNumber(i);
                if (i < 0 || i >= alphabet.length)
                    throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
                return alphabet[i];
            });
        },
        decode: (input) => {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('alphabet.decode input should be array of strings');
            return input.map((letter) => {
                if (typeof letter !== 'string')
                    throw new Error(`alphabet.decode: not string element=${letter}`);
                const index = alphabet.indexOf(letter);
                if (index === -1)
                    throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
                return index;
            });
        },
    };
}
function join(separator = '') {
    if (typeof separator !== 'string')
        throw new Error('join separator should be string');
    return {
        encode: (from) => {
            if (!Array.isArray(from) || (from.length && typeof from[0] !== 'string'))
                throw new Error('join.encode input should be array of strings');
            for (let i of from)
                if (typeof i !== 'string')
                    throw new Error(`join.encode: non-string input=${i}`);
            return from.join(separator);
        },
        decode: (to) => {
            if (typeof to !== 'string')
                throw new Error('join.decode input should be string');
            return to.split(separator);
        },
    };
}
function padding(bits, chr = '=') {
    assertNumber(bits);
    if (typeof chr !== 'string')
        throw new Error('padding chr should be string');
    return {
        encode(data) {
            if (!Array.isArray(data) || (data.length && typeof data[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of data)
                if (typeof i !== 'string')
                    throw new Error(`padding.encode: non-string input=${i}`);
            while ((data.length * bits) % 8)
                data.push(chr);
            return data;
        },
        decode(input) {
            if (!Array.isArray(input) || (input.length && typeof input[0] !== 'string'))
                throw new Error('padding.encode input should be array of strings');
            for (let i of input)
                if (typeof i !== 'string')
                    throw new Error(`padding.decode: non-string input=${i}`);
            let end = input.length;
            if ((end * bits) % 8)
                throw new Error('Invalid padding: string should have whole number of bytes');
            for (; end > 0 && input[end - 1] === chr; end--) {
                if (!(((end - 1) * bits) % 8))
                    throw new Error('Invalid padding: string has too much padding');
            }
            return input.slice(0, end);
        },
    };
}
function normalize(fn) {
    if (typeof fn !== 'function')
        throw new Error('normalize fn should be function');
    return { encode: (from) => from, decode: (to) => fn(to) };
}
function convertRadix(data, from, to) {
    if (from < 2)
        throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
    if (to < 2)
        throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
    if (!Array.isArray(data))
        throw new Error('convertRadix: data should be array');
    if (!data.length)
        return [];
    let pos = 0;
    const res = [];
    const digits = Array.from(data);
    digits.forEach((d) => {
        assertNumber(d);
        if (d < 0 || d >= from)
            throw new Error(`Wrong integer: ${d}`);
    });
    while (true) {
        let carry = 0;
        let done = true;
        for (let i = pos; i < digits.length; i++) {
            const digit = digits[i];
            const digitBase = from * carry + digit;
            if (!Number.isSafeInteger(digitBase) ||
                (from * carry) / from !== carry ||
                digitBase - digit !== from * carry) {
                throw new Error('convertRadix: carry overflow');
            }
            carry = digitBase % to;
            digits[i] = Math.floor(digitBase / to);
            if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase)
                throw new Error('convertRadix: carry overflow');
            if (!done)
                continue;
            else if (!digits[i])
                pos = i;
            else
                done = false;
        }
        res.push(carry);
        if (done)
            break;
    }
    for (let i = 0; i < data.length - 1 && data[i] === 0; i++)
        res.push(0);
    return res.reverse();
}
const gcd = (a, b) => (!b ? a : gcd(b, a % b));
const radix2carry = (from, to) => from + (to - gcd(from, to));
function convertRadix2(data, from, to, padding) {
    if (!Array.isArray(data))
        throw new Error('convertRadix2: data should be array');
    if (from <= 0 || from > 32)
        throw new Error(`convertRadix2: wrong from=${from}`);
    if (to <= 0 || to > 32)
        throw new Error(`convertRadix2: wrong to=${to}`);
    if (radix2carry(from, to) > 32) {
        throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
    }
    let carry = 0;
    let pos = 0;
    const mask = 2 ** to - 1;
    const res = [];
    for (const n of data) {
        assertNumber(n);
        if (n >= 2 ** from)
            throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
        carry = (carry << from) | n;
        if (pos + from > 32)
            throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
        pos += from;
        for (; pos >= to; pos -= to)
            res.push(((carry >> (pos - to)) & mask) >>> 0);
        carry &= 2 ** pos - 1;
    }
    carry = (carry << (to - pos)) & mask;
    if (!padding && pos >= from)
        throw new Error('Excess padding');
    if (!padding && carry)
        throw new Error(`Non-zero padding: ${carry}`);
    if (padding && pos > 0)
        res.push(carry >>> 0);
    return res;
}
function radix(num) {
    assertNumber(num);
    return {
        encode: (bytes) => {
            if (!(bytes instanceof Uint8Array))
                throw new Error('radix.encode input should be Uint8Array');
            return convertRadix(Array.from(bytes), 2 ** 8, num);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix.decode input should be array of strings');
            return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
        },
    };
}
function radix2(bits, revPadding = false) {
    assertNumber(bits);
    if (bits <= 0 || bits > 32)
        throw new Error('radix2: bits should be in (0..32]');
    if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32)
        throw new Error('radix2: carry overflow');
    return {
        encode: (bytes) => {
            if (!(bytes instanceof Uint8Array))
                throw new Error('radix2.encode input should be Uint8Array');
            return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
        },
        decode: (digits) => {
            if (!Array.isArray(digits) || (digits.length && typeof digits[0] !== 'number'))
                throw new Error('radix2.decode input should be array of strings');
            return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
        },
    };
}
function unsafeWrapper(fn) {
    if (typeof fn !== 'function')
        throw new Error('unsafeWrapper fn should be function');
    return function (...args) {
        try {
            return fn.apply(null, args);
        }
        catch (e) { }
    };
}
function checksum(len, fn) {
    assertNumber(len);
    if (typeof fn !== 'function')
        throw new Error('checksum fn should be function');
    return {
        encode(data) {
            if (!(data instanceof Uint8Array))
                throw new Error('checksum.encode: input should be Uint8Array');
            const checksum = fn(data).slice(0, len);
            const res = new Uint8Array(data.length + len);
            res.set(data);
            res.set(checksum, data.length);
            return res;
        },
        decode(data) {
            if (!(data instanceof Uint8Array))
                throw new Error('checksum.decode: input should be Uint8Array');
            const payload = data.slice(0, -len);
            const newChecksum = fn(payload).slice(0, len);
            const oldChecksum = data.slice(-len);
            for (let i = 0; i < len; i++)
                if (newChecksum[i] !== oldChecksum[i])
                    throw new Error('Invalid checksum');
            return payload;
        },
    };
}
exports.utils = { alphabet, chain, checksum, radix, radix2, join, padding };
exports.base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
exports.base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
exports.base32hex = chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
exports.base32crockford = chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize((s) => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
exports.base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
exports.base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
const genBase58 = (abc) => chain(radix(58), alphabet(abc), join(''));
exports.base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
exports.base58flickr = genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
exports.base58xrp = genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
exports.base58xmr = {
    encode(data) {
        let res = '';
        for (let i = 0; i < data.length; i += 8) {
            const block = data.subarray(i, i + 8);
            res += exports.base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
        }
        return res;
    },
    decode(str) {
        let res = [];
        for (let i = 0; i < str.length; i += 11) {
            const slice = str.slice(i, i + 11);
            const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
            const block = exports.base58.decode(slice);
            for (let j = 0; j < block.length - blockLen; j++) {
                if (block[j] !== 0)
                    throw new Error('base58xmr: wrong padding');
            }
            res = res.concat(Array.from(block.slice(block.length - blockLen)));
        }
        return Uint8Array.from(res);
    },
};
const base58check = (sha256) => chain(checksum(4, (data) => sha256(sha256(data))), exports.base58);
exports.base58check = base58check;
const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod(pre) {
    const b = pre >> 25;
    let chk = (pre & 0x1ffffff) << 5;
    for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
        if (((b >> i) & 1) === 1)
            chk ^= POLYMOD_GENERATORS[i];
    }
    return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
    const len = prefix.length;
    let chk = 1;
    for (let i = 0; i < len; i++) {
        const c = prefix.charCodeAt(i);
        if (c < 33 || c > 126)
            throw new Error(`Invalid prefix (${prefix})`);
        chk = bech32Polymod(chk) ^ (c >> 5);
    }
    chk = bech32Polymod(chk);
    for (let i = 0; i < len; i++)
        chk = bech32Polymod(chk) ^ (prefix.charCodeAt(i) & 0x1f);
    for (let v of words)
        chk = bech32Polymod(chk) ^ v;
    for (let i = 0; i < 6; i++)
        chk = bech32Polymod(chk);
    chk ^= encodingConst;
    return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
function genBech32(encoding) {
    const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
    const _words = radix2(5);
    const fromWords = _words.decode;
    const toWords = _words.encode;
    const fromWordsUnsafe = unsafeWrapper(fromWords);
    function encode(prefix, words, limit = 90) {
        if (typeof prefix !== 'string')
            throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
        if (!Array.isArray(words) || (words.length && typeof words[0] !== 'number'))
            throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
        const actualLength = prefix.length + 7 + words.length;
        if (limit !== false && actualLength > limit)
            throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
        prefix = prefix.toLowerCase();
        return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
    }
    function decode(str, limit = 90) {
        if (typeof str !== 'string')
            throw new Error(`bech32.decode input should be string, not ${typeof str}`);
        if (str.length < 8 || (limit !== false && str.length > limit))
            throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
        const lowered = str.toLowerCase();
        if (str !== lowered && str !== str.toUpperCase())
            throw new Error(`String must be lowercase or uppercase`);
        str = lowered;
        const sepIndex = str.lastIndexOf('1');
        if (sepIndex === 0 || sepIndex === -1)
            throw new Error(`Letter "1" must be present between prefix and data only`);
        const prefix = str.slice(0, sepIndex);
        const _words = str.slice(sepIndex + 1);
        if (_words.length < 6)
            throw new Error('Data must be at least 6 characters long');
        const words = BECH_ALPHABET.decode(_words).slice(0, -6);
        const sum = bechChecksum(prefix, words, ENCODING_CONST);
        if (!_words.endsWith(sum))
            throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
        return { prefix, words };
    }
    const decodeUnsafe = unsafeWrapper(decode);
    function decodeToBytes(str) {
        const { prefix, words } = decode(str, false);
        return { prefix, words, bytes: fromWords(words) };
    }
    return { encode, decode, decodeToBytes, decodeUnsafe, fromWords, fromWordsUnsafe, toWords };
}
exports.bech32 = genBech32('bech32');
exports.bech32m = genBech32('bech32m');
exports.utf8 = {
    encode: (data) => new TextDecoder().decode(data),
    decode: (str) => new TextEncoder().encode(str),
};
exports.hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize((s) => {
    if (typeof s !== 'string' || s.length % 2)
        throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
    return s.toLowerCase();
}));
const CODERS = {
    utf8: exports.utf8, hex: exports.hex, base16: exports.base16, base32: exports.base32, base64: exports.base64, base64url: exports.base64url, base58: exports.base58, base58xmr: exports.base58xmr
};
const coderTypeError = `Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;
const bytesToString = (type, bytes) => {
    if (typeof type !== 'string' || !CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (!(bytes instanceof Uint8Array))
        throw new TypeError('bytesToString() expects Uint8Array');
    return CODERS[type].encode(bytes);
};
exports.bytesToString = bytesToString;
exports.str = exports.bytesToString;
const stringToBytes = (type, str) => {
    if (!CODERS.hasOwnProperty(type))
        throw new TypeError(coderTypeError);
    if (typeof str !== 'string')
        throw new TypeError('stringToBytes() expects string');
    return CODERS[type].decode(str);
};
exports.stringToBytes = stringToBytes;
exports.bytes = exports.stringToBytes;


/***/ }),

/***/ 2452:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HDKey = exports.HARDENED_OFFSET = void 0;
const hmac_1 = __nccwpck_require__(9149);
const ripemd160_1 = __nccwpck_require__(8369);
const sha256_1 = __nccwpck_require__(708);
const sha512_1 = __nccwpck_require__(5251);
const _assert_1 = __nccwpck_require__(3040);
const utils_1 = __nccwpck_require__(6161);
const secp = __nccwpck_require__(451);
const base_1 = __nccwpck_require__(9891);
secp.utils.hmacSha256Sync = (key, ...msgs) => (0, hmac_1.hmac)(sha256_1.sha256, key, secp.utils.concatBytes(...msgs));
const base58check = (0, base_1.base58check)(sha256_1.sha256);
function bytesToNumber(bytes) {
    return BigInt(`0x${(0, utils_1.bytesToHex)(bytes)}`);
}
function numberToBytes(num) {
    return (0, utils_1.hexToBytes)(num.toString(16).padStart(64, '0'));
}
const MASTER_SECRET = (0, utils_1.utf8ToBytes)('Bitcoin seed');
const BITCOIN_VERSIONS = { private: 0x0488ade4, public: 0x0488b21e };
exports.HARDENED_OFFSET = 0x80000000;
const hash160 = (data) => (0, ripemd160_1.ripemd160)((0, sha256_1.sha256)(data));
const fromU32 = (data) => (0, utils_1.createView)(data).getUint32(0, false);
const toU32 = (n) => {
    if (!Number.isSafeInteger(n) || n < 0 || n > 2 ** 32 - 1) {
        throw new Error(`Invalid number=${n}. Should be from 0 to 2 ** 32 - 1`);
    }
    const buf = new Uint8Array(4);
    (0, utils_1.createView)(buf).setUint32(0, n, false);
    return buf;
};
class HDKey {
    constructor(opt) {
        this.depth = 0;
        this.index = 0;
        this.chainCode = null;
        this.parentFingerprint = 0;
        if (!opt || typeof opt !== 'object') {
            throw new Error('HDKey.constructor must not be called directly');
        }
        this.versions = opt.versions || BITCOIN_VERSIONS;
        this.depth = opt.depth || 0;
        this.chainCode = opt.chainCode;
        this.index = opt.index || 0;
        this.parentFingerprint = opt.parentFingerprint || 0;
        if (!this.depth) {
            if (this.parentFingerprint || this.index) {
                throw new Error('HDKey: zero depth with non-zero index/parent fingerprint');
            }
        }
        if (opt.publicKey && opt.privateKey) {
            throw new Error('HDKey: publicKey and privateKey at same time.');
        }
        if (opt.privateKey) {
            if (!secp.utils.isValidPrivateKey(opt.privateKey)) {
                throw new Error('Invalid private key');
            }
            this.privKey =
                typeof opt.privateKey === 'bigint' ? opt.privateKey : bytesToNumber(opt.privateKey);
            this.privKeyBytes = numberToBytes(this.privKey);
            this.pubKey = secp.getPublicKey(opt.privateKey, true);
        }
        else if (opt.publicKey) {
            this.pubKey = secp.Point.fromHex(opt.publicKey).toRawBytes(true);
        }
        else {
            throw new Error('HDKey: no public or private key provided');
        }
        this.pubHash = hash160(this.pubKey);
    }
    get fingerprint() {
        if (!this.pubHash) {
            throw new Error('No publicKey set!');
        }
        return fromU32(this.pubHash);
    }
    get identifier() {
        return this.pubHash;
    }
    get pubKeyHash() {
        return this.pubHash;
    }
    get privateKey() {
        return this.privKeyBytes || null;
    }
    get publicKey() {
        return this.pubKey || null;
    }
    get privateExtendedKey() {
        const priv = this.privateKey;
        if (!priv) {
            throw new Error('No private key');
        }
        return base58check.encode(this.serialize(this.versions.private, (0, utils_1.concatBytes)(new Uint8Array([0]), priv)));
    }
    get publicExtendedKey() {
        if (!this.pubKey) {
            throw new Error('No public key');
        }
        return base58check.encode(this.serialize(this.versions.public, this.pubKey));
    }
    static fromMasterSeed(seed, versions = BITCOIN_VERSIONS) {
        (0, _assert_1.bytes)(seed);
        if (8 * seed.length < 128 || 8 * seed.length > 512) {
            throw new Error(`HDKey: wrong seed length=${seed.length}. Should be between 128 and 512 bits; 256 bits is advised)`);
        }
        const I = (0, hmac_1.hmac)(sha512_1.sha512, MASTER_SECRET, seed);
        return new HDKey({
            versions,
            chainCode: I.slice(32),
            privateKey: I.slice(0, 32),
        });
    }
    static fromExtendedKey(base58key, versions = BITCOIN_VERSIONS) {
        const keyBuffer = base58check.decode(base58key);
        const keyView = (0, utils_1.createView)(keyBuffer);
        const version = keyView.getUint32(0, false);
        const opt = {
            versions,
            depth: keyBuffer[4],
            parentFingerprint: keyView.getUint32(5, false),
            index: keyView.getUint32(9, false),
            chainCode: keyBuffer.slice(13, 45),
        };
        const key = keyBuffer.slice(45);
        const isPriv = key[0] === 0;
        if (version !== versions[isPriv ? 'private' : 'public']) {
            throw new Error('Version mismatch');
        }
        if (isPriv) {
            return new HDKey({ ...opt, privateKey: key.slice(1) });
        }
        else {
            return new HDKey({ ...opt, publicKey: key });
        }
    }
    static fromJSON(json) {
        return HDKey.fromExtendedKey(json.xpriv);
    }
    derive(path) {
        if (!/^[mM]'?/.test(path)) {
            throw new Error('Path must start with "m" or "M"');
        }
        if (/^[mM]'?$/.test(path)) {
            return this;
        }
        const parts = path.replace(/^[mM]'?\//, '').split('/');
        let child = this;
        for (const c of parts) {
            const m = /^(\d+)('?)$/.exec(c);
            if (!m || m.length !== 3) {
                throw new Error(`Invalid child index: ${c}`);
            }
            let idx = +m[1];
            if (!Number.isSafeInteger(idx) || idx >= exports.HARDENED_OFFSET) {
                throw new Error('Invalid index');
            }
            if (m[2] === "'") {
                idx += exports.HARDENED_OFFSET;
            }
            child = child.deriveChild(idx);
        }
        return child;
    }
    deriveChild(index) {
        if (!this.pubKey || !this.chainCode) {
            throw new Error('No publicKey or chainCode set');
        }
        let data = toU32(index);
        if (index >= exports.HARDENED_OFFSET) {
            const priv = this.privateKey;
            if (!priv) {
                throw new Error('Could not derive hardened child key');
            }
            data = (0, utils_1.concatBytes)(new Uint8Array([0]), priv, data);
        }
        else {
            data = (0, utils_1.concatBytes)(this.pubKey, data);
        }
        const I = (0, hmac_1.hmac)(sha512_1.sha512, this.chainCode, data);
        const childTweak = bytesToNumber(I.slice(0, 32));
        const chainCode = I.slice(32);
        if (!secp.utils.isValidPrivateKey(childTweak)) {
            throw new Error('Tweak bigger than curve order');
        }
        const opt = {
            versions: this.versions,
            chainCode,
            depth: this.depth + 1,
            parentFingerprint: this.fingerprint,
            index,
        };
        try {
            if (this.privateKey) {
                const added = secp.utils.mod(this.privKey + childTweak, secp.CURVE.n);
                if (!secp.utils.isValidPrivateKey(added)) {
                    throw new Error('The tweak was out of range or the resulted private key is invalid');
                }
                opt.privateKey = added;
            }
            else {
                const added = secp.Point.fromHex(this.pubKey).add(secp.Point.fromPrivateKey(childTweak));
                if (added.equals(secp.Point.ZERO)) {
                    throw new Error('The tweak was equal to negative P, which made the result key invalid');
                }
                opt.publicKey = added.toRawBytes(true);
            }
            return new HDKey(opt);
        }
        catch (err) {
            return this.deriveChild(index + 1);
        }
    }
    sign(hash) {
        if (!this.privateKey) {
            throw new Error('No privateKey set!');
        }
        (0, _assert_1.bytes)(hash, 32);
        return secp.signSync(hash, this.privKey, {
            canonical: true,
            der: false,
        });
    }
    verify(hash, signature) {
        (0, _assert_1.bytes)(hash, 32);
        (0, _assert_1.bytes)(signature, 64);
        if (!this.publicKey) {
            throw new Error('No publicKey set!');
        }
        let sig;
        try {
            sig = secp.Signature.fromCompact(signature);
        }
        catch (error) {
            return false;
        }
        return secp.verify(sig, hash, this.publicKey);
    }
    wipePrivateData() {
        this.privKey = undefined;
        if (this.privKeyBytes) {
            this.privKeyBytes.fill(0);
            this.privKeyBytes = undefined;
        }
        return this;
    }
    toJSON() {
        return {
            xpriv: this.privateExtendedKey,
            xpub: this.publicExtendedKey,
        };
    }
    serialize(version, key) {
        if (!this.chainCode) {
            throw new Error('No chainCode set');
        }
        (0, _assert_1.bytes)(key, 33);
        return (0, utils_1.concatBytes)(toU32(version), new Uint8Array([this.depth]), toU32(this.parentFingerprint), toU32(this.index), this.chainCode, key);
    }
}
exports.HDKey = HDKey;


/***/ }),

/***/ 5587:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.mnemonicToSeedSync = exports.mnemonicToSeed = exports.validateMnemonic = exports.entropyToMnemonic = exports.mnemonicToEntropy = exports.generateMnemonic = void 0;
/*! scure-bip39 - MIT License (c) 2022 Patricio Palladino, Paul Miller (paulmillr.com) */
const _assert_1 = __nccwpck_require__(3040);
const pbkdf2_1 = __nccwpck_require__(5058);
const sha256_1 = __nccwpck_require__(708);
const sha512_1 = __nccwpck_require__(5251);
const utils_1 = __nccwpck_require__(6161);
const base_1 = __nccwpck_require__(9891);
// Japanese wordlist
const isJapanese = (wordlist) => wordlist[0] === '\u3042\u3044\u3053\u304f\u3057\u3093';
// Normalization replaces equivalent sequences of characters
// so that any two texts that are equivalent will be reduced
// to the same sequence of code points, called the normal form of the original text.
function nfkd(str) {
    if (typeof str !== 'string')
        throw new TypeError(`Invalid mnemonic type: ${typeof str}`);
    return str.normalize('NFKD');
}
function normalize(str) {
    const norm = nfkd(str);
    const words = norm.split(' ');
    if (![12, 15, 18, 21, 24].includes(words.length))
        throw new Error('Invalid mnemonic');
    return { nfkd: norm, words };
}
function assertEntropy(entropy) {
    _assert_1.default.bytes(entropy, 16, 20, 24, 28, 32);
}
/**
 * Generate x random words. Uses Cryptographically-Secure Random Number Generator.
 * @param wordlist imported wordlist for specific language
 * @param strength mnemonic strength 128-256 bits
 * @example
 * generateMnemonic(wordlist, 128)
 * // 'legal winner thank year wave sausage worth useful legal winner thank yellow'
 */
function generateMnemonic(wordlist, strength = 128) {
    _assert_1.default.number(strength);
    if (strength % 32 !== 0 || strength > 256)
        throw new TypeError('Invalid entropy');
    return entropyToMnemonic((0, utils_1.randomBytes)(strength / 8), wordlist);
}
exports.generateMnemonic = generateMnemonic;
const calcChecksum = (entropy) => {
    // Checksum is ent.length/4 bits long
    const bitsLeft = 8 - entropy.length / 4;
    // Zero rightmost "bitsLeft" bits in byte
    // For example: bitsLeft=4 val=10111101 -> 10110000
    return new Uint8Array([((0, sha256_1.sha256)(entropy)[0] >> bitsLeft) << bitsLeft]);
};
function getCoder(wordlist) {
    if (!Array.isArray(wordlist) || wordlist.length !== 2048 || typeof wordlist[0] !== 'string')
        throw new Error('Worlist: expected array of 2048 strings');
    wordlist.forEach((i) => {
        if (typeof i !== 'string')
            throw new Error(`Wordlist: non-string element: ${i}`);
    });
    return base_1.utils.chain(base_1.utils.checksum(1, calcChecksum), base_1.utils.radix2(11, true), base_1.utils.alphabet(wordlist));
}
/**
 * Reversible: Converts mnemonic string to raw entropy in form of byte array.
 * @param mnemonic 12-24 words
 * @param wordlist imported wordlist for specific language
 * @example
 * const mnem = 'legal winner thank year wave sausage worth useful legal winner thank yellow';
 * mnemonicToEntropy(mnem, wordlist)
 * // Produces
 * new Uint8Array([
 *   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
 *   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f
 * ])
 */
function mnemonicToEntropy(mnemonic, wordlist) {
    const { words } = normalize(mnemonic);
    const entropy = getCoder(wordlist).decode(words);
    assertEntropy(entropy);
    return entropy;
}
exports.mnemonicToEntropy = mnemonicToEntropy;
/**
 * Reversible: Converts raw entropy in form of byte array to mnemonic string.
 * @param entropy byte array
 * @param wordlist imported wordlist for specific language
 * @returns 12-24 words
 * @example
 * const ent = new Uint8Array([
 *   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f,
 *   0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f, 0x7f
 * ]);
 * entropyToMnemonic(ent, wordlist);
 * // 'legal winner thank year wave sausage worth useful legal winner thank yellow'
 */
function entropyToMnemonic(entropy, wordlist) {
    assertEntropy(entropy);
    const words = getCoder(wordlist).encode(entropy);
    return words.join(isJapanese(wordlist) ? '\u3000' : ' ');
}
exports.entropyToMnemonic = entropyToMnemonic;
/**
 * Validates mnemonic for being 12-24 words contained in `wordlist`.
 */
function validateMnemonic(mnemonic, wordlist) {
    try {
        mnemonicToEntropy(mnemonic, wordlist);
    }
    catch (e) {
        return false;
    }
    return true;
}
exports.validateMnemonic = validateMnemonic;
const salt = (passphrase) => nfkd(`mnemonic${passphrase}`);
/**
 * Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
 * @param mnemonic 12-24 words
 * @param passphrase string that will additionally protect the key
 * @returns 64 bytes of key data
 * @example
 * const mnem = 'legal winner thank year wave sausage worth useful legal winner thank yellow';
 * await mnemonicToSeed(mnem, 'password');
 * // new Uint8Array([...64 bytes])
 */
function mnemonicToSeed(mnemonic, passphrase = '') {
    return (0, pbkdf2_1.pbkdf2Async)(sha512_1.sha512, normalize(mnemonic).nfkd, salt(passphrase), { c: 2048, dkLen: 64 });
}
exports.mnemonicToSeed = mnemonicToSeed;
/**
 * Irreversible: Uses KDF to derive 64 bytes of key data from mnemonic + optional password.
 * @param mnemonic 12-24 words
 * @param passphrase string that will additionally protect the key
 * @returns 64 bytes of key data
 * @example
 * const mnem = 'legal winner thank year wave sausage worth useful legal winner thank yellow';
 * mnemonicToSeedSync(mnem, 'password');
 * // new Uint8Array([...64 bytes])
 */
function mnemonicToSeedSync(mnemonic, passphrase = '') {
    return (0, pbkdf2_1.pbkdf2)(sha512_1.sha512, normalize(mnemonic).nfkd, salt(passphrase), { c: 2048, dkLen: 64 });
}
exports.mnemonicToSeedSync = mnemonicToSeedSync;


/***/ }),

/***/ 2502:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.wordlist = void 0;
exports.wordlist = `abandon
ability
able
about
above
absent
absorb
abstract
absurd
abuse
access
accident
account
accuse
achieve
acid
acoustic
acquire
across
act
action
actor
actress
actual
adapt
add
addict
address
adjust
admit
adult
advance
advice
aerobic
affair
afford
afraid
again
age
agent
agree
ahead
aim
air
airport
aisle
alarm
album
alcohol
alert
alien
all
alley
allow
almost
alone
alpha
already
also
alter
always
amateur
amazing
among
amount
amused
analyst
anchor
ancient
anger
angle
angry
animal
ankle
announce
annual
another
answer
antenna
antique
anxiety
any
apart
apology
appear
apple
approve
april
arch
arctic
area
arena
argue
arm
armed
armor
army
around
arrange
arrest
arrive
arrow
art
artefact
artist
artwork
ask
aspect
assault
asset
assist
assume
asthma
athlete
atom
attack
attend
attitude
attract
auction
audit
august
aunt
author
auto
autumn
average
avocado
avoid
awake
aware
away
awesome
awful
awkward
axis
baby
bachelor
bacon
badge
bag
balance
balcony
ball
bamboo
banana
banner
bar
barely
bargain
barrel
base
basic
basket
battle
beach
bean
beauty
because
become
beef
before
begin
behave
behind
believe
below
belt
bench
benefit
best
betray
better
between
beyond
bicycle
bid
bike
bind
biology
bird
birth
bitter
black
blade
blame
blanket
blast
bleak
bless
blind
blood
blossom
blouse
blue
blur
blush
board
boat
body
boil
bomb
bone
bonus
book
boost
border
boring
borrow
boss
bottom
bounce
box
boy
bracket
brain
brand
brass
brave
bread
breeze
brick
bridge
brief
bright
bring
brisk
broccoli
broken
bronze
broom
brother
brown
brush
bubble
buddy
budget
buffalo
build
bulb
bulk
bullet
bundle
bunker
burden
burger
burst
bus
business
busy
butter
buyer
buzz
cabbage
cabin
cable
cactus
cage
cake
call
calm
camera
camp
can
canal
cancel
candy
cannon
canoe
canvas
canyon
capable
capital
captain
car
carbon
card
cargo
carpet
carry
cart
case
cash
casino
castle
casual
cat
catalog
catch
category
cattle
caught
cause
caution
cave
ceiling
celery
cement
census
century
cereal
certain
chair
chalk
champion
change
chaos
chapter
charge
chase
chat
cheap
check
cheese
chef
cherry
chest
chicken
chief
child
chimney
choice
choose
chronic
chuckle
chunk
churn
cigar
cinnamon
circle
citizen
city
civil
claim
clap
clarify
claw
clay
clean
clerk
clever
click
client
cliff
climb
clinic
clip
clock
clog
close
cloth
cloud
clown
club
clump
cluster
clutch
coach
coast
coconut
code
coffee
coil
coin
collect
color
column
combine
come
comfort
comic
common
company
concert
conduct
confirm
congress
connect
consider
control
convince
cook
cool
copper
copy
coral
core
corn
correct
cost
cotton
couch
country
couple
course
cousin
cover
coyote
crack
cradle
craft
cram
crane
crash
crater
crawl
crazy
cream
credit
creek
crew
cricket
crime
crisp
critic
crop
cross
crouch
crowd
crucial
cruel
cruise
crumble
crunch
crush
cry
crystal
cube
culture
cup
cupboard
curious
current
curtain
curve
cushion
custom
cute
cycle
dad
damage
damp
dance
danger
daring
dash
daughter
dawn
day
deal
debate
debris
decade
december
decide
decline
decorate
decrease
deer
defense
define
defy
degree
delay
deliver
demand
demise
denial
dentist
deny
depart
depend
deposit
depth
deputy
derive
describe
desert
design
desk
despair
destroy
detail
detect
develop
device
devote
diagram
dial
diamond
diary
dice
diesel
diet
differ
digital
dignity
dilemma
dinner
dinosaur
direct
dirt
disagree
discover
disease
dish
dismiss
disorder
display
distance
divert
divide
divorce
dizzy
doctor
document
dog
doll
dolphin
domain
donate
donkey
donor
door
dose
double
dove
draft
dragon
drama
drastic
draw
dream
dress
drift
drill
drink
drip
drive
drop
drum
dry
duck
dumb
dune
during
dust
dutch
duty
dwarf
dynamic
eager
eagle
early
earn
earth
easily
east
easy
echo
ecology
economy
edge
edit
educate
effort
egg
eight
either
elbow
elder
electric
elegant
element
elephant
elevator
elite
else
embark
embody
embrace
emerge
emotion
employ
empower
empty
enable
enact
end
endless
endorse
enemy
energy
enforce
engage
engine
enhance
enjoy
enlist
enough
enrich
enroll
ensure
enter
entire
entry
envelope
episode
equal
equip
era
erase
erode
erosion
error
erupt
escape
essay
essence
estate
eternal
ethics
evidence
evil
evoke
evolve
exact
example
excess
exchange
excite
exclude
excuse
execute
exercise
exhaust
exhibit
exile
exist
exit
exotic
expand
expect
expire
explain
expose
express
extend
extra
eye
eyebrow
fabric
face
faculty
fade
faint
faith
fall
false
fame
family
famous
fan
fancy
fantasy
farm
fashion
fat
fatal
father
fatigue
fault
favorite
feature
february
federal
fee
feed
feel
female
fence
festival
fetch
fever
few
fiber
fiction
field
figure
file
film
filter
final
find
fine
finger
finish
fire
firm
first
fiscal
fish
fit
fitness
fix
flag
flame
flash
flat
flavor
flee
flight
flip
float
flock
floor
flower
fluid
flush
fly
foam
focus
fog
foil
fold
follow
food
foot
force
forest
forget
fork
fortune
forum
forward
fossil
foster
found
fox
fragile
frame
frequent
fresh
friend
fringe
frog
front
frost
frown
frozen
fruit
fuel
fun
funny
furnace
fury
future
gadget
gain
galaxy
gallery
game
gap
garage
garbage
garden
garlic
garment
gas
gasp
gate
gather
gauge
gaze
general
genius
genre
gentle
genuine
gesture
ghost
giant
gift
giggle
ginger
giraffe
girl
give
glad
glance
glare
glass
glide
glimpse
globe
gloom
glory
glove
glow
glue
goat
goddess
gold
good
goose
gorilla
gospel
gossip
govern
gown
grab
grace
grain
grant
grape
grass
gravity
great
green
grid
grief
grit
grocery
group
grow
grunt
guard
guess
guide
guilt
guitar
gun
gym
habit
hair
half
hammer
hamster
hand
happy
harbor
hard
harsh
harvest
hat
have
hawk
hazard
head
health
heart
heavy
hedgehog
height
hello
helmet
help
hen
hero
hidden
high
hill
hint
hip
hire
history
hobby
hockey
hold
hole
holiday
hollow
home
honey
hood
hope
horn
horror
horse
hospital
host
hotel
hour
hover
hub
huge
human
humble
humor
hundred
hungry
hunt
hurdle
hurry
hurt
husband
hybrid
ice
icon
idea
identify
idle
ignore
ill
illegal
illness
image
imitate
immense
immune
impact
impose
improve
impulse
inch
include
income
increase
index
indicate
indoor
industry
infant
inflict
inform
inhale
inherit
initial
inject
injury
inmate
inner
innocent
input
inquiry
insane
insect
inside
inspire
install
intact
interest
into
invest
invite
involve
iron
island
isolate
issue
item
ivory
jacket
jaguar
jar
jazz
jealous
jeans
jelly
jewel
job
join
joke
journey
joy
judge
juice
jump
jungle
junior
junk
just
kangaroo
keen
keep
ketchup
key
kick
kid
kidney
kind
kingdom
kiss
kit
kitchen
kite
kitten
kiwi
knee
knife
knock
know
lab
label
labor
ladder
lady
lake
lamp
language
laptop
large
later
latin
laugh
laundry
lava
law
lawn
lawsuit
layer
lazy
leader
leaf
learn
leave
lecture
left
leg
legal
legend
leisure
lemon
lend
length
lens
leopard
lesson
letter
level
liar
liberty
library
license
life
lift
light
like
limb
limit
link
lion
liquid
list
little
live
lizard
load
loan
lobster
local
lock
logic
lonely
long
loop
lottery
loud
lounge
love
loyal
lucky
luggage
lumber
lunar
lunch
luxury
lyrics
machine
mad
magic
magnet
maid
mail
main
major
make
mammal
man
manage
mandate
mango
mansion
manual
maple
marble
march
margin
marine
market
marriage
mask
mass
master
match
material
math
matrix
matter
maximum
maze
meadow
mean
measure
meat
mechanic
medal
media
melody
melt
member
memory
mention
menu
mercy
merge
merit
merry
mesh
message
metal
method
middle
midnight
milk
million
mimic
mind
minimum
minor
minute
miracle
mirror
misery
miss
mistake
mix
mixed
mixture
mobile
model
modify
mom
moment
monitor
monkey
monster
month
moon
moral
more
morning
mosquito
mother
motion
motor
mountain
mouse
move
movie
much
muffin
mule
multiply
muscle
museum
mushroom
music
must
mutual
myself
mystery
myth
naive
name
napkin
narrow
nasty
nation
nature
near
neck
need
negative
neglect
neither
nephew
nerve
nest
net
network
neutral
never
news
next
nice
night
noble
noise
nominee
noodle
normal
north
nose
notable
note
nothing
notice
novel
now
nuclear
number
nurse
nut
oak
obey
object
oblige
obscure
observe
obtain
obvious
occur
ocean
october
odor
off
offer
office
often
oil
okay
old
olive
olympic
omit
once
one
onion
online
only
open
opera
opinion
oppose
option
orange
orbit
orchard
order
ordinary
organ
orient
original
orphan
ostrich
other
outdoor
outer
output
outside
oval
oven
over
own
owner
oxygen
oyster
ozone
pact
paddle
page
pair
palace
palm
panda
panel
panic
panther
paper
parade
parent
park
parrot
party
pass
patch
path
patient
patrol
pattern
pause
pave
payment
peace
peanut
pear
peasant
pelican
pen
penalty
pencil
people
pepper
perfect
permit
person
pet
phone
photo
phrase
physical
piano
picnic
picture
piece
pig
pigeon
pill
pilot
pink
pioneer
pipe
pistol
pitch
pizza
place
planet
plastic
plate
play
please
pledge
pluck
plug
plunge
poem
poet
point
polar
pole
police
pond
pony
pool
popular
portion
position
possible
post
potato
pottery
poverty
powder
power
practice
praise
predict
prefer
prepare
present
pretty
prevent
price
pride
primary
print
priority
prison
private
prize
problem
process
produce
profit
program
project
promote
proof
property
prosper
protect
proud
provide
public
pudding
pull
pulp
pulse
pumpkin
punch
pupil
puppy
purchase
purity
purpose
purse
push
put
puzzle
pyramid
quality
quantum
quarter
question
quick
quit
quiz
quote
rabbit
raccoon
race
rack
radar
radio
rail
rain
raise
rally
ramp
ranch
random
range
rapid
rare
rate
rather
raven
raw
razor
ready
real
reason
rebel
rebuild
recall
receive
recipe
record
recycle
reduce
reflect
reform
refuse
region
regret
regular
reject
relax
release
relief
rely
remain
remember
remind
remove
render
renew
rent
reopen
repair
repeat
replace
report
require
rescue
resemble
resist
resource
response
result
retire
retreat
return
reunion
reveal
review
reward
rhythm
rib
ribbon
rice
rich
ride
ridge
rifle
right
rigid
ring
riot
ripple
risk
ritual
rival
river
road
roast
robot
robust
rocket
romance
roof
rookie
room
rose
rotate
rough
round
route
royal
rubber
rude
rug
rule
run
runway
rural
sad
saddle
sadness
safe
sail
salad
salmon
salon
salt
salute
same
sample
sand
satisfy
satoshi
sauce
sausage
save
say
scale
scan
scare
scatter
scene
scheme
school
science
scissors
scorpion
scout
scrap
screen
script
scrub
sea
search
season
seat
second
secret
section
security
seed
seek
segment
select
sell
seminar
senior
sense
sentence
series
service
session
settle
setup
seven
shadow
shaft
shallow
share
shed
shell
sheriff
shield
shift
shine
ship
shiver
shock
shoe
shoot
shop
short
shoulder
shove
shrimp
shrug
shuffle
shy
sibling
sick
side
siege
sight
sign
silent
silk
silly
silver
similar
simple
since
sing
siren
sister
situate
six
size
skate
sketch
ski
skill
skin
skirt
skull
slab
slam
sleep
slender
slice
slide
slight
slim
slogan
slot
slow
slush
small
smart
smile
smoke
smooth
snack
snake
snap
sniff
snow
soap
soccer
social
sock
soda
soft
solar
soldier
solid
solution
solve
someone
song
soon
sorry
sort
soul
sound
soup
source
south
space
spare
spatial
spawn
speak
special
speed
spell
spend
sphere
spice
spider
spike
spin
spirit
split
spoil
sponsor
spoon
sport
spot
spray
spread
spring
spy
square
squeeze
squirrel
stable
stadium
staff
stage
stairs
stamp
stand
start
state
stay
steak
steel
stem
step
stereo
stick
still
sting
stock
stomach
stone
stool
story
stove
strategy
street
strike
strong
struggle
student
stuff
stumble
style
subject
submit
subway
success
such
sudden
suffer
sugar
suggest
suit
summer
sun
sunny
sunset
super
supply
supreme
sure
surface
surge
surprise
surround
survey
suspect
sustain
swallow
swamp
swap
swarm
swear
sweet
swift
swim
swing
switch
sword
symbol
symptom
syrup
system
table
tackle
tag
tail
talent
talk
tank
tape
target
task
taste
tattoo
taxi
teach
team
tell
ten
tenant
tennis
tent
term
test
text
thank
that
theme
then
theory
there
they
thing
this
thought
three
thrive
throw
thumb
thunder
ticket
tide
tiger
tilt
timber
time
tiny
tip
tired
tissue
title
toast
tobacco
today
toddler
toe
together
toilet
token
tomato
tomorrow
tone
tongue
tonight
tool
tooth
top
topic
topple
torch
tornado
tortoise
toss
total
tourist
toward
tower
town
toy
track
trade
traffic
tragic
train
transfer
trap
trash
travel
tray
treat
tree
trend
trial
tribe
trick
trigger
trim
trip
trophy
trouble
truck
true
truly
trumpet
trust
truth
try
tube
tuition
tumble
tuna
tunnel
turkey
turn
turtle
twelve
twenty
twice
twin
twist
two
type
typical
ugly
umbrella
unable
unaware
uncle
uncover
under
undo
unfair
unfold
unhappy
uniform
unique
unit
universe
unknown
unlock
until
unusual
unveil
update
upgrade
uphold
upon
upper
upset
urban
urge
usage
use
used
useful
useless
usual
utility
vacant
vacuum
vague
valid
valley
valve
van
vanish
vapor
various
vast
vault
vehicle
velvet
vendor
venture
venue
verb
verify
version
very
vessel
veteran
viable
vibrant
vicious
victory
video
view
village
vintage
violin
virtual
virus
visa
visit
visual
vital
vivid
vocal
voice
void
volcano
volume
vote
voyage
wage
wagon
wait
walk
wall
walnut
want
warfare
warm
warrior
wash
wasp
waste
water
wave
way
wealth
weapon
wear
weasel
weather
web
wedding
weekend
weird
welcome
west
wet
whale
what
wheat
wheel
when
where
whip
whisper
wide
width
wife
wild
will
win
window
wine
wing
wink
winner
winter
wire
wisdom
wise
wish
witness
wolf
woman
wonder
wood
wool
word
work
world
worry
worth
wrap
wreck
wrestle
wrist
write
wrong
yard
year
yellow
you
young
youth
zebra
zero
zone
zoo`.split('\n');


/***/ }),

/***/ 7218:
/***/ ((module) => {

"use strict";


/**
 * Masks a buffer using the given mask.
 *
 * @param {Buffer} source The buffer to mask
 * @param {Buffer} mask The mask to use
 * @param {Buffer} output The buffer where to store the result
 * @param {Number} offset The offset at which to start writing
 * @param {Number} length The number of bytes to mask.
 * @public
 */
const mask = (source, mask, output, offset, length) => {
  for (var i = 0; i < length; i++) {
    output[offset + i] = source[i] ^ mask[i & 3];
  }
};

/**
 * Unmasks a buffer using the given mask.
 *
 * @param {Buffer} buffer The buffer to unmask
 * @param {Buffer} mask The mask to use
 * @public
 */
const unmask = (buffer, mask) => {
  // Required until https://github.com/nodejs/node/issues/9006 is resolved.
  const length = buffer.length;
  for (var i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
};

module.exports = { mask, unmask };


/***/ }),

/***/ 3352:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


try {
  module.exports = require(__nccwpck_require__.ab + "prebuilds/linux-x64/node.napi.node");
} catch (e) {
  module.exports = __nccwpck_require__(7218);
}


/***/ }),

/***/ 657:
/***/ ((module) => {

module.exports      = isTypedArray
isTypedArray.strict = isStrictTypedArray
isTypedArray.loose  = isLooseTypedArray

var toString = Object.prototype.toString
var names = {
    '[object Int8Array]': true
  , '[object Int16Array]': true
  , '[object Int32Array]': true
  , '[object Uint8Array]': true
  , '[object Uint8ClampedArray]': true
  , '[object Uint16Array]': true
  , '[object Uint32Array]': true
  , '[object Float32Array]': true
  , '[object Float64Array]': true
}

function isTypedArray(arr) {
  return (
       isStrictTypedArray(arr)
    || isLooseTypedArray(arr)
  )
}

function isStrictTypedArray(arr) {
  return (
       arr instanceof Int8Array
    || arr instanceof Int16Array
    || arr instanceof Int32Array
    || arr instanceof Uint8Array
    || arr instanceof Uint8ClampedArray
    || arr instanceof Uint16Array
    || arr instanceof Uint32Array
    || arr instanceof Float32Array
    || arr instanceof Float64Array
  )
}

function isLooseTypedArray(arr) {
  return names[toString.call(arr)]
}


/***/ }),

/***/ 259:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";

var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// index.ts
var nostr_tools_exports = {};
__export(nostr_tools_exports, {
  Kind: () => Kind,
  SimplePool: () => SimplePool,
  finishEvent: () => finishEvent,
  fj: () => fakejson_exports,
  generatePrivateKey: () => generatePrivateKey,
  getBlankEvent: () => getBlankEvent,
  getEventHash: () => getEventHash,
  getPublicKey: () => getPublicKey,
  matchFilter: () => matchFilter,
  matchFilters: () => matchFilters,
  nip04: () => nip04_exports,
  nip05: () => nip05_exports,
  nip06: () => nip06_exports,
  nip10: () => nip10_exports,
  nip13: () => nip13_exports,
  nip19: () => nip19_exports,
  nip21: () => nip21_exports,
  nip26: () => nip26_exports,
  nip27: () => nip27_exports,
  nip39: () => nip39_exports,
  nip42: () => nip42_exports,
  nip57: () => nip57_exports,
  parseReferences: () => parseReferences,
  relayInit: () => relayInit,
  serializeEvent: () => serializeEvent,
  signEvent: () => signEvent,
  utils: () => utils_exports,
  validateEvent: () => validateEvent,
  verifySignature: () => verifySignature
});
module.exports = __toCommonJS(nostr_tools_exports);

// keys.ts
var secp256k1 = __toESM(__nccwpck_require__(451));
function generatePrivateKey() {
  return secp256k1.utils.bytesToHex(secp256k1.utils.randomPrivateKey());
}
function getPublicKey(privateKey) {
  return secp256k1.utils.bytesToHex(secp256k1.schnorr.getPublicKey(privateKey));
}

// event.ts
var secp256k12 = __toESM(__nccwpck_require__(451));
var import_sha256 = __nccwpck_require__(708);

// utils.ts
var utils_exports = {};
__export(utils_exports, {
  insertEventIntoAscendingList: () => insertEventIntoAscendingList,
  insertEventIntoDescendingList: () => insertEventIntoDescendingList,
  normalizeURL: () => normalizeURL,
  utf8Decoder: () => utf8Decoder,
  utf8Encoder: () => utf8Encoder
});
var utf8Decoder = new TextDecoder("utf-8");
var utf8Encoder = new TextEncoder();
function normalizeURL(url) {
  let p = new URL(url);
  p.pathname = p.pathname.replace(/\/+/g, "/");
  if (p.pathname.endsWith("/"))
    p.pathname = p.pathname.slice(0, -1);
  if (p.port === "80" && p.protocol === "ws:" || p.port === "443" && p.protocol === "wss:")
    p.port = "";
  p.searchParams.sort();
  p.hash = "";
  return p.toString();
}
function insertEventIntoDescendingList(sortedArray, event) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at < sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at >= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at > event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at < event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (sortedArray[position]?.id !== event.id) {
    return [
      ...sortedArray.slice(0, position),
      event,
      ...sortedArray.slice(position)
    ];
  }
  return sortedArray;
}
function insertEventIntoAscendingList(sortedArray, event) {
  let start = 0;
  let end = sortedArray.length - 1;
  let midPoint;
  let position = start;
  if (end < 0) {
    position = 0;
  } else if (event.created_at > sortedArray[end].created_at) {
    position = end + 1;
  } else if (event.created_at <= sortedArray[start].created_at) {
    position = start;
  } else
    while (true) {
      if (end <= start + 1) {
        position = end;
        break;
      }
      midPoint = Math.floor(start + (end - start) / 2);
      if (sortedArray[midPoint].created_at < event.created_at) {
        start = midPoint;
      } else if (sortedArray[midPoint].created_at > event.created_at) {
        end = midPoint;
      } else {
        position = midPoint;
        break;
      }
    }
  if (sortedArray[position]?.id !== event.id) {
    return [
      ...sortedArray.slice(0, position),
      event,
      ...sortedArray.slice(position)
    ];
  }
  return sortedArray;
}

// event.ts
var Kind = /* @__PURE__ */ ((Kind2) => {
  Kind2[Kind2["Metadata"] = 0] = "Metadata";
  Kind2[Kind2["Text"] = 1] = "Text";
  Kind2[Kind2["RecommendRelay"] = 2] = "RecommendRelay";
  Kind2[Kind2["Contacts"] = 3] = "Contacts";
  Kind2[Kind2["EncryptedDirectMessage"] = 4] = "EncryptedDirectMessage";
  Kind2[Kind2["EventDeletion"] = 5] = "EventDeletion";
  Kind2[Kind2["Reaction"] = 7] = "Reaction";
  Kind2[Kind2["BadgeAward"] = 8] = "BadgeAward";
  Kind2[Kind2["ChannelCreation"] = 40] = "ChannelCreation";
  Kind2[Kind2["ChannelMetadata"] = 41] = "ChannelMetadata";
  Kind2[Kind2["ChannelMessage"] = 42] = "ChannelMessage";
  Kind2[Kind2["ChannelHideMessage"] = 43] = "ChannelHideMessage";
  Kind2[Kind2["ChannelMuteUser"] = 44] = "ChannelMuteUser";
  Kind2[Kind2["Report"] = 1984] = "Report";
  Kind2[Kind2["ZapRequest"] = 9734] = "ZapRequest";
  Kind2[Kind2["Zap"] = 9735] = "Zap";
  Kind2[Kind2["RelayList"] = 10002] = "RelayList";
  Kind2[Kind2["ClientAuth"] = 22242] = "ClientAuth";
  Kind2[Kind2["BadgeDefinition"] = 30008] = "BadgeDefinition";
  Kind2[Kind2["ProfileBadge"] = 30009] = "ProfileBadge";
  Kind2[Kind2["Article"] = 30023] = "Article";
  return Kind2;
})(Kind || {});
function getBlankEvent() {
  return {
    kind: 255,
    content: "",
    tags: [],
    created_at: 0
  };
}
function finishEvent(t, privateKey) {
  let event = t;
  event.pubkey = getPublicKey(privateKey);
  event.id = getEventHash(event);
  event.sig = signEvent(event, privateKey);
  return event;
}
function serializeEvent(evt) {
  if (!validateEvent(evt))
    throw new Error("can't serialize event with wrong or missing properties");
  return JSON.stringify([
    0,
    evt.pubkey,
    evt.created_at,
    evt.kind,
    evt.tags,
    evt.content
  ]);
}
function getEventHash(event) {
  let eventHash = (0, import_sha256.sha256)(utf8Encoder.encode(serializeEvent(event)));
  return secp256k12.utils.bytesToHex(eventHash);
}
var isRecord = (obj) => obj instanceof Object;
function validateEvent(event) {
  if (!isRecord(event))
    return false;
  if (typeof event.kind !== "number")
    return false;
  if (typeof event.content !== "string")
    return false;
  if (typeof event.created_at !== "number")
    return false;
  if (typeof event.pubkey !== "string")
    return false;
  if (!event.pubkey.match(/^[a-f0-9]{64}$/))
    return false;
  if (!Array.isArray(event.tags))
    return false;
  for (let i = 0; i < event.tags.length; i++) {
    let tag = event.tags[i];
    if (!Array.isArray(tag))
      return false;
    for (let j = 0; j < tag.length; j++) {
      if (typeof tag[j] === "object")
        return false;
    }
  }
  return true;
}
function verifySignature(event) {
  return secp256k12.schnorr.verifySync(
    event.sig,
    getEventHash(event),
    event.pubkey
  );
}
function signEvent(event, key) {
  return secp256k12.utils.bytesToHex(
    secp256k12.schnorr.signSync(getEventHash(event), key)
  );
}

// filter.ts
function matchFilter(filter, event) {
  if (filter.ids && filter.ids.indexOf(event.id) === -1) {
    if (!filter.ids.some((prefix) => event.id.startsWith(prefix))) {
      return false;
    }
  }
  if (filter.kinds && filter.kinds.indexOf(event.kind) === -1)
    return false;
  if (filter.authors && filter.authors.indexOf(event.pubkey) === -1) {
    if (!filter.authors.some((prefix) => event.pubkey.startsWith(prefix))) {
      return false;
    }
  }
  for (let f in filter) {
    if (f[0] === "#") {
      let tagName = f.slice(1);
      let values = filter[`#${tagName}`];
      if (values && !event.tags.find(
        ([t, v]) => t === f.slice(1) && values.indexOf(v) !== -1
      ))
        return false;
    }
  }
  if (filter.since && event.created_at < filter.since)
    return false;
  if (filter.until && event.created_at >= filter.until)
    return false;
  return true;
}
function matchFilters(filters, event) {
  for (let i = 0; i < filters.length; i++) {
    if (matchFilter(filters[i], event))
      return true;
  }
  return false;
}

// fakejson.ts
var fakejson_exports = {};
__export(fakejson_exports, {
  getHex64: () => getHex64,
  getInt: () => getInt,
  getSubscriptionId: () => getSubscriptionId,
  matchEventId: () => matchEventId,
  matchEventKind: () => matchEventKind,
  matchEventPubkey: () => matchEventPubkey
});
function getHex64(json, field) {
  let len = field.length + 3;
  let idx = json.indexOf(`"${field}":`) + len;
  let s = json.slice(idx).indexOf(`"`) + idx + 1;
  return json.slice(s, s + 64);
}
function getInt(json, field) {
  let len = field.length;
  let idx = json.indexOf(`"${field}":`) + len + 3;
  let sliced = json.slice(idx);
  let end = Math.min(sliced.indexOf(","), sliced.indexOf("}"));
  return parseInt(sliced.slice(0, end), 10);
}
function getSubscriptionId(json) {
  let idx = json.slice(0, 22).indexOf(`"EVENT"`);
  if (idx === -1)
    return null;
  let pstart = json.slice(idx + 7 + 1).indexOf(`"`);
  if (pstart === -1)
    return null;
  let start = idx + 7 + 1 + pstart;
  let pend = json.slice(start + 1, 80).indexOf(`"`);
  if (pend === -1)
    return null;
  let end = start + 1 + pend;
  return json.slice(start + 1, end);
}
function matchEventId(json, id) {
  return id === getHex64(json, "id");
}
function matchEventPubkey(json, pubkey) {
  return pubkey === getHex64(json, "pubkey");
}
function matchEventKind(json, kind) {
  return kind === getInt(json, "kind");
}

// relay.ts
var newListeners = () => ({
  connect: [],
  disconnect: [],
  error: [],
  notice: [],
  auth: []
});
function relayInit(url, options = {}) {
  let { listTimeout = 3e3, getTimeout = 3e3, countTimeout = 3e3 } = options;
  var ws;
  var openSubs = {};
  var listeners = newListeners();
  var subListeners = {};
  var pubListeners = {};
  var connectionPromise;
  async function connectRelay() {
    if (connectionPromise)
      return connectionPromise;
    connectionPromise = new Promise((resolve, reject) => {
      try {
        ws = new WebSocket(url);
      } catch (err) {
        reject(err);
      }
      ws.onopen = () => {
        listeners.connect.forEach((cb) => cb());
        resolve();
      };
      ws.onerror = () => {
        connectionPromise = void 0;
        listeners.error.forEach((cb) => cb());
        reject();
      };
      ws.onclose = async () => {
        connectionPromise = void 0;
        listeners.disconnect.forEach((cb) => cb());
      };
      let incomingMessageQueue = [];
      let handleNextInterval;
      ws.onmessage = (e) => {
        incomingMessageQueue.push(e.data);
        if (!handleNextInterval) {
          handleNextInterval = setInterval(handleNext, 0);
        }
      };
      function handleNext() {
        if (incomingMessageQueue.length === 0) {
          clearInterval(handleNextInterval);
          handleNextInterval = null;
          return;
        }
        var json = incomingMessageQueue.shift();
        if (!json)
          return;
        let subid = getSubscriptionId(json);
        if (subid) {
          let so = openSubs[subid];
          if (so && so.alreadyHaveEvent && so.alreadyHaveEvent(getHex64(json, "id"), url)) {
            return;
          }
        }
        try {
          let data = JSON.parse(json);
          switch (data[0]) {
            case "EVENT": {
              let id2 = data[1];
              let event = data[2];
              if (validateEvent(event) && openSubs[id2] && (openSubs[id2].skipVerification || verifySignature(event)) && matchFilters(openSubs[id2].filters, event)) {
                openSubs[id2];
                (subListeners[id2]?.event || []).forEach((cb) => cb(event));
              }
              return;
            }
            case "COUNT":
              let id = data[1];
              let payload = data[2];
              if (openSubs[id]) {
                ;
                (subListeners[id]?.count || []).forEach((cb) => cb(payload));
              }
              return;
            case "EOSE": {
              let id2 = data[1];
              if (id2 in subListeners) {
                subListeners[id2].eose.forEach((cb) => cb());
                subListeners[id2].eose = [];
              }
              return;
            }
            case "OK": {
              let id2 = data[1];
              let ok = data[2];
              let reason = data[3] || "";
              if (id2 in pubListeners) {
                if (ok)
                  pubListeners[id2].ok.forEach((cb) => cb());
                else
                  pubListeners[id2].failed.forEach((cb) => cb(reason));
                pubListeners[id2].ok = [];
                pubListeners[id2].failed = [];
              }
              return;
            }
            case "NOTICE":
              let notice = data[1];
              listeners.notice.forEach((cb) => cb(notice));
              return;
            case "AUTH": {
              let challenge = data[1];
              listeners.auth?.forEach((cb) => cb(challenge));
              return;
            }
          }
        } catch (err) {
          return;
        }
      }
    });
    return connectionPromise;
  }
  function connected() {
    return ws?.readyState === 1;
  }
  async function connect() {
    if (connected())
      return;
    await connectRelay();
  }
  async function trySend(params) {
    let msg = JSON.stringify(params);
    if (!connected()) {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      if (!connected()) {
        return;
      }
    }
    try {
      ws.send(msg);
    } catch (err) {
      console.log(err);
    }
  }
  const sub = (filters, {
    verb = "REQ",
    skipVerification = false,
    alreadyHaveEvent = null,
    id = Math.random().toString().slice(2)
  } = {}) => {
    let subid = id;
    openSubs[subid] = {
      id: subid,
      filters,
      skipVerification,
      alreadyHaveEvent
    };
    trySend([verb, subid, ...filters]);
    return {
      sub: (newFilters, newOpts = {}) => sub(newFilters || filters, {
        skipVerification: newOpts.skipVerification || skipVerification,
        alreadyHaveEvent: newOpts.alreadyHaveEvent || alreadyHaveEvent,
        id: subid
      }),
      unsub: () => {
        delete openSubs[subid];
        delete subListeners[subid];
        trySend(["CLOSE", subid]);
      },
      on: (type, cb) => {
        subListeners[subid] = subListeners[subid] || {
          event: [],
          count: [],
          eose: []
        };
        subListeners[subid][type].push(cb);
      },
      off: (type, cb) => {
        let listeners2 = subListeners[subid];
        let idx = listeners2[type].indexOf(cb);
        if (idx >= 0)
          listeners2[type].splice(idx, 1);
      }
    };
  };
  function _publishEvent(event, type) {
    if (!event.id)
      throw new Error(`event ${event} has no id`);
    let id = event.id;
    trySend([type, event]);
    return {
      on: (type2, cb) => {
        pubListeners[id] = pubListeners[id] || {
          ok: [],
          failed: []
        };
        pubListeners[id][type2].push(cb);
      },
      off: (type2, cb) => {
        let listeners2 = pubListeners[id];
        if (!listeners2)
          return;
        let idx = listeners2[type2].indexOf(cb);
        if (idx >= 0)
          listeners2[type2].splice(idx, 1);
      }
    };
  }
  return {
    url,
    sub,
    on: (type, cb) => {
      listeners[type].push(cb);
      if (type === "connect" && ws?.readyState === 1) {
        ;
        cb();
      }
    },
    off: (type, cb) => {
      let index = listeners[type].indexOf(cb);
      if (index !== -1)
        listeners[type].splice(index, 1);
    },
    list: (filters, opts) => new Promise((resolve) => {
      let s = sub(filters, opts);
      let events = [];
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(events);
      }, listTimeout);
      s.on("eose", () => {
        s.unsub();
        clearTimeout(timeout);
        resolve(events);
      });
      s.on("event", (event) => {
        events.push(event);
      });
    }),
    get: (filter, opts) => new Promise((resolve) => {
      let s = sub([filter], opts);
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, getTimeout);
      s.on("event", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    count: (filters) => new Promise((resolve) => {
      let s = sub(filters, { ...sub, verb: "COUNT" });
      let timeout = setTimeout(() => {
        s.unsub();
        resolve(null);
      }, countTimeout);
      s.on("count", (event) => {
        s.unsub();
        clearTimeout(timeout);
        resolve(event);
      });
    }),
    publish(event) {
      return _publishEvent(event, "EVENT");
    },
    auth(event) {
      return _publishEvent(event, "AUTH");
    },
    connect,
    close() {
      listeners = newListeners();
      subListeners = {};
      pubListeners = {};
      if (ws.readyState === WebSocket.OPEN) {
        ws?.close();
      }
    },
    get status() {
      return ws?.readyState ?? 3;
    }
  };
}

// pool.ts
var SimplePool = class {
  _conn;
  _seenOn = {};
  eoseSubTimeout;
  getTimeout;
  constructor(options = {}) {
    this._conn = {};
    this.eoseSubTimeout = options.eoseSubTimeout || 3400;
    this.getTimeout = options.getTimeout || 3400;
  }
  close(relays) {
    relays.forEach((url) => {
      let relay = this._conn[normalizeURL(url)];
      if (relay)
        relay.close();
    });
  }
  async ensureRelay(url) {
    const nm = normalizeURL(url);
    if (!this._conn[nm]) {
      this._conn[nm] = relayInit(nm, {
        getTimeout: this.getTimeout * 0.9,
        listTimeout: this.getTimeout * 0.9
      });
    }
    const relay = this._conn[nm];
    await relay.connect();
    return relay;
  }
  sub(relays, filters, opts) {
    let _knownIds = /* @__PURE__ */ new Set();
    let modifiedOpts = { ...opts || {} };
    modifiedOpts.alreadyHaveEvent = (id, url) => {
      if (opts?.alreadyHaveEvent?.(id, url)) {
        return true;
      }
      let set = this._seenOn[id] || /* @__PURE__ */ new Set();
      set.add(url);
      this._seenOn[id] = set;
      return _knownIds.has(id);
    };
    let subs = [];
    let eventListeners = /* @__PURE__ */ new Set();
    let eoseListeners = /* @__PURE__ */ new Set();
    let eosesMissing = relays.length;
    let eoseSent = false;
    let eoseTimeout = setTimeout(() => {
      eoseSent = true;
      for (let cb of eoseListeners.values())
        cb();
    }, this.eoseSubTimeout);
    relays.forEach(async (relay) => {
      let r;
      try {
        r = await this.ensureRelay(relay);
      } catch (err) {
        handleEose();
        return;
      }
      if (!r)
        return;
      let s = r.sub(filters, modifiedOpts);
      s.on("event", (event) => {
        _knownIds.add(event.id);
        for (let cb of eventListeners.values())
          cb(event);
      });
      s.on("eose", () => {
        if (eoseSent)
          return;
        handleEose();
      });
      subs.push(s);
      function handleEose() {
        eosesMissing--;
        if (eosesMissing === 0) {
          clearTimeout(eoseTimeout);
          for (let cb of eoseListeners.values())
            cb();
        }
      }
    });
    let greaterSub = {
      sub(filters2, opts2) {
        subs.forEach((sub) => sub.sub(filters2, opts2));
        return greaterSub;
      },
      unsub() {
        subs.forEach((sub) => sub.unsub());
      },
      on(type, cb) {
        if (type === "event") {
          eventListeners.add(cb);
        } else if (type === "eose") {
          eoseListeners.add(cb);
        }
      },
      off(type, cb) {
        if (type === "event") {
          eventListeners.delete(cb);
        } else if (type === "eose")
          eoseListeners.delete(cb);
      }
    };
    return greaterSub;
  }
  get(relays, filter, opts) {
    return new Promise((resolve) => {
      let sub = this.sub(relays, [filter], opts);
      let timeout = setTimeout(() => {
        sub.unsub();
        resolve(null);
      }, this.getTimeout);
      sub.on("event", (event) => {
        resolve(event);
        clearTimeout(timeout);
        sub.unsub();
      });
    });
  }
  list(relays, filters, opts) {
    return new Promise((resolve) => {
      let events = [];
      let sub = this.sub(relays, filters, opts);
      sub.on("event", (event) => {
        events.push(event);
      });
      sub.on("eose", () => {
        sub.unsub();
        resolve(events);
      });
    });
  }
  publish(relays, event) {
    const pubPromises = relays.map(async (relay) => {
      let r;
      try {
        r = await this.ensureRelay(relay);
        return r.publish(event);
      } catch (_) {
        return { on() {
        }, off() {
        } };
      }
    });
    const callbackMap = /* @__PURE__ */ new Map();
    return {
      on(type, cb) {
        relays.forEach(async (relay, i) => {
          let pub = await pubPromises[i];
          let callback = () => cb(relay);
          callbackMap.set(cb, callback);
          pub.on(type, callback);
        });
      },
      off(type, cb) {
        relays.forEach(async (_, i) => {
          let callback = callbackMap.get(cb);
          if (callback) {
            let pub = await pubPromises[i];
            pub.off(type, callback);
          }
        });
      }
    };
  }
  seenOn(id) {
    return Array.from(this._seenOn[id]?.values?.() || []);
  }
};

// nip19.ts
var nip19_exports = {};
__export(nip19_exports, {
  decode: () => decode,
  naddrEncode: () => naddrEncode,
  neventEncode: () => neventEncode,
  noteEncode: () => noteEncode,
  nprofileEncode: () => nprofileEncode,
  npubEncode: () => npubEncode,
  nrelayEncode: () => nrelayEncode,
  nsecEncode: () => nsecEncode
});
var secp256k13 = __toESM(__nccwpck_require__(451));
var import_base = __nccwpck_require__(9891);
var Bech32MaxSize = 5e3;
function decode(nip19) {
  let { prefix, words } = import_base.bech32.decode(nip19, Bech32MaxSize);
  let data = new Uint8Array(import_base.bech32.fromWords(words));
  switch (prefix) {
    case "nprofile": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nprofile");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      return {
        type: "nprofile",
        data: {
          pubkey: secp256k13.utils.bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nevent": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nevent");
      if (tlv[0][0].length !== 32)
        throw new Error("TLV 0 should be 32 bytes");
      if (tlv[2] && tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      return {
        type: "nevent",
        data: {
          id: secp256k13.utils.bytesToHex(tlv[0][0]),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : [],
          author: tlv[2]?.[0] ? secp256k13.utils.bytesToHex(tlv[2][0]) : void 0
        }
      };
    }
    case "naddr": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for naddr");
      if (!tlv[2]?.[0])
        throw new Error("missing TLV 2 for naddr");
      if (tlv[2][0].length !== 32)
        throw new Error("TLV 2 should be 32 bytes");
      if (!tlv[3]?.[0])
        throw new Error("missing TLV 3 for naddr");
      if (tlv[3][0].length !== 4)
        throw new Error("TLV 3 should be 4 bytes");
      return {
        type: "naddr",
        data: {
          identifier: utf8Decoder.decode(tlv[0][0]),
          pubkey: secp256k13.utils.bytesToHex(tlv[2][0]),
          kind: parseInt(secp256k13.utils.bytesToHex(tlv[3][0]), 16),
          relays: tlv[1] ? tlv[1].map((d) => utf8Decoder.decode(d)) : []
        }
      };
    }
    case "nrelay": {
      let tlv = parseTLV(data);
      if (!tlv[0]?.[0])
        throw new Error("missing TLV 0 for nrelay");
      return {
        type: "nrelay",
        data: utf8Decoder.decode(tlv[0][0])
      };
    }
    case "nsec":
    case "npub":
    case "note":
      return { type: prefix, data: secp256k13.utils.bytesToHex(data) };
    default:
      throw new Error(`unknown prefix ${prefix}`);
  }
}
function parseTLV(data) {
  let result = {};
  let rest = data;
  while (rest.length > 0) {
    let t = rest[0];
    let l = rest[1];
    let v = rest.slice(2, 2 + l);
    rest = rest.slice(2 + l);
    if (v.length < l)
      continue;
    result[t] = result[t] || [];
    result[t].push(v);
  }
  return result;
}
function nsecEncode(hex) {
  return encodeBytes("nsec", hex);
}
function npubEncode(hex) {
  return encodeBytes("npub", hex);
}
function noteEncode(hex) {
  return encodeBytes("note", hex);
}
function encodeBytes(prefix, hex) {
  let data = secp256k13.utils.hexToBytes(hex);
  let words = import_base.bech32.toWords(data);
  return import_base.bech32.encode(prefix, words, Bech32MaxSize);
}
function nprofileEncode(profile) {
  let data = encodeTLV({
    0: [secp256k13.utils.hexToBytes(profile.pubkey)],
    1: (profile.relays || []).map((url) => utf8Encoder.encode(url))
  });
  let words = import_base.bech32.toWords(data);
  return import_base.bech32.encode("nprofile", words, Bech32MaxSize);
}
function neventEncode(event) {
  let data = encodeTLV({
    0: [secp256k13.utils.hexToBytes(event.id)],
    1: (event.relays || []).map((url) => utf8Encoder.encode(url)),
    2: event.author ? [secp256k13.utils.hexToBytes(event.author)] : []
  });
  let words = import_base.bech32.toWords(data);
  return import_base.bech32.encode("nevent", words, Bech32MaxSize);
}
function naddrEncode(addr) {
  let kind = new ArrayBuffer(4);
  new DataView(kind).setUint32(0, addr.kind, false);
  let data = encodeTLV({
    0: [utf8Encoder.encode(addr.identifier)],
    1: (addr.relays || []).map((url) => utf8Encoder.encode(url)),
    2: [secp256k13.utils.hexToBytes(addr.pubkey)],
    3: [new Uint8Array(kind)]
  });
  let words = import_base.bech32.toWords(data);
  return import_base.bech32.encode("naddr", words, Bech32MaxSize);
}
function nrelayEncode(url) {
  let data = encodeTLV({
    0: [utf8Encoder.encode(url)]
  });
  let words = import_base.bech32.toWords(data);
  return import_base.bech32.encode("nrelay", words, Bech32MaxSize);
}
function encodeTLV(tlv) {
  let entries = [];
  Object.entries(tlv).forEach(([t, vs]) => {
    vs.forEach((v) => {
      let entry = new Uint8Array(v.length + 2);
      entry.set([parseInt(t)], 0);
      entry.set([v.length], 1);
      entry.set(v, 2);
      entries.push(entry);
    });
  });
  return secp256k13.utils.concatBytes(...entries);
}

// references.ts
var mentionRegex = /\bnostr:((note|npub|naddr|nevent|nprofile)1\w+)\b|#\[(\d+)\]/g;
function parseReferences(evt) {
  let references = [];
  for (let ref of evt.content.matchAll(mentionRegex)) {
    if (ref[2]) {
      try {
        let { type, data } = decode(ref[1]);
        switch (type) {
          case "npub": {
            references.push({
              text: ref[0],
              profile: { pubkey: data, relays: [] }
            });
            break;
          }
          case "nprofile": {
            references.push({
              text: ref[0],
              profile: data
            });
            break;
          }
          case "note": {
            references.push({
              text: ref[0],
              event: { id: data, relays: [] }
            });
            break;
          }
          case "nevent": {
            references.push({
              text: ref[0],
              event: data
            });
            break;
          }
          case "naddr": {
            references.push({
              text: ref[0],
              address: data
            });
            break;
          }
        }
      } catch (err) {
      }
    } else if (ref[3]) {
      let idx = parseInt(ref[3], 10);
      let tag = evt.tags[idx];
      if (!tag)
        continue;
      switch (tag[0]) {
        case "p": {
          references.push({
            text: ref[0],
            profile: { pubkey: tag[1], relays: tag[2] ? [tag[2]] : [] }
          });
          break;
        }
        case "e": {
          references.push({
            text: ref[0],
            event: { id: tag[1], relays: tag[2] ? [tag[2]] : [] }
          });
          break;
        }
        case "a": {
          try {
            let [kind, pubkey, identifier] = tag[1].split(":");
            references.push({
              text: ref[0],
              address: {
                identifier,
                pubkey,
                kind: parseInt(kind, 10),
                relays: tag[2] ? [tag[2]] : []
              }
            });
          } catch (err) {
          }
          break;
        }
      }
    }
  }
  return references;
}

// nip04.ts
var nip04_exports = {};
__export(nip04_exports, {
  decrypt: () => decrypt,
  encrypt: () => encrypt
});
var import_utils4 = __nccwpck_require__(6161);
var secp256k14 = __toESM(__nccwpck_require__(451));
var import_base2 = __nccwpck_require__(9891);
async function encrypt(privkey, pubkey, text) {
  const key = secp256k14.getSharedSecret(privkey, "02" + pubkey);
  const normalizedKey = getNormalizedX(key);
  let iv = Uint8Array.from((0, import_utils4.randomBytes)(16));
  let plaintext = utf8Encoder.encode(text);
  let cryptoKey = await crypto.subtle.importKey(
    "raw",
    normalizedKey,
    { name: "AES-CBC" },
    false,
    ["encrypt"]
  );
  let ciphertext = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    plaintext
  );
  let ctb64 = import_base2.base64.encode(new Uint8Array(ciphertext));
  let ivb64 = import_base2.base64.encode(new Uint8Array(iv.buffer));
  return `${ctb64}?iv=${ivb64}`;
}
async function decrypt(privkey, pubkey, data) {
  let [ctb64, ivb64] = data.split("?iv=");
  let key = secp256k14.getSharedSecret(privkey, "02" + pubkey);
  let normalizedKey = getNormalizedX(key);
  let cryptoKey = await crypto.subtle.importKey(
    "raw",
    normalizedKey,
    { name: "AES-CBC" },
    false,
    ["decrypt"]
  );
  let ciphertext = import_base2.base64.decode(ctb64);
  let iv = import_base2.base64.decode(ivb64);
  let plaintext = await crypto.subtle.decrypt(
    { name: "AES-CBC", iv },
    cryptoKey,
    ciphertext
  );
  let text = utf8Decoder.decode(plaintext);
  return text;
}
function getNormalizedX(key) {
  return key.slice(1, 33);
}

// nip05.ts
var nip05_exports = {};
__export(nip05_exports, {
  queryProfile: () => queryProfile,
  searchDomain: () => searchDomain,
  useFetchImplementation: () => useFetchImplementation
});
var _fetch;
try {
  _fetch = fetch;
} catch {
}
function useFetchImplementation(fetchImplementation) {
  _fetch = fetchImplementation;
}
async function searchDomain(domain, query = "") {
  try {
    let res = await (await _fetch(`https://${domain}/.well-known/nostr.json?name=${query}`)).json();
    return res.names;
  } catch (_) {
    return {};
  }
}
async function queryProfile(fullname) {
  let [name, domain] = fullname.split("@");
  if (!domain) {
    domain = name;
    name = "_";
  }
  if (!name.match(/^[A-Za-z0-9-_.]+$/))
    return null;
  if (!domain.includes("."))
    return null;
  let res;
  try {
    res = await (await _fetch(`https://${domain}/.well-known/nostr.json?name=${name}`)).json();
  } catch (err) {
    return null;
  }
  if (!res?.names?.[name])
    return null;
  let pubkey = res.names[name];
  let relays = res.relays?.[pubkey] || [];
  return {
    pubkey,
    relays
  };
}

// nip06.ts
var nip06_exports = {};
__export(nip06_exports, {
  generateSeedWords: () => generateSeedWords,
  privateKeyFromSeedWords: () => privateKeyFromSeedWords,
  validateWords: () => validateWords
});
var secp256k15 = __toESM(__nccwpck_require__(451));
var import_english = __nccwpck_require__(2502);
var import_bip39 = __nccwpck_require__(5587);
var import_bip32 = __nccwpck_require__(2452);
function privateKeyFromSeedWords(mnemonic, passphrase) {
  let root = import_bip32.HDKey.fromMasterSeed((0, import_bip39.mnemonicToSeedSync)(mnemonic, passphrase));
  let privateKey = root.derive(`m/44'/1237'/0'/0/0`).privateKey;
  if (!privateKey)
    throw new Error("could not derive private key");
  return secp256k15.utils.bytesToHex(privateKey);
}
function generateSeedWords() {
  return (0, import_bip39.generateMnemonic)(import_english.wordlist);
}
function validateWords(words) {
  return (0, import_bip39.validateMnemonic)(words, import_english.wordlist);
}

// nip10.ts
var nip10_exports = {};
__export(nip10_exports, {
  parse: () => parse
});
function parse(event) {
  const result = {
    reply: void 0,
    root: void 0,
    mentions: [],
    profiles: []
  };
  const eTags = [];
  for (const tag of event.tags) {
    if (tag[0] === "e" && tag[1]) {
      eTags.push(tag);
    }
    if (tag[0] === "p" && tag[1]) {
      result.profiles.push({
        pubkey: tag[1],
        relays: tag[2] ? [tag[2]] : []
      });
    }
  }
  for (let eTagIndex = 0; eTagIndex < eTags.length; eTagIndex++) {
    const eTag = eTags[eTagIndex];
    const [_, eTagEventId, eTagRelayUrl, eTagMarker] = eTag;
    const eventPointer = {
      id: eTagEventId,
      relays: eTagRelayUrl ? [eTagRelayUrl] : []
    };
    const isFirstETag = eTagIndex === 0;
    const isLastETag = eTagIndex === eTags.length - 1;
    if (eTagMarker === "root") {
      result.root = eventPointer;
      continue;
    }
    if (eTagMarker === "reply") {
      result.reply = eventPointer;
      continue;
    }
    if (eTagMarker === "mention") {
      result.mentions.push(eventPointer);
      continue;
    }
    if (isFirstETag) {
      result.root = eventPointer;
      continue;
    }
    if (isLastETag) {
      result.reply = eventPointer;
      continue;
    }
    result.mentions.push(eventPointer);
  }
  return result;
}

// nip13.ts
var nip13_exports = {};
__export(nip13_exports, {
  getPow: () => getPow
});
var secp256k16 = __toESM(__nccwpck_require__(451));
function getPow(id) {
  return getLeadingZeroBits(secp256k16.utils.hexToBytes(id));
}
function getLeadingZeroBits(hash) {
  let total, i, bits;
  for (i = 0, total = 0; i < hash.length; i++) {
    bits = msb(hash[i]);
    total += bits;
    if (bits !== 8) {
      break;
    }
  }
  return total;
}
function msb(b) {
  let n = 0;
  if (b === 0) {
    return 8;
  }
  while (b >>= 1) {
    n++;
  }
  return 7 - n;
}

// nip21.ts
var nip21_exports = {};
__export(nip21_exports, {
  BECH32_REGEX: () => BECH32_REGEX,
  NOSTR_URI_REGEX: () => NOSTR_URI_REGEX,
  parse: () => parse2,
  test: () => test
});
var BECH32_REGEX = /[\x21-\x7E]{1,83}1[023456789acdefghjklmnpqrstuvwxyz]{6,}/;
var NOSTR_URI_REGEX = new RegExp(`nostr:(${BECH32_REGEX.source})`);
function test(value) {
  return typeof value === "string" && new RegExp(`^${NOSTR_URI_REGEX.source}$`).test(value);
}
function parse2(uri) {
  const match = uri.match(new RegExp(`^${NOSTR_URI_REGEX.source}$`));
  if (!match)
    throw new Error(`Invalid Nostr URI: ${uri}`);
  return {
    uri: match[0],
    value: match[1],
    decoded: decode(match[1])
  };
}

// nip26.ts
var nip26_exports = {};
__export(nip26_exports, {
  createDelegation: () => createDelegation,
  getDelegator: () => getDelegator
});
var secp256k17 = __toESM(__nccwpck_require__(451));
var import_sha2562 = __nccwpck_require__(708);
function createDelegation(privateKey, parameters) {
  let conditions = [];
  if ((parameters.kind || -1) >= 0)
    conditions.push(`kind=${parameters.kind}`);
  if (parameters.until)
    conditions.push(`created_at<${parameters.until}`);
  if (parameters.since)
    conditions.push(`created_at>${parameters.since}`);
  let cond = conditions.join("&");
  if (cond === "")
    throw new Error("refusing to create a delegation without any conditions");
  let sighash = (0, import_sha2562.sha256)(
    utf8Encoder.encode(`nostr:delegation:${parameters.pubkey}:${cond}`)
  );
  let sig = secp256k17.utils.bytesToHex(
    secp256k17.schnorr.signSync(sighash, privateKey)
  );
  return {
    from: getPublicKey(privateKey),
    to: parameters.pubkey,
    cond,
    sig
  };
}
function getDelegator(event) {
  let tag = event.tags.find((tag2) => tag2[0] === "delegation" && tag2.length >= 4);
  if (!tag)
    return null;
  let pubkey = tag[1];
  let cond = tag[2];
  let sig = tag[3];
  let conditions = cond.split("&");
  for (let i = 0; i < conditions.length; i++) {
    let [key, operator, value] = conditions[i].split(/\b/);
    if (key === "kind" && operator === "=" && event.kind === parseInt(value))
      continue;
    else if (key === "created_at" && operator === "<" && event.created_at < parseInt(value))
      continue;
    else if (key === "created_at" && operator === ">" && event.created_at > parseInt(value))
      continue;
    else
      return null;
  }
  let sighash = (0, import_sha2562.sha256)(
    utf8Encoder.encode(`nostr:delegation:${event.pubkey}:${cond}`)
  );
  if (!secp256k17.schnorr.verifySync(sig, sighash, pubkey))
    return null;
  return pubkey;
}

// nip27.ts
var nip27_exports = {};
__export(nip27_exports, {
  matchAll: () => matchAll,
  regex: () => regex,
  replaceAll: () => replaceAll
});
var regex = () => new RegExp(`\\b${NOSTR_URI_REGEX.source}\\b`, "g");
function* matchAll(content) {
  const matches = content.matchAll(regex());
  for (const match of matches) {
    const [uri, value] = match;
    yield {
      uri,
      value,
      decoded: decode(value),
      start: match.index,
      end: match.index + uri.length
    };
  }
}
function replaceAll(content, replacer) {
  return content.replaceAll(regex(), (uri, value) => {
    return replacer({
      uri,
      value,
      decoded: decode(value)
    });
  });
}

// nip39.ts
var nip39_exports = {};
__export(nip39_exports, {
  useFetchImplementation: () => useFetchImplementation2,
  validateGithub: () => validateGithub
});
var _fetch2;
try {
  _fetch2 = fetch;
} catch {
}
function useFetchImplementation2(fetchImplementation) {
  _fetch2 = fetchImplementation;
}
async function validateGithub(pubkey, username, proof) {
  try {
    let res = await (await _fetch2(`https://gist.github.com/${username}/${proof}/raw`)).text();
    return res === `Verifying that I control the following Nostr public key: ${pubkey}`;
  } catch (_) {
    return false;
  }
}

// nip42.ts
var nip42_exports = {};
__export(nip42_exports, {
  authenticate: () => authenticate
});
var authenticate = async ({
  challenge,
  relay,
  sign
}) => {
  const e = {
    kind: 22242 /* ClientAuth */,
    created_at: Math.floor(Date.now() / 1e3),
    tags: [
      ["relay", relay.url],
      ["challenge", challenge]
    ],
    content: ""
  };
  const pub = relay.auth(await sign(e));
  return new Promise((resolve, reject) => {
    pub.on("ok", function ok() {
      pub.off("ok", ok);
      resolve();
    });
    pub.on("failed", function fail(reason) {
      pub.off("failed", fail);
      reject(reason);
    });
  });
};

// nip57.ts
var nip57_exports = {};
__export(nip57_exports, {
  getZapEndpoint: () => getZapEndpoint,
  makeZapReceipt: () => makeZapReceipt,
  makeZapRequest: () => makeZapRequest,
  useFetchImplementation: () => useFetchImplementation3,
  validateZapRequest: () => validateZapRequest
});
var import_base3 = __nccwpck_require__(9891);
var _fetch3;
try {
  _fetch3 = fetch;
} catch {
}
function useFetchImplementation3(fetchImplementation) {
  _fetch3 = fetchImplementation;
}
async function getZapEndpoint(metadata) {
  try {
    let lnurl = "";
    let { lud06, lud16 } = JSON.parse(metadata.content);
    if (lud06) {
      let { words } = import_base3.bech32.decode(lud06, 1e3);
      let data = import_base3.bech32.fromWords(words);
      lnurl = utf8Decoder.decode(data);
    } else if (lud16) {
      let [name, domain] = lud16.split("@");
      lnurl = `https://${domain}/.well-known/lnurlp/${name}`;
    } else {
      return null;
    }
    let res = await _fetch3(lnurl);
    let body = await res.json();
    if (body.allowsNostr && body.nostrPubkey) {
      return body.callback;
    }
  } catch (err) {
  }
  return null;
}
function makeZapRequest({
  profile,
  event,
  amount,
  relays,
  comment = ""
}) {
  if (!amount)
    throw new Error("amount not given");
  if (!profile)
    throw new Error("profile not given");
  let zr = {
    kind: 9734,
    created_at: Math.round(Date.now() / 1e3),
    content: comment,
    tags: [
      ["p", profile],
      ["amount", amount.toString()],
      ["relays", ...relays]
    ]
  };
  if (event) {
    zr.tags.push(["e", event]);
  }
  return zr;
}
function validateZapRequest(zapRequestString) {
  let zapRequest;
  try {
    zapRequest = JSON.parse(zapRequestString);
  } catch (err) {
    return "Invalid zap request JSON.";
  }
  if (!validateEvent(zapRequest))
    return "Zap request is not a valid Nostr event.";
  if (!verifySignature(zapRequest))
    return "Invalid signature on zap request.";
  let p = zapRequest.tags.find(([t, v]) => t === "p" && v);
  if (!p)
    return "Zap request doesn't have a 'p' tag.";
  if (!p[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'p' tag is not valid hex.";
  let e = zapRequest.tags.find(([t, v]) => t === "e" && v);
  if (e && !e[1].match(/^[a-f0-9]{64}$/))
    return "Zap request 'e' tag is not valid hex.";
  let relays = zapRequest.tags.find(([t, v]) => t === "relays" && v);
  if (!relays)
    return "Zap request doesn't have a 'relays' tag.";
  return null;
}
function makeZapReceipt({
  zapRequest,
  preimage,
  bolt11,
  paidAt
}) {
  let zr = JSON.parse(zapRequest);
  let tagsFromZapRequest = zr.tags.filter(
    ([t]) => t === "e" || t === "p" || t === "a"
  );
  let zap = {
    kind: 9735,
    created_at: Math.round(paidAt.getTime() / 1e3),
    content: "",
    tags: [
      ...tagsFromZapRequest,
      ["bolt11", bolt11],
      ["description", zapRequest]
    ]
  };
  if (preimage) {
    zap.tags.push(["preimage", preimage]);
  }
  return zap;
}

// index.ts
var secp256k18 = __toESM(__nccwpck_require__(451));
var import_hmac = __nccwpck_require__(9149);
var import_sha2563 = __nccwpck_require__(708);
secp256k18.utils.hmacSha256Sync = (key, ...msgs) => (0, import_hmac.hmac)(import_sha2563.sha256, key, secp256k18.utils.concatBytes(...msgs));
secp256k18.utils.sha256Sync = (...msgs) => (0, import_sha2563.sha256)(secp256k18.utils.concatBytes(...msgs));


/***/ }),

/***/ 9868:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Container = void 0;
var ForOfAdaptor_1 = __nccwpck_require__(5767);
/**
 * Basic container.
 *
 * @template T Stored elements' type
 * @template SourceT Derived type extending this {@link Container}
 * @template IteratorT Iterator type
 * @template ReverseT Reverse iterator type
 * @template PElem Parent type of *T*, used for inserting elements through {@link assign} and {@link insert}.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var Container = /** @class */ (function () {
    function Container() {
    }
    /**
     * @inheritDoc
     */
    Container.prototype.empty = function () {
        return this.size() === 0;
    };
    /**
     * @inheritDoc
     */
    Container.prototype.rbegin = function () {
        return this.end().reverse();
    };
    /**
     * @inheritDoc
     */
    Container.prototype.rend = function () {
        return this.begin().reverse();
    };
    /**
     * @inheritDoc
     */
    Container.prototype[Symbol.iterator] = function () {
        return new ForOfAdaptor_1.ForOfAdaptor(this.begin(), this.end());
    };
    /**
     * @inheritDoc
     */
    Container.prototype.toJSON = function () {
        var e_1, _a;
        var ret = [];
        try {
            for (var _b = __values(this), _c = _b.next(); !_c.done; _c = _b.next()) {
                var elem = _c.value;
                ret.push(elem);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return ret;
    };
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=Container.js.map

/***/ }),

/***/ 7957:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapContainer = void 0;
var Container_1 = __nccwpck_require__(9868);
var NativeArrayIterator_1 = __nccwpck_require__(6445);
/**
 * Basic map container.
 *
 * @template Key Key type
 * @template T Mapped type
 * @template Unique Whether duplicated key is blocked or not
 * @template Source Derived type extending this {@link MapContainer}
 * @template IteratorT Iterator type
 * @template ReverseT Reverse iterator type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var MapContainer = /** @class */ (function (_super) {
    __extends(MapContainer, _super);
    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    function MapContainer(factory) {
        var _this = _super.call(this) || this;
        _this.data_ = factory(_this);
        return _this;
    }
    /**
     * @inheritDoc
     */
    MapContainer.prototype.assign = function (first, last) {
        // INSERT
        this.clear();
        this.insert(first, last);
    };
    /**
     * @inheritDoc
     */
    MapContainer.prototype.clear = function () {
        // TO BE ABSTRACT
        this.data_.clear();
    };
    /**
     * @inheritDoc
     */
    MapContainer.prototype.begin = function () {
        return this.data_.begin();
    };
    /**
     * @inheritDoc
     */
    MapContainer.prototype.end = function () {
        return this.data_.end();
    };
    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    MapContainer.prototype.has = function (key) {
        return !this.find(key).equals(this.end());
    };
    /**
     * @inheritDoc
     */
    MapContainer.prototype.size = function () {
        return this.data_.size();
    };
    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - UTILITY
            - POST-PROCESS
    ============================================================
        INSERT
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    MapContainer.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        // INSERT BY RANGE
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this.insert(first, last);
        // RETURN SIZE
        return this.size();
    };
    MapContainer.prototype.insert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1)
            return this.emplace(args[0].first, args[0].second);
        else if (args[0].next instanceof Function &&
            args[1].next instanceof Function)
            return this._Insert_by_range(args[0], args[1]);
        else
            return this.emplace_hint(args[0], args[1].first, args[1].second);
    };
    MapContainer.prototype.erase = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1 &&
            (args[0] instanceof this.end().constructor === false ||
                args[0].source() !== this))
            return this._Erase_by_key(args[0]);
        else if (args.length === 1)
            return this._Erase_by_range(args[0]);
        else
            return this._Erase_by_range(args[0], args[1]);
    };
    MapContainer.prototype._Erase_by_range = function (first, last) {
        if (last === void 0) { last = first.next(); }
        // ERASE
        var it = this.data_.erase(first, last);
        // POST-PROCESS
        this._Handle_erase(first, last);
        return it;
    };
    return MapContainer;
}(Container_1.Container));
exports.MapContainer = MapContainer;
//# sourceMappingURL=MapContainer.js.map

/***/ }),

/***/ 1505:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetContainer = void 0;
var Container_1 = __nccwpck_require__(9868);
var NativeArrayIterator_1 = __nccwpck_require__(6445);
/**
 * Basic set container.
 *
 * @template Key Key type
 * @template Unique Whether duplicated key is blocked or not
 * @template Source Derived type extending this {@link SetContainer}
 * @template IteratorT Iterator type
 * @template ReverseT Reverse iterator type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var SetContainer = /** @class */ (function (_super) {
    __extends(SetContainer, _super);
    /* ---------------------------------------------------------
        CONSTURCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    function SetContainer(factory) {
        var _this = _super.call(this) || this;
        _this.data_ = factory(_this);
        return _this;
    }
    /**
     * @inheritDoc
     */
    SetContainer.prototype.assign = function (first, last) {
        // INSERT
        this.clear();
        this.insert(first, last);
    };
    /**
     * @inheritDoc
     */
    SetContainer.prototype.clear = function () {
        // TO BE ABSTRACT
        this.data_.clear();
    };
    /**
     * @inheritDoc
     */
    SetContainer.prototype.begin = function () {
        return this.data_.begin();
    };
    /**
     * @inheritDoc
     */
    SetContainer.prototype.end = function () {
        return this.data_.end();
    };
    /* ---------------------------------------------------------
        ELEMENTS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    SetContainer.prototype.has = function (key) {
        return !this.find(key).equals(this.end());
    };
    /**
     * @inheritDoc
     */
    SetContainer.prototype.size = function () {
        return this.data_.size();
    };
    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - ERASE
            - UTILITY
            - POST-PROCESS
    ============================================================
        INSERT
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    SetContainer.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (items.length === 0)
            return this.size();
        // INSERT BY RANGE
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this._Insert_by_range(first, last);
        // RETURN SIZE
        return this.size();
    };
    SetContainer.prototype.insert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1)
            return this._Insert_by_key(args[0]);
        else if (args[0].next instanceof Function &&
            args[1].next instanceof Function)
            return this._Insert_by_range(args[0], args[1]);
        else
            return this._Insert_by_hint(args[0], args[1]);
    };
    SetContainer.prototype.erase = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 1 &&
            !(args[0] instanceof this.end().constructor &&
                args[0].source() === this))
            return this._Erase_by_val(args[0]);
        else if (args.length === 1)
            return this._Erase_by_range(args[0]);
        else
            return this._Erase_by_range(args[0], args[1]);
    };
    SetContainer.prototype._Erase_by_range = function (first, last) {
        if (last === void 0) { last = first.next(); }
        // ERASE
        var it = this.data_.erase(first, last);
        // POST-PROCESS
        this._Handle_erase(first, last);
        return it;
    };
    return SetContainer;
}(Container_1.Container));
exports.SetContainer = SetContainer;
//# sourceMappingURL=SetContainer.js.map

/***/ }),

/***/ 3077:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UniqueMap = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.base
 */
//================================================================
var MapContainer_1 = __nccwpck_require__(7957);
var ErrorGenerator_1 = __nccwpck_require__(424);
/**
 * Basic map container blocking duplicated key.
 *
 * @template Key Key type
 * @template T Mapped type
 * @template Source Derived type extending this {@link UniqueMap}
 * @template IteratorT Iterator type
 * @template ReverseT Reverse iterator type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var UniqueMap = /** @class */ (function (_super) {
    __extends(UniqueMap, _super);
    function UniqueMap() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    UniqueMap.prototype.count = function (key) {
        return this.find(key).equals(this.end()) ? 0 : 1;
    };
    /**
     * Get a value.
     *
     * @param key Key to search for.
     * @return The value mapped by the key.
     */
    UniqueMap.prototype.get = function (key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
            throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "get", key);
        return it.second;
    };
    /**
     * Take a value.
     *
     * Get a value, or set the value and returns it.
     *
     * @param key Key to search for.
     * @param generator Value generator when the matched key not found
     * @returns Value, anyway
     */
    UniqueMap.prototype.take = function (key, generator) {
        var it = this.find(key);
        return it.equals(this.end())
            ? this.emplace(key, generator()).first.second
            : it.second;
    };
    /**
     * Set a value with key.
     *
     * @param key Key to be mapped or search for.
     * @param val Value to insert or assign.
     */
    UniqueMap.prototype.set = function (key, val) {
        this.insert_or_assign(key, val);
    };
    UniqueMap.prototype.insert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.prototype.insert.apply(this, __spreadArray([], __read(args), false));
    };
    UniqueMap.prototype._Insert_by_range = function (first, last) {
        for (var it = first; !it.equals(last); it = it.next())
            this.emplace(it.value.first, it.value.second);
    };
    UniqueMap.prototype.insert_or_assign = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (args.length === 2) {
            return this._Insert_or_assign_with_key_value(args[0], args[1]);
        }
        else if (args.length === 3) {
            // INSERT OR ASSIGN AN ELEMENT
            return this._Insert_or_assign_with_hint(args[0], args[1], args[2]);
        }
    };
    UniqueMap.prototype._Insert_or_assign_with_key_value = function (key, value) {
        var ret = this.emplace(key, value);
        if (ret.second === false)
            ret.first.second = value;
        return ret;
    };
    UniqueMap.prototype._Insert_or_assign_with_hint = function (hint, key, value) {
        var ret = this.emplace_hint(hint, key, value);
        if (ret.second !== value)
            ret.second = value;
        return ret;
    };
    UniqueMap.prototype.extract = function (param) {
        if (param instanceof this.end().constructor)
            return this._Extract_by_iterator(param);
        else
            return this._Extract_by_key(param);
    };
    UniqueMap.prototype._Extract_by_key = function (key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
            throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "extract", key);
        var ret = it.value;
        this._Erase_by_range(it);
        return ret;
    };
    UniqueMap.prototype._Extract_by_iterator = function (it) {
        if (it.equals(this.end()) === true)
            return this.end();
        this._Erase_by_range(it);
        return it;
    };
    UniqueMap.prototype._Erase_by_key = function (key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
            return 0;
        this._Erase_by_range(it);
        return 1;
    };
    /* ---------------------------------------------------------
        UTILITY
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    UniqueMap.prototype.merge = function (source) {
        for (var it = source.begin(); !it.equals(source.end());)
            if (this.has(it.first) === false) {
                this.insert(it.value);
                it = source.erase(it);
            }
            else
                it = it.next();
    };
    return UniqueMap;
}(MapContainer_1.MapContainer));
exports.UniqueMap = UniqueMap;
//# sourceMappingURL=UniqueMap.js.map

/***/ }),

/***/ 4974:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.UniqueSet = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.base
 */
//================================================================
var SetContainer_1 = __nccwpck_require__(1505);
var ErrorGenerator_1 = __nccwpck_require__(424);
/**
 * Basic set container blocking duplicated key.
 *
 * @template Key Key type
 * @template Source Derived type extending this {@link UniqueSet}
 * @template IteratorT Iterator type
 * @template ReverseT Reverse iterator type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var UniqueSet = /** @class */ (function (_super) {
    __extends(UniqueSet, _super);
    function UniqueSet() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    /* ---------------------------------------------------------
        ACCESSOR
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    UniqueSet.prototype.count = function (key) {
        return this.find(key).equals(this.end()) ? 0 : 1;
    };
    UniqueSet.prototype.insert = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return _super.prototype.insert.apply(this, __spreadArray([], __read(args), false));
    };
    UniqueSet.prototype._Insert_by_range = function (first, last) {
        for (; !first.equals(last); first = first.next())
            this._Insert_by_key(first.value);
    };
    UniqueSet.prototype.extract = function (param) {
        if (param instanceof this.end().constructor)
            return this._Extract_by_iterator(param);
        else
            return this._Extract_by_val(param);
    };
    UniqueSet.prototype._Extract_by_val = function (key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
            throw ErrorGenerator_1.ErrorGenerator.key_nout_found(this, "extract", key);
        this._Erase_by_range(it);
        return key;
    };
    UniqueSet.prototype._Extract_by_iterator = function (it) {
        if (it.equals(this.end()) === true || this.has(it.value) === false)
            return this.end();
        this._Erase_by_range(it);
        return it;
    };
    UniqueSet.prototype._Erase_by_val = function (key) {
        var it = this.find(key);
        if (it.equals(this.end()) === true)
            return 0;
        this._Erase_by_range(it);
        return 1;
    };
    /* ---------------------------------------------------------
        UTILITY
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    UniqueSet.prototype.merge = function (source) {
        for (var it = source.begin(); !it.equals(source.end());) {
            if (this.has(it.value) === false) {
                this.insert(it.value);
                it = source.erase(it);
            }
            else
                it = it.next();
        }
    };
    return UniqueSet;
}(SetContainer_1.SetContainer));
exports.UniqueSet = UniqueSet;
//# sourceMappingURL=UniqueSet.js.map

/***/ }),

/***/ 1693:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashMap = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var UniqueMap_1 = __nccwpck_require__(3077);
var IHashContainer_1 = __nccwpck_require__(9597);
var MapElementList_1 = __nccwpck_require__(6210);
var MapHashBuckets_1 = __nccwpck_require__(4874);
var Entry_1 = __nccwpck_require__(6776);
var Pair_1 = __nccwpck_require__(4752);
/**
 * Unique-key Map based on Hash buckets.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var HashMap = /** @class */ (function (_super) {
    __extends(HashMap, _super);
    function HashMap() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this, function (thisArg) { return new MapElementList_1.MapElementList(thisArg); }) || this;
        IHashContainer_1.IHashContainer.construct.apply(IHashContainer_1.IHashContainer, __spreadArray([_this,
            HashMap,
            function (hash, pred) {
                _this.buckets_ = new MapHashBuckets_1.MapHashBuckets(_this, hash, pred);
            }], __read(args), false));
        return _this;
    }
    /* ---------------------------------------------------------
        ASSIGN & CLEAR
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashMap.prototype.clear = function () {
        this.buckets_.clear();
        _super.prototype.clear.call(this);
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.swap = function (obj) {
        var _a, _b;
        // SWAP CONTENTS
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        MapElementList_1.MapElementList._Swap_associative(this.data_, obj.data_);
        // SWAP BUCKETS
        MapHashBuckets_1.MapHashBuckets._Swap_source(this.buckets_, obj.buckets_);
        _b = __read([obj.buckets_, this.buckets_], 2), this.buckets_ = _b[0], obj.buckets_ = _b[1];
    };
    /* =========================================================
        ACCESSORS
            - MEMBER
            - HASH
    ============================================================
        MEMBER
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashMap.prototype.find = function (key) {
        return this.buckets_.find(key);
    };
    HashMap.prototype.begin = function (index) {
        if (index === void 0) { index = null; }
        if (index === null)
            return _super.prototype.begin.call(this);
        else
            return this.buckets_.at(index)[0];
    };
    HashMap.prototype.end = function (index) {
        if (index === void 0) { index = null; }
        if (index === null)
            return _super.prototype.end.call(this);
        else {
            var bucket = this.buckets_.at(index);
            return bucket[bucket.length - 1].next();
        }
    };
    HashMap.prototype.rbegin = function (index) {
        if (index === void 0) { index = null; }
        return this.end(index).reverse();
    };
    HashMap.prototype.rend = function (index) {
        if (index === void 0) { index = null; }
        return this.begin(index).reverse();
    };
    /* ---------------------------------------------------------
        HASH
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashMap.prototype.bucket_count = function () {
        return this.buckets_.length();
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.bucket_size = function (index) {
        return this.buckets_.at(index).length;
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.load_factor = function () {
        return this.buckets_.load_factor();
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.hash_function = function () {
        return this.buckets_.hash_function();
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.key_eq = function () {
        return this.buckets_.key_eq();
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.bucket = function (key) {
        return this.hash_function()(key) % this.buckets_.length();
    };
    HashMap.prototype.max_load_factor = function (z) {
        if (z === void 0) { z = null; }
        return this.buckets_.max_load_factor(z);
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.reserve = function (n) {
        this.buckets_.reserve(n);
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.rehash = function (n) {
        this.buckets_.rehash(n);
    };
    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - POST-PROCESS
    ============================================================
        INSERT
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashMap.prototype.emplace = function (key, val) {
        // TEST WHETHER EXIST
        var it = this.find(key);
        if (it.equals(this.end()) === false)
            return new Pair_1.Pair(it, false);
        // INSERT
        this.data_.push(new Entry_1.Entry(key, val));
        it = it.prev();
        // POST-PROCESS
        this._Handle_insert(it, it.next());
        return new Pair_1.Pair(it, true);
    };
    /**
     * @inheritDoc
     */
    HashMap.prototype.emplace_hint = function (hint, key, val) {
        // FIND DUPLICATED KEY
        var it = this.find(key);
        if (it.equals(this.end()) === true) {
            // INSERT
            it = this.data_.insert(hint, new Entry_1.Entry(key, val));
            // POST-PROCESS
            this._Handle_insert(it, it.next());
        }
        return it;
    };
    /* ---------------------------------------------------------
        POST-PROCESS
    --------------------------------------------------------- */
    HashMap.prototype._Handle_insert = function (first, last) {
        for (; !first.equals(last); first = first.next())
            this.buckets_.insert(first);
    };
    HashMap.prototype._Handle_erase = function (first, last) {
        for (; !first.equals(last); first = first.next())
            this.buckets_.erase(first);
    };
    return HashMap;
}(UniqueMap_1.UniqueMap));
exports.HashMap = HashMap;
/**
 *
 */
(function (HashMap) {
    // BODY
    HashMap.Iterator = MapElementList_1.MapElementList.Iterator;
    HashMap.ReverseIterator = MapElementList_1.MapElementList.ReverseIterator;
})(HashMap = exports.HashMap || (exports.HashMap = {}));
exports.HashMap = HashMap;
//# sourceMappingURL=HashMap.js.map

/***/ }),

/***/ 6285:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashSet = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var UniqueSet_1 = __nccwpck_require__(4974);
var IHashContainer_1 = __nccwpck_require__(9597);
var SetElementList_1 = __nccwpck_require__(2356);
var SetHashBuckets_1 = __nccwpck_require__(5635);
var Pair_1 = __nccwpck_require__(4752);
/**
 * Unique-key Set based on Hash buckets.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var HashSet = /** @class */ (function (_super) {
    __extends(HashSet, _super);
    function HashSet() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var _this = _super.call(this, function (thisArg) { return new SetElementList_1.SetElementList(thisArg); }) || this;
        IHashContainer_1.IHashContainer.construct.apply(IHashContainer_1.IHashContainer, __spreadArray([_this,
            HashSet,
            function (hash, pred) {
                _this.buckets_ = new SetHashBuckets_1.SetHashBuckets(_this, hash, pred);
            }], __read(args), false));
        return _this;
    }
    /* ---------------------------------------------------------
        ASSIGN & CLEAR
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashSet.prototype.clear = function () {
        this.buckets_.clear();
        _super.prototype.clear.call(this);
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.swap = function (obj) {
        var _a, _b;
        // SWAP CONTENTS
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        SetElementList_1.SetElementList._Swap_associative(this.data_, obj.data_);
        // SWAP BUCKETS
        SetHashBuckets_1.SetHashBuckets._Swap_source(this.buckets_, obj.buckets_);
        _b = __read([obj.buckets_, this.buckets_], 2), this.buckets_ = _b[0], obj.buckets_ = _b[1];
    };
    /* =========================================================
        ACCESSORS
            - MEMBER
            - HASH
    ============================================================
        MEMBER
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashSet.prototype.find = function (key) {
        return this.buckets_.find(key);
    };
    HashSet.prototype.begin = function (index) {
        if (index === void 0) { index = null; }
        if (index === null)
            return _super.prototype.begin.call(this);
        else
            return this.buckets_.at(index)[0];
    };
    HashSet.prototype.end = function (index) {
        if (index === void 0) { index = null; }
        if (index === null)
            return _super.prototype.end.call(this);
        else {
            var bucket = this.buckets_.at(index);
            return bucket[bucket.length - 1].next();
        }
    };
    HashSet.prototype.rbegin = function (index) {
        if (index === void 0) { index = null; }
        return this.end(index).reverse();
    };
    HashSet.prototype.rend = function (index) {
        if (index === void 0) { index = null; }
        return this.begin(index).reverse();
    };
    /* ---------------------------------------------------------
        HASH
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    HashSet.prototype.bucket_count = function () {
        return this.buckets_.length();
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.bucket_size = function (n) {
        return this.buckets_.at(n).length;
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.load_factor = function () {
        return this.buckets_.load_factor();
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.hash_function = function () {
        return this.buckets_.hash_function();
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.key_eq = function () {
        return this.buckets_.key_eq();
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.bucket = function (key) {
        return this.hash_function()(key) % this.buckets_.length();
    };
    HashSet.prototype.max_load_factor = function (z) {
        if (z === void 0) { z = null; }
        return this.buckets_.max_load_factor(z);
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.reserve = function (n) {
        this.buckets_.reserve(n);
    };
    /**
     * @inheritDoc
     */
    HashSet.prototype.rehash = function (n) {
        this.buckets_.rehash(n);
    };
    /* =========================================================
        ELEMENTS I/O
            - INSERT
            - POST-PROCESS
            - SWAP
    ============================================================
        INSERT
    --------------------------------------------------------- */
    HashSet.prototype._Insert_by_key = function (key) {
        // TEST WHETHER EXIST
        var it = this.find(key);
        if (it.equals(this.end()) === false)
            return new Pair_1.Pair(it, false);
        // INSERT
        this.data_.push(key);
        it = it.prev();
        // POST-PROCESS
        this._Handle_insert(it, it.next());
        return new Pair_1.Pair(it, true);
    };
    HashSet.prototype._Insert_by_hint = function (hint, key) {
        // FIND DUPLICATED KEY
        var it = this.find(key);
        if (it.equals(this.end()) === true) {
            // INSERT
            it = this.data_.insert(hint, key);
            // POST-PROCESS
            this._Handle_insert(it, it.next());
        }
        return it;
    };
    /* ---------------------------------------------------------
        POST-PROCESS
    --------------------------------------------------------- */
    HashSet.prototype._Handle_insert = function (first, last) {
        for (; !first.equals(last); first = first.next())
            this.buckets_.insert(first);
    };
    HashSet.prototype._Handle_erase = function (first, last) {
        for (; !first.equals(last); first = first.next())
            this.buckets_.erase(first);
    };
    return HashSet;
}(UniqueSet_1.UniqueSet));
exports.HashSet = HashSet;
/**
 *
 */
(function (HashSet) {
    // BODY
    HashSet.Iterator = SetElementList_1.SetElementList.Iterator;
    HashSet.ReverseIterator = SetElementList_1.SetElementList.ReverseIterator;
})(HashSet = exports.HashSet || (exports.HashSet = {}));
exports.HashSet = HashSet;
//# sourceMappingURL=HashSet.js.map

/***/ }),

/***/ 6876:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Exception = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
/**
 * Base Exception.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var Exception = /** @class */ (function (_super) {
    __extends(Exception, _super);
    /* ---------------------------------------------------------
        CONSTRUCTOR
    --------------------------------------------------------- */
    /**
     * Initializer Constructor.
     *
     * @param message The error messgae.
     */
    function Exception(message) {
        var _newTarget = this.constructor;
        var _this = _super.call(this, message) || this;
        // INHERITANCE POLYFILL
        var proto = _newTarget.prototype;
        if (Object.setPrototypeOf)
            Object.setPrototypeOf(_this, proto);
        else
            _this.__proto__ = proto;
        return _this;
    }
    Object.defineProperty(Exception.prototype, "name", {
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * The error name.
         */
        get: function () {
            return this.constructor.name;
        },
        enumerable: false,
        configurable: true
    });
    /**
     * Get error message.
     *
     * @return The error message.
     */
    Exception.prototype.what = function () {
        return this.message;
    };
    /**
     * Native function for `JSON.stringify()`.
     *
     * The {@link Exception.toJSON} function returns only three properties; ({@link name}, {@link message} and {@link stack}). If you want to define a new sub-class extending the {@link Exception} and const the class to export additional props (or remove some props), override this {@link Exception.toJSON} method.
     *
     * @return An object for `JSON.stringify()`.
     */
    Exception.prototype.toJSON = function () {
        return {
            name: this.name,
            message: this.message,
            stack: this.stack,
        };
    };
    return Exception;
}(Error));
exports.Exception = Exception;
//# sourceMappingURL=Exception.js.map

/***/ }),

/***/ 9274:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.InvalidArgument = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var LogicError_1 = __nccwpck_require__(417);
/**
 * Invalid Argument Exception.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var InvalidArgument = /** @class */ (function (_super) {
    __extends(InvalidArgument, _super);
    /**
     * Initializer Constructor.
     *
     * @param message The error messgae.
     */
    function InvalidArgument(message) {
        return _super.call(this, message) || this;
    }
    return InvalidArgument;
}(LogicError_1.LogicError));
exports.InvalidArgument = InvalidArgument;
//# sourceMappingURL=InvalidArgument.js.map

/***/ }),

/***/ 417:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.LogicError = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var Exception_1 = __nccwpck_require__(6876);
/**
 * Logic Error.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var LogicError = /** @class */ (function (_super) {
    __extends(LogicError, _super);
    /**
     * Initializer Constructor.
     *
     * @param message The error messgae.
     */
    function LogicError(message) {
        return _super.call(this, message) || this;
    }
    return LogicError;
}(Exception_1.Exception));
exports.LogicError = LogicError;
//# sourceMappingURL=LogicError.js.map

/***/ }),

/***/ 6344:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.OutOfRange = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var LogicError_1 = __nccwpck_require__(417);
/**
 * Out-of-range Exception.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var OutOfRange = /** @class */ (function (_super) {
    __extends(OutOfRange, _super);
    /**
     * Initializer Constructor.
     *
     * @param message The error messgae.
     */
    function OutOfRange(message) {
        return _super.call(this, message) || this;
    }
    return OutOfRange;
}(LogicError_1.LogicError));
exports.OutOfRange = OutOfRange;
//# sourceMappingURL=OutOfRange.js.map

/***/ }),

/***/ 5401:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.greater_equal = exports.greater = exports.less_equal = exports.less = exports.not_equal_to = exports.equal_to = void 0;
var uid_1 = __nccwpck_require__(4674);
/**
 * Test whether two arguments are equal.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Whether two arguments are equal or not.
 */
function equal_to(x, y) {
    // CONVERT TO PRIMITIVE TYPE
    x = x ? x.valueOf() : x;
    y = y ? y.valueOf() : y;
    // DO COMPARE
    if (x instanceof Object &&
        x.equals instanceof Function)
        return x.equals(y);
    else
        return x === y;
}
exports.equal_to = equal_to;
/**
 * Test whether two arguments are not equal.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Returns `true`, if two arguments are not equal, otherwise `false`.
 */
function not_equal_to(x, y) {
    return !equal_to(x, y);
}
exports.not_equal_to = not_equal_to;
/**
 * Test whether *x* is less than *y*.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Whether *x* is less than *y*.
 */
function less(x, y) {
    // CONVERT TO PRIMITIVE TYPE
    x = x.valueOf();
    y = y.valueOf();
    // DO COMPARE
    if (x instanceof Object)
        if (x.less instanceof Function)
            // has less()
            return x.less(y);
        else
            return (0, uid_1.get_uid)(x) < (0, uid_1.get_uid)(y);
    else
        return x < y;
}
exports.less = less;
/**
 * Test whether *x* is less than or equal to *y*.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Whether *x* is less than or equal to *y*.
 */
function less_equal(x, y) {
    return less(x, y) || equal_to(x, y);
}
exports.less_equal = less_equal;
/**
 * Test whether *x* is greater than *y*.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Whether *x* is greater than *y*.
 */
function greater(x, y) {
    return !less_equal(x, y);
}
exports.greater = greater;
/**
 * Test whether *x* is greater than or equal to *y*.
 *
 * @param x The first argument to compare.
 * @param y The second argument to compare.
 * @return Whether *x* is greater than or equal to *y*.
 */
function greater_equal(x, y) {
    return !less(x, y);
}
exports.greater_equal = greater_equal;
//# sourceMappingURL=comparators.js.map

/***/ }),

/***/ 882:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.hash = void 0;
var uid_1 = __nccwpck_require__(4674);
/**
 * Hash function.
 *
 * @param itemList The items to be hashed.
 * @return The hash code.
 */
function hash() {
    var e_1, _a;
    var itemList = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        itemList[_i] = arguments[_i];
    }
    var ret = INIT_VALUE;
    try {
        for (var itemList_1 = __values(itemList), itemList_1_1 = itemList_1.next(); !itemList_1_1.done; itemList_1_1 = itemList_1.next()) {
            var item = itemList_1_1.value;
            item = item ? item.valueOf() : item;
            var type = typeof item;
            if (type === "boolean")
                // BOOLEAN -> 1 BYTE
                ret = _Hash_boolean(item, ret);
            else if (type === "number" || type === "bigint")
                // NUMBER -> 8 BYTES
                ret = _Hash_number(item, ret);
            else if (type === "string")
                // STRING -> {LENGTH} BYTES
                ret = _Hash_string(item, ret);
            else if (item instanceof Object &&
                item.hashCode instanceof Function) {
                var hashed = item.hashCode();
                if (itemList.length === 1)
                    return hashed;
                else {
                    ret = ret ^ hashed;
                    ret *= MULTIPLIER;
                }
            } // object | null | undefined
            else
                ret = _Hash_number((0, uid_1.get_uid)(item), ret);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (itemList_1_1 && !itemList_1_1.done && (_a = itemList_1.return)) _a.call(itemList_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return Math.abs(ret);
}
exports.hash = hash;
function _Hash_boolean(val, ret) {
    ret ^= val ? 1 : 0;
    ret *= MULTIPLIER;
    return ret;
}
function _Hash_number(val, ret) {
    return _Hash_string(val.toString(), ret);
    // // ------------------------------------------
    // //    IN C++
    // //        CONSIDER A NUMBER AS A STRING
    // //        HASH<STRING>((CHAR*)&VAL, 8)
    // // ------------------------------------------
    // // CONSTRUCT BUFFER AND BYTE_ARRAY
    // const buffer: ArrayBuffer = new ArrayBuffer(8);
    // const byteArray: Int8Array = new Int8Array(buffer);
    // const valueArray: Float64Array = new Float64Array(buffer);
    // valueArray[0] = val;
    // for (let i: number = 0; i < byteArray.length; ++i)
    // {
    //     const byte = (byteArray[i] < 0) ? byteArray[i] + 256 : byteArray[i];
    //     ret ^= byte;
    //     ret *= _HASH_MULTIPLIER;
    // }
    // return Math.abs(ret);
}
function _Hash_string(str, ret) {
    for (var i = 0; i < str.length; ++i) {
        ret ^= str.charCodeAt(i);
        ret *= MULTIPLIER;
    }
    return Math.abs(ret);
}
/* ---------------------------------------------------------
    RESERVED ITEMS
--------------------------------------------------------- */
var INIT_VALUE = 2166136261;
var MULTIPLIER = 16777619;
//# sourceMappingURL=hash.js.map

/***/ }),

/***/ 4674:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.get_uid = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var Global_1 = __nccwpck_require__(217);
/**
 * Get unique identifier.
 *
 * @param obj Target object.
 * @return The identifier number.
 */
function get_uid(obj) {
    // NO UID EXISTS, THEN ISSUE ONE.
    if (obj instanceof Object) {
        if (obj.hasOwnProperty("__get_m_iUID") === false) {
            var uid_1 = ++(0, Global_1._Get_root)().__s_iUID;
            Object.defineProperty(obj, "__get_m_iUID", {
                value: function () {
                    return uid_1;
                },
            });
        }
        // RETURNS
        return obj.__get_m_iUID();
    }
    else if (obj === undefined)
        return -1;
    // is null
    else
        return 0;
}
exports.get_uid = get_uid;
//# sourceMappingURL=uid.js.map

/***/ }),

/***/ 217:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports._Get_root = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var node_1 = __nccwpck_require__(4602);
/**
 * @internal
 */
function _Get_root() {
    if (__s_pRoot === null) {
        __s_pRoot = ((0, node_1.is_node)() ? global : self);
        if (__s_pRoot.__s_iUID === undefined)
            __s_pRoot.__s_iUID = 0;
    }
    return __s_pRoot;
}
exports._Get_root = _Get_root;
/**
 * @internal
 */
var __s_pRoot = null;
//# sourceMappingURL=Global.js.map

/***/ }),

/***/ 2030:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IAssociativeContainer = void 0;
var IAssociativeContainer;
(function (IAssociativeContainer) {
    /**
     * @internal
     */
    function construct(source) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var ramda;
        var tail;
        if (args.length >= 1 && args[0] instanceof Array) {
            // INITIALIZER LIST CONSTRUCTOR
            ramda = function () {
                var items = args[0];
                source.push.apply(source, __spreadArray([], __read(items), false));
            };
            tail = args.slice(1);
        }
        else if (args.length >= 2 &&
            args[0].next instanceof Function &&
            args[1].next instanceof Function) {
            // RANGE CONSTRUCTOR
            ramda = function () {
                var first = args[0];
                var last = args[1];
                source.assign(first, last);
            };
            tail = args.slice(2);
        }
        else {
            // DEFAULT CONSTRUCTOR
            ramda = null;
            tail = args;
        }
        return { ramda: ramda, tail: tail };
    }
    IAssociativeContainer.construct = construct;
})(IAssociativeContainer = exports.IAssociativeContainer || (exports.IAssociativeContainer = {}));
//# sourceMappingURL=IAssociativeContainer.js.map

/***/ }),

/***/ 9597:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.IHashContainer = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var IAssociativeContainer_1 = __nccwpck_require__(2030);
var hash_1 = __nccwpck_require__(882);
var comparators_1 = __nccwpck_require__(5401);
var IHashContainer;
(function (IHashContainer) {
    /**
     * @internal
     */
    function construct(source, Source, bucketFactory) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        // DECLARE MEMBERS
        var post_process = null;
        var hash_function = hash_1.hash;
        var key_eq = comparators_1.equal_to;
        //----
        // INITIALIZE MEMBERS AND POST-PROCESS
        //----
        // BRANCH - METHOD OVERLOADINGS
        if (args.length === 1 && args[0] instanceof Source) {
            // PARAMETERS
            var container_1 = args[0];
            hash_function = container_1.hash_function();
            key_eq = container_1.key_eq();
            // COPY CONSTRUCTOR
            post_process = function () {
                var first = container_1.begin();
                var last = container_1.end();
                source.assign(first, last);
            };
        }
        else {
            var tuple = IAssociativeContainer_1.IAssociativeContainer.construct.apply(IAssociativeContainer_1.IAssociativeContainer, __spreadArray([source], __read(args), false));
            post_process = tuple.ramda;
            if (tuple.tail.length >= 1)
                hash_function = tuple.tail[0];
            if (tuple.tail.length >= 2)
                key_eq = tuple.tail[1];
        }
        //----
        // DO PROCESS
        //----
        // CONSTRUCT BUCKET
        bucketFactory(hash_function, key_eq);
        // ACT POST-PROCESS
        if (post_process !== null)
            post_process();
    }
    IHashContainer.construct = construct;
})(IHashContainer = exports.IHashContainer || (exports.IHashContainer = {}));
//# sourceMappingURL=IHashContainer.js.map

/***/ }),

/***/ 6210:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapElementList = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var ListContainer_1 = __nccwpck_require__(6824);
var ListIterator_1 = __nccwpck_require__(9661);
var ReverseIterator_1 = __nccwpck_require__(5019);
/**
 * Doubly Linked List storing map elements.
 *
 * @template Key Key type
 * @template T Mapped type
 * @template Unique Whether duplicated key is blocked or not
 * @template Source Source type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var MapElementList = /** @class */ (function (_super) {
    __extends(MapElementList, _super);
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    function MapElementList(associative) {
        var _this = _super.call(this) || this;
        _this.associative_ = associative;
        return _this;
    }
    MapElementList.prototype._Create_iterator = function (prev, next, val) {
        return MapElementList.Iterator.create(this, prev, next, val);
    };
    /**
     * @internal
     */
    MapElementList._Swap_associative = function (x, y) {
        var _a;
        _a = __read([y.associative_, x.associative_], 2), x.associative_ = _a[0], y.associative_ = _a[1];
    };
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    MapElementList.prototype.associative = function () {
        return this.associative_;
    };
    return MapElementList;
}(ListContainer_1.ListContainer));
exports.MapElementList = MapElementList;
/**
 *
 */
(function (MapElementList) {
    /**
     * Iterator of map container storing elements in a list.
     *
     * @template Key Key type
     * @template T Mapped type
     * @template Unique Whether duplicated key is blocked or not
     * @template Source Source container type
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    var Iterator = /** @class */ (function (_super) {
        __extends(Iterator, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        function Iterator(list, prev, next, val) {
            var _this = _super.call(this, prev, next, val) || this;
            _this.list_ = list;
            return _this;
        }
        /**
         * @internal
         */
        Iterator.create = function (list, prev, next, val) {
            return new Iterator(list, prev, next, val);
        };
        /**
         * @inheritDoc
         */
        Iterator.prototype.reverse = function () {
            return new ReverseIterator(this);
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * @inheritDoc
         */
        Iterator.prototype.source = function () {
            return this.list_.associative();
        };
        Object.defineProperty(Iterator.prototype, "first", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this.value.first;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(Iterator.prototype, "second", {
            /**
             * @inheritDoc
             */
            get: function () {
                return this.value.second;
            },
            /**
             * @inheritDoc
             */
            set: function (val) {
                this.value.second = val;
            },
            enumerable: false,
            configurable: true
        });
        return Iterator;
    }(ListIterator_1.ListIterator));
    MapElementList.Iterator = Iterator;
    /**
     * Reverse iterator of map container storing elements a list.
     *
     * @template Key Key type
     * @template T Mapped type
     * @template Unique Whether duplicated key is blocked or not
     * @template Source Source container type
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    var ReverseIterator = /** @class */ (function (_super) {
        __extends(ReverseIterator, _super);
        function ReverseIterator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        ReverseIterator.prototype._Create_neighbor = function (base) {
            return new ReverseIterator(base);
        };
        Object.defineProperty(ReverseIterator.prototype, "first", {
            /* ---------------------------------------------------------
                ACCESSORS
            --------------------------------------------------------- */
            /**
             * Get the first, key element.
             *
             * @return The first element.
             */
            get: function () {
                return this.base_.first;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ReverseIterator.prototype, "second", {
            /**
             * Get the second, stored element.
             *
             * @return The second element.
             */
            get: function () {
                return this.base_.second;
            },
            /**
             * Set the second, stored element.
             *
             * @param val The value to set.
             */
            set: function (val) {
                this.base_.second = val;
            },
            enumerable: false,
            configurable: true
        });
        return ReverseIterator;
    }(ReverseIterator_1.ReverseIterator));
    MapElementList.ReverseIterator = ReverseIterator;
})(MapElementList = exports.MapElementList || (exports.MapElementList = {}));
exports.MapElementList = MapElementList;
//# sourceMappingURL=MapElementList.js.map

/***/ }),

/***/ 2356:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetElementList = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var ListContainer_1 = __nccwpck_require__(6824);
var ListIterator_1 = __nccwpck_require__(9661);
var ReverseIterator_1 = __nccwpck_require__(5019);
/**
 * Doubly Linked List storing set elements.
 *
 * @template Key Key type
 * @template Unique Whether duplicated key is blocked or not
 * @template Source Source container type
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var SetElementList = /** @class */ (function (_super) {
    __extends(SetElementList, _super);
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    function SetElementList(associative) {
        var _this = _super.call(this) || this;
        _this.associative_ = associative;
        return _this;
    }
    SetElementList.prototype._Create_iterator = function (prev, next, val) {
        return SetElementList.Iterator.create(this, prev, next, val);
    };
    /**
     * @internal
     */
    SetElementList._Swap_associative = function (x, y) {
        var _a;
        _a = __read([y.associative_, x.associative_], 2), x.associative_ = _a[0], y.associative_ = _a[1];
    };
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    SetElementList.prototype.associative = function () {
        return this.associative_;
    };
    return SetElementList;
}(ListContainer_1.ListContainer));
exports.SetElementList = SetElementList;
/**
 *
 */
(function (SetElementList) {
    /**
     * Iterator of set container storing elements in a list.
     *
     * @template Key Key type
     * @template Unique Whether duplicated key is blocked or not
     * @template Source Source container type
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    var Iterator = /** @class */ (function (_super) {
        __extends(Iterator, _super);
        /* ---------------------------------------------------------
            CONSTRUCTORS
        --------------------------------------------------------- */
        function Iterator(list, prev, next, val) {
            var _this = _super.call(this, prev, next, val) || this;
            _this.source_ = list;
            return _this;
        }
        /**
         * @internal
         */
        Iterator.create = function (list, prev, next, val) {
            return new Iterator(list, prev, next, val);
        };
        /**
         * @inheritDoc
         */
        Iterator.prototype.reverse = function () {
            return new ReverseIterator(this);
        };
        /* ---------------------------------------------------------
            ACCESSORS
        --------------------------------------------------------- */
        /**
         * @inheritDoc
         */
        Iterator.prototype.source = function () {
            return this.source_.associative();
        };
        return Iterator;
    }(ListIterator_1.ListIterator));
    SetElementList.Iterator = Iterator;
    /**
     * Reverser iterator of set container storing elements in a list.
     *
     * @template Key Key type
     * @template Unique Whether duplicated key is blocked or not
     * @template Source Source container type
     *
     * @author Jeongho Nam - https://github.com/samchon
     */
    var ReverseIterator = /** @class */ (function (_super) {
        __extends(ReverseIterator, _super);
        function ReverseIterator() {
            return _super !== null && _super.apply(this, arguments) || this;
        }
        ReverseIterator.prototype._Create_neighbor = function (base) {
            return new ReverseIterator(base);
        };
        return ReverseIterator;
    }(ReverseIterator_1.ReverseIterator));
    SetElementList.ReverseIterator = ReverseIterator;
})(SetElementList = exports.SetElementList || (exports.SetElementList = {}));
exports.SetElementList = SetElementList;
//# sourceMappingURL=SetElementList.js.map

/***/ }),

/***/ 6824:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListContainer = void 0;
var Container_1 = __nccwpck_require__(9868);
var ListIterator_1 = __nccwpck_require__(9661);
var Repeater_1 = __nccwpck_require__(8125);
var NativeArrayIterator_1 = __nccwpck_require__(6445);
var global_1 = __nccwpck_require__(9739);
var ErrorGenerator_1 = __nccwpck_require__(424);
/**
 * Basic List Container.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var ListContainer = /** @class */ (function (_super) {
    __extends(ListContainer, _super);
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Default Constructor.
     */
    function ListContainer() {
        var _this = _super.call(this) || this;
        // INIT MEMBERS
        _this.end_ = _this._Create_iterator(null, null);
        _this.clear();
        return _this;
    }
    ListContainer.prototype.assign = function (par1, par2) {
        this.clear();
        this.insert(this.end(), par1, par2);
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.clear = function () {
        // DISCONNECT NODES
        ListIterator_1.ListIterator._Set_prev(this.end_, this.end_);
        ListIterator_1.ListIterator._Set_next(this.end_, this.end_);
        // RE-SIZE -> 0
        this.begin_ = this.end_;
        this.size_ = 0;
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.resize = function (n) {
        var expansion = n - this.size();
        if (expansion > 0)
            this.insert(this.end(), expansion, undefined);
        else if (expansion < 0)
            this.erase((0, global_1.advance)(this.end(), -expansion), this.end());
    };
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ListContainer.prototype.begin = function () {
        return this.begin_;
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.end = function () {
        return this.end_;
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.size = function () {
        return this.size_;
    };
    /* =========================================================
        ELEMENTS I/O
            - PUSH & POP
            - INSERT
            - ERASE
            - POST-PROCESS
    ============================================================
        PUSH & POP
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ListContainer.prototype.push_front = function (val) {
        this.insert(this.begin_, val);
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.push_back = function (val) {
        this.insert(this.end_, val);
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.pop_front = function () {
        if (this.empty() === true)
            throw ErrorGenerator_1.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_front");
        this.erase(this.begin_);
    };
    /**
     * @inheritDoc
     */
    ListContainer.prototype.pop_back = function () {
        if (this.empty() === true)
            throw ErrorGenerator_1.ErrorGenerator.empty(this.end_.source().constructor.name, "pop_back");
        this.erase(this.end_.prev());
    };
    /* ---------------------------------------------------------
        INSERT
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ListContainer.prototype.push = function () {
        var items = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            items[_i] = arguments[_i];
        }
        if (items.length === 0)
            return this.size();
        // INSERT BY RANGE
        var first = new NativeArrayIterator_1.NativeArrayIterator(items, 0);
        var last = new NativeArrayIterator_1.NativeArrayIterator(items, items.length);
        this._Insert_by_range(this.end(), first, last);
        // RETURN SIZE
        return this.size();
    };
    ListContainer.prototype.insert = function (pos) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // VALIDATION
        if (pos.source() !== this.end_.source())
            throw ErrorGenerator_1.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
        else if (pos.erased_ === true)
            throw ErrorGenerator_1.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
        // BRANCHES
        if (args.length === 1)
            return this._Insert_by_repeating_val(pos, 1, args[0]);
        else if (args.length === 2 && typeof args[0] === "number")
            return this._Insert_by_repeating_val(pos, args[0], args[1]);
        else
            return this._Insert_by_range(pos, args[0], args[1]);
    };
    ListContainer.prototype._Insert_by_repeating_val = function (position, n, val) {
        var first = new Repeater_1.Repeater(0, val);
        var last = new Repeater_1.Repeater(n);
        return this._Insert_by_range(position, first, last);
    };
    ListContainer.prototype._Insert_by_range = function (position, begin, end) {
        var prev = position.prev();
        var first = null;
        var size = 0;
        for (var it = begin; it.equals(end) === false; it = it.next()) {
            // CONSTRUCT ITEM, THE NEW ELEMENT
            var item = this._Create_iterator(prev, null, it.value);
            if (size === 0)
                first = item;
            // PLACE ITEM ON THE NEXT OF "PREV"
            ListIterator_1.ListIterator._Set_next(prev, item);
            // SHIFT CURRENT ITEM TO PREVIOUS
            prev = item;
            ++size;
        }
        // WILL FIRST BE THE BEGIN?
        if (position.equals(this.begin()) === true)
            this.begin_ = first;
        // CONNECT BETWEEN LAST AND POSITION
        ListIterator_1.ListIterator._Set_next(prev, position);
        ListIterator_1.ListIterator._Set_prev(position, prev);
        this.size_ += size;
        return first;
    };
    ListContainer.prototype.erase = function (first, last) {
        if (last === void 0) { last = first.next(); }
        return this._Erase_by_range(first, last);
    };
    ListContainer.prototype._Erase_by_range = function (first, last) {
        // VALIDATION
        if (first.source() !== this.end_.source())
            throw ErrorGenerator_1.ErrorGenerator.not_my_iterator(this.end_.source(), "insert");
        else if (first.erased_ === true)
            throw ErrorGenerator_1.ErrorGenerator.erased_iterator(this.end_.source(), "insert");
        else if (first.equals(this.end_))
            return this.end_;
        // FIND PREV AND NEXT
        var prev = first.prev();
        // SHRINK
        ListIterator_1.ListIterator._Set_next(prev, last);
        ListIterator_1.ListIterator._Set_prev(last, prev);
        for (var it = first; !it.equals(last); it = it.next()) {
            it.erased_ = true;
            --this.size_;
        }
        if (first.equals(this.begin_))
            this.begin_ = last;
        return last;
    };
    /* ---------------------------------------------------------
        SWAP
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ListContainer.prototype.swap = function (obj) {
        var _a, _b, _c;
        _a = __read([obj.begin_, this.begin_], 2), this.begin_ = _a[0], obj.begin_ = _a[1];
        _b = __read([obj.end_, this.end_], 2), this.end_ = _b[0], obj.end_ = _b[1];
        _c = __read([obj.size_, this.size_], 2), this.size_ = _c[0], obj.size_ = _c[1];
    };
    return ListContainer;
}(Container_1.Container));
exports.ListContainer = ListContainer;
//# sourceMappingURL=ListContainer.js.map

/***/ }),

/***/ 424:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ErrorGenerator = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var InvalidArgument_1 = __nccwpck_require__(9274);
var OutOfRange_1 = __nccwpck_require__(6344);
var ErrorGenerator;
(function (ErrorGenerator) {
    /* ---------------------------------------------------------
        COMMON
    --------------------------------------------------------- */
    function get_class_name(instance) {
        if (typeof instance === "string")
            return instance;
        var ret = instance.constructor.name;
        if (instance.constructor.__MODULE)
            ret = "".concat(instance.constructor.__MODULE, ".").concat(ret);
        return "std.".concat(ret);
    }
    ErrorGenerator.get_class_name = get_class_name;
    /* ---------------------------------------------------------
        CONTAINERS
    --------------------------------------------------------- */
    function empty(instance, method) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): it's empty container."));
    }
    ErrorGenerator.empty = empty;
    function negative_index(instance, method, index) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric index is negative -> (index = ").concat(index, ")."));
    }
    ErrorGenerator.negative_index = negative_index;
    function excessive_index(instance, method, index, size) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric index is equal or greater than size -> (index = ").concat(index, ", size: ").concat(size, ")."));
    }
    ErrorGenerator.excessive_index = excessive_index;
    function not_my_iterator(instance, method) {
        return new InvalidArgument_1.InvalidArgument("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator is not this container's own."));
    }
    ErrorGenerator.not_my_iterator = not_my_iterator;
    function erased_iterator(instance, method) {
        return new InvalidArgument_1.InvalidArgument("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator, it already has been erased."));
    }
    ErrorGenerator.erased_iterator = erased_iterator;
    function negative_iterator(instance, method, index) {
        return new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): parametric iterator is directing negative position -> (index = ").concat(index, ")."));
    }
    ErrorGenerator.negative_iterator = negative_iterator;
    function iterator_end_value(instance, method) {
        if (method === void 0) { method = "end"; }
        var className = get_class_name(instance);
        return new OutOfRange_1.OutOfRange("Error on ".concat(className, ".Iterator.value: cannot access to the ").concat(className, ".").concat(method, "().value."));
    }
    ErrorGenerator.iterator_end_value = iterator_end_value;
    function key_nout_found(instance, method, key) {
        throw new OutOfRange_1.OutOfRange("Error on ".concat(get_class_name(instance), ".").concat(method, "(): unable to find the matched key -> ").concat(key));
    }
    ErrorGenerator.key_nout_found = key_nout_found;
})(ErrorGenerator = exports.ErrorGenerator || (exports.ErrorGenerator = {}));
//# sourceMappingURL=ErrorGenerator.js.map

/***/ }),

/***/ 5107:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.HashBuckets = void 0;
/**
 * Hash buckets
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var HashBuckets = /** @class */ (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    function HashBuckets(fetcher, hasher) {
        this.fetcher_ = fetcher;
        this.hasher_ = hasher;
        this.max_load_factor_ = DEFAULT_MAX_FACTOR;
        this.data_ = [];
        this.size_ = 0;
        this.initialize();
    }
    HashBuckets.prototype.clear = function () {
        this.data_ = [];
        this.size_ = 0;
        this.initialize();
    };
    HashBuckets.prototype.rehash = function (length) {
        var e_1, _a, e_2, _b;
        length = Math.max(length, MIN_BUCKET_COUNT);
        var data = [];
        for (var i = 0; i < length; ++i)
            data.push([]);
        try {
            for (var _c = __values(this.data_), _d = _c.next(); !_d.done; _d = _c.next()) {
                var row = _d.value;
                try {
                    for (var row_1 = (e_2 = void 0, __values(row)), row_1_1 = row_1.next(); !row_1_1.done; row_1_1 = row_1.next()) {
                        var elem = row_1_1.value;
                        var index = this.hasher_(this.fetcher_(elem)) % data.length;
                        data[index].push(elem);
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (row_1_1 && !row_1_1.done && (_b = row_1.return)) _b.call(row_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
            }
            finally { if (e_1) throw e_1.error; }
        }
        this.data_ = data;
    };
    HashBuckets.prototype.reserve = function (length) {
        if (length > this.capacity()) {
            length = Math.floor(length / this.max_load_factor_);
            this.rehash(length);
        }
    };
    HashBuckets.prototype.initialize = function () {
        for (var i = 0; i < MIN_BUCKET_COUNT; ++i)
            this.data_.push([]);
    };
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    HashBuckets.prototype.length = function () {
        return this.data_.length;
    };
    HashBuckets.prototype.capacity = function () {
        return this.data_.length * this.max_load_factor_;
    };
    HashBuckets.prototype.at = function (index) {
        return this.data_[index];
    };
    HashBuckets.prototype.load_factor = function () {
        return this.size_ / this.length();
    };
    HashBuckets.prototype.max_load_factor = function (z) {
        if (z === void 0) { z = null; }
        if (z === null)
            return this.max_load_factor_;
        else
            this.max_load_factor_ = z;
    };
    HashBuckets.prototype.hash_function = function () {
        return this.hasher_;
    };
    /* ---------------------------------------------------------
        ELEMENTS I/O
    --------------------------------------------------------- */
    HashBuckets.prototype.index = function (elem) {
        return this.hasher_(this.fetcher_(elem)) % this.length();
    };
    HashBuckets.prototype.insert = function (val) {
        var capacity = this.capacity();
        if (++this.size_ > capacity)
            this.reserve(capacity * 2);
        var index = this.index(val);
        this.data_[index].push(val);
    };
    HashBuckets.prototype.erase = function (val) {
        var index = this.index(val);
        var bucket = this.data_[index];
        for (var i = 0; i < bucket.length; ++i)
            if (bucket[i] === val) {
                bucket.splice(i, 1);
                --this.size_;
                break;
            }
    };
    return HashBuckets;
}());
exports.HashBuckets = HashBuckets;
var MIN_BUCKET_COUNT = 10;
var DEFAULT_MAX_FACTOR = 1.0;
//# sourceMappingURL=HashBuckets.js.map

/***/ }),

/***/ 4874:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.MapHashBuckets = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var HashBuckets_1 = __nccwpck_require__(5107);
/**
 * Hash buckets for map containers.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var MapHashBuckets = /** @class */ (function (_super) {
    __extends(MapHashBuckets, _super);
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Initializer Constructor
     *
     * @param source Source map container
     * @param hasher Hash function
     * @param pred Equality function
     */
    function MapHashBuckets(source, hasher, pred) {
        var _this = _super.call(this, fetcher, hasher) || this;
        _this.source_ = source;
        _this.key_eq_ = pred;
        return _this;
    }
    /**
     * @internal
     */
    MapHashBuckets._Swap_source = function (x, y) {
        var _a;
        _a = __read([y.source_, x.source_], 2), x.source_ = _a[0], y.source_ = _a[1];
    };
    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    MapHashBuckets.prototype.key_eq = function () {
        return this.key_eq_;
    };
    MapHashBuckets.prototype.find = function (key) {
        var e_1, _a;
        var index = this.hash_function()(key) % this.length();
        var bucket = this.at(index);
        try {
            for (var bucket_1 = __values(bucket), bucket_1_1 = bucket_1.next(); !bucket_1_1.done; bucket_1_1 = bucket_1.next()) {
                var it = bucket_1_1.value;
                if (this.key_eq_(it.first, key))
                    return it;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (bucket_1_1 && !bucket_1_1.done && (_a = bucket_1.return)) _a.call(bucket_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this.source_.end();
    };
    return MapHashBuckets;
}(HashBuckets_1.HashBuckets));
exports.MapHashBuckets = MapHashBuckets;
function fetcher(elem) {
    return elem.first;
}
//# sourceMappingURL=MapHashBuckets.js.map

/***/ }),

/***/ 5635:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.SetHashBuckets = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std.internal
 */
//================================================================
var HashBuckets_1 = __nccwpck_require__(5107);
/**
 * Hash buckets for set containers
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var SetHashBuckets = /** @class */ (function (_super) {
    __extends(SetHashBuckets, _super);
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Initializer Constructor
     *
     * @param source Source set container
     * @param hasher Hash function
     * @param pred Equality function
     */
    function SetHashBuckets(source, hasher, pred) {
        var _this = _super.call(this, fetcher, hasher) || this;
        _this.source_ = source;
        _this.key_eq_ = pred;
        return _this;
    }
    /**
     * @internal
     */
    SetHashBuckets._Swap_source = function (x, y) {
        var _a;
        _a = __read([y.source_, x.source_], 2), x.source_ = _a[0], y.source_ = _a[1];
    };
    /* ---------------------------------------------------------
        FINDERS
    --------------------------------------------------------- */
    SetHashBuckets.prototype.key_eq = function () {
        return this.key_eq_;
    };
    SetHashBuckets.prototype.find = function (val) {
        var e_1, _a;
        var index = this.hash_function()(val) % this.length();
        var bucket = this.at(index);
        try {
            for (var bucket_1 = __values(bucket), bucket_1_1 = bucket_1.next(); !bucket_1_1.done; bucket_1_1 = bucket_1.next()) {
                var it = bucket_1_1.value;
                if (this.key_eq_(it.value, val))
                    return it;
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (bucket_1_1 && !bucket_1_1.done && (_a = bucket_1.return)) _a.call(bucket_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return this.source_.end();
    };
    return SetHashBuckets;
}(HashBuckets_1.HashBuckets));
exports.SetHashBuckets = SetHashBuckets;
function fetcher(elem) {
    return elem.value;
}
//# sourceMappingURL=SetHashBuckets.js.map

/***/ }),

/***/ 9661:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ListIterator = void 0;
var ErrorGenerator_1 = __nccwpck_require__(424);
/**
 * Basic List Iterator.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var ListIterator = /** @class */ (function () {
    /* ---------------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------------- */
    function ListIterator(prev, next, value) {
        this.prev_ = prev;
        this.next_ = next;
        this.value_ = value;
    }
    /**
     * @internal
     */
    ListIterator._Set_prev = function (it, prev) {
        it.prev_ = prev;
    };
    /**
     * @internal
     */
    ListIterator._Set_next = function (it, next) {
        it.next_ = next;
    };
    /**
     * @inheritDoc
     */
    ListIterator.prototype.prev = function () {
        return this.prev_;
    };
    /**
     * @inheritDoc
     */
    ListIterator.prototype.next = function () {
        return this.next_;
    };
    Object.defineProperty(ListIterator.prototype, "value", {
        /**
         * @inheritDoc
         */
        get: function () {
            this._Try_value();
            return this.value_;
        },
        enumerable: false,
        configurable: true
    });
    ListIterator.prototype._Try_value = function () {
        if (this.value_ === undefined &&
            this.equals(this.source().end()) === true)
            throw ErrorGenerator_1.ErrorGenerator.iterator_end_value(this.source());
    };
    /* ---------------------------------------------------------------
        COMPARISON
    --------------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ListIterator.prototype.equals = function (obj) {
        return this === obj;
    };
    return ListIterator;
}());
exports.ListIterator = ListIterator;
//# sourceMappingURL=ListIterator.js.map

/***/ }),

/***/ 5019:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ReverseIterator = void 0;
/**
 * Basic reverse iterator.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var ReverseIterator = /** @class */ (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Initializer Constructor.
     *
     * @param base The base iterator.
     */
    function ReverseIterator(base) {
        this.base_ = base.prev();
    }
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    /**
     * Get source container.
     *
     * @return The source container.
     */
    ReverseIterator.prototype.source = function () {
        return this.base_.source();
    };
    /**
     * @inheritDoc
     */
    ReverseIterator.prototype.base = function () {
        return this.base_.next();
    };
    Object.defineProperty(ReverseIterator.prototype, "value", {
        /**
         * @inheritDoc
         */
        get: function () {
            return this.base_.value;
        },
        enumerable: false,
        configurable: true
    });
    /* ---------------------------------------------------------
        MOVERS
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ReverseIterator.prototype.prev = function () {
        // this.base().next()
        return this._Create_neighbor(this.base().next());
    };
    /**
     * @inheritDoc
     */
    ReverseIterator.prototype.next = function () {
        // this.base().prev()
        return this._Create_neighbor(this.base_);
    };
    /* ---------------------------------------------------------
        COMPARES
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    ReverseIterator.prototype.equals = function (obj) {
        return this.base_.equals(obj.base_);
    };
    return ReverseIterator;
}());
exports.ReverseIterator = ReverseIterator;
//# sourceMappingURL=ReverseIterator.js.map

/***/ }),

/***/ 5767:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.ForOfAdaptor = void 0;
/**
 * Adaptor for `for ... of` iteration.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var ForOfAdaptor = /** @class */ (function () {
    /**
     * Initializer Constructor.
     *
     * @param first Input iteartor of the first position.
     * @param last Input iterator of the last position.
     */
    function ForOfAdaptor(first, last) {
        this.it_ = first;
        this.last_ = last;
    }
    /**
     * @inheritDoc
     */
    ForOfAdaptor.prototype.next = function () {
        if (this.it_.equals(this.last_))
            return {
                done: true,
                value: undefined,
            };
        else {
            var it = this.it_;
            this.it_ = this.it_.next();
            return {
                done: false,
                value: it.value,
            };
        }
    };
    /**
     * @inheritDoc
     */
    ForOfAdaptor.prototype[Symbol.iterator] = function () {
        return this;
    };
    return ForOfAdaptor;
}());
exports.ForOfAdaptor = ForOfAdaptor;
//# sourceMappingURL=ForOfAdaptor.js.map

/***/ }),

/***/ 6445:
/***/ (function(__unused_webpack_module, exports) {

"use strict";

var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.NativeArrayIterator = void 0;
var NativeArrayIterator = /** @class */ (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    function NativeArrayIterator(data, index) {
        this.data_ = data;
        this.index_ = index;
    }
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    NativeArrayIterator.prototype.index = function () {
        return this.index_;
    };
    Object.defineProperty(NativeArrayIterator.prototype, "value", {
        get: function () {
            return this.data_[this.index_];
        },
        enumerable: false,
        configurable: true
    });
    /* ---------------------------------------------------------
        MOVERS
    --------------------------------------------------------- */
    NativeArrayIterator.prototype.prev = function () {
        --this.index_;
        return this;
    };
    NativeArrayIterator.prototype.next = function () {
        ++this.index_;
        return this;
    };
    NativeArrayIterator.prototype.advance = function (n) {
        this.index_ += n;
        return this;
    };
    /* ---------------------------------------------------------
        COMPARES
    --------------------------------------------------------- */
    NativeArrayIterator.prototype.equals = function (obj) {
        return this.data_ === obj.data_ && this.index_ === obj.index_;
    };
    NativeArrayIterator.prototype.swap = function (obj) {
        var _a, _b;
        _a = __read([obj.data_, this.data_], 2), this.data_ = _a[0], obj.data_ = _a[1];
        _b = __read([obj.index_, this.index_], 2), this.index_ = _b[0], obj.index_ = _b[1];
    };
    return NativeArrayIterator;
}());
exports.NativeArrayIterator = NativeArrayIterator;
//# sourceMappingURL=NativeArrayIterator.js.map

/***/ }),

/***/ 8125:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Repeater = void 0;
var Repeater = /** @class */ (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    function Repeater(index, value) {
        this.index_ = index;
        this.value_ = value;
    }
    /* ---------------------------------------------------------
        ACCESSORS
    --------------------------------------------------------- */
    Repeater.prototype.index = function () {
        return this.index_;
    };
    Object.defineProperty(Repeater.prototype, "value", {
        get: function () {
            return this.value_;
        },
        enumerable: false,
        configurable: true
    });
    /* ---------------------------------------------------------
        MOVERS & COMPARE
    --------------------------------------------------------- */
    Repeater.prototype.next = function () {
        ++this.index_;
        return this;
    };
    Repeater.prototype.equals = function (obj) {
        return this.index_ === obj.index_;
    };
    return Repeater;
}());
exports.Repeater = Repeater;
//# sourceMappingURL=Repeater.js.map

/***/ }),

/***/ 9739:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.next = exports.prev = exports.advance = exports.distance = exports.size = exports.empty = void 0;
var InvalidArgument_1 = __nccwpck_require__(9274);
/* =========================================================
    GLOBAL FUNCTIONS
        - ACCESSORS
        - MOVERS
        - FACTORIES
============================================================
    ACCESSORS
--------------------------------------------------------- */
/**
 * Test whether a container is empty.
 *
 * @param source Target container.
 * @return Whether empty or not.
 */
function empty(source) {
    if (source instanceof Array)
        return source.length !== 0;
    else
        return source.empty();
}
exports.empty = empty;
/**
 * Get number of elements of a container.
 *
 * @param source Target container.
 * @return The number of elements in the container.
 */
function size(source) {
    if (source instanceof Array)
        return source.length;
    else
        return source.size();
}
exports.size = size;
function distance(first, last) {
    if (first.index instanceof Function)
        return _Distance_via_index(first, last);
    var ret = 0;
    for (; !first.equals(last); first = first.next())
        ++ret;
    return ret;
}
exports.distance = distance;
function _Distance_via_index(first, last) {
    var x = first.index();
    var y = last.index();
    if (first.base instanceof Function)
        return x - y;
    else
        return y - x;
}
function advance(it, n) {
    if (n === 0)
        return it;
    else if (it.advance instanceof Function)
        return it.advance(n);
    var stepper;
    if (n < 0) {
        if (!(it.prev instanceof Function))
            throw new InvalidArgument_1.InvalidArgument("Error on std.advance(): parametric iterator is not a bi-directional iterator, thus advancing to negative direction is not possible.");
        stepper = function (it) { return it.prev(); };
        n = -n;
    }
    else
        stepper = function (it) { return it.next(); };
    while (n-- > 0)
        it = stepper(it);
    return it;
}
exports.advance = advance;
/**
 * Get previous iterator.
 *
 * @param it Iterator to move.
 * @param n Step to move prev.
 * @return An iterator moved to prev *n* steps.
 */
function prev(it, n) {
    if (n === void 0) { n = 1; }
    if (n === 1)
        return it.prev();
    else
        return advance(it, -n);
}
exports.prev = prev;
/**
 * Get next iterator.
 *
 * @param it Iterator to move.
 * @param n Step to move next.
 * @return Iterator moved to next *n* steps.
 */
function next(it, n) {
    if (n === void 0) { n = 1; }
    if (n === 1)
        return it.next();
    else
        return advance(it, n);
}
exports.next = next;
//# sourceMappingURL=global.js.map

/***/ }),

/***/ 6776:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.Entry = void 0;
var hash_1 = __nccwpck_require__(882);
var comparators_1 = __nccwpck_require__(5401);
/**
 * Entry for mapping.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var Entry = /** @class */ (function () {
    /**
     * Intializer Constructor.
     *
     * @param first The first, key element.
     * @param second The second, mapped element.
     */
    function Entry(first, second) {
        this.first = first;
        this.second = second;
    }
    /**
     * @inheritDoc
     */
    Entry.prototype.equals = function (obj) {
        return (0, comparators_1.equal_to)(this.first, obj.first);
    };
    /**
     * @inheritDoc
     */
    Entry.prototype.less = function (obj) {
        return (0, comparators_1.less)(this.first, obj.first);
    };
    /**
     * @inheritDoc
     */
    Entry.prototype.hashCode = function () {
        return (0, hash_1.hash)(this.first);
    };
    return Entry;
}());
exports.Entry = Entry;
//# sourceMappingURL=Entry.js.map

/***/ }),

/***/ 4752:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.make_pair = exports.Pair = void 0;
var hash_1 = __nccwpck_require__(882);
var comparators_1 = __nccwpck_require__(5401);
/**
 * Pair of two elements.
 *
 * @author Jeongho Nam - https://github.com/samchon
 */
var Pair = /** @class */ (function () {
    /* ---------------------------------------------------------
        CONSTRUCTORS
    --------------------------------------------------------- */
    /**
     * Initializer Constructor.
     *
     * @param first The first element.
     * @param second The second element.
     */
    function Pair(first, second) {
        this.first = first;
        this.second = second;
    }
    /* ---------------------------------------------------------
        COMPARISON
    --------------------------------------------------------- */
    /**
     * @inheritDoc
     */
    Pair.prototype.equals = function (pair) {
        return ((0, comparators_1.equal_to)(this.first, pair.first) &&
            (0, comparators_1.equal_to)(this.second, pair.second));
    };
    /**
     * @inheritDoc
     */
    Pair.prototype.less = function (pair) {
        if ((0, comparators_1.equal_to)(this.first, pair.first) === false)
            return (0, comparators_1.less)(this.first, pair.first);
        else
            return (0, comparators_1.less)(this.second, pair.second);
    };
    /**
     * @inheritDoc
     */
    Pair.prototype.hashCode = function () {
        return (0, hash_1.hash)(this.first, this.second);
    };
    return Pair;
}());
exports.Pair = Pair;
/**
 * Create a {@link Pair}.
 *
 * @param first The 1st element.
 * @param second The 2nd element.
 *
 * @return A {@link Pair} object.
 */
function make_pair(first, second) {
    return new Pair(first, second);
}
exports.make_pair = make_pair;
//# sourceMappingURL=Pair.js.map

/***/ }),

/***/ 4602:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.is_node = void 0;
//================================================================
/**
 * @packageDocumentation
 * @module std
 */
//================================================================
var is_node_ = null;
/**
 * Test whether the code is running on NodeJS.
 *
 * @return Whether NodeJS or not.
 */
function is_node() {
    if (is_node_ === null)
        is_node_ =
            typeof global === "object" &&
                typeof global.process === "object" &&
                typeof global.process.versions === "object" &&
                typeof global.process.versions.node !== "undefined";
    return is_node_;
}
exports.is_node = is_node;
//# sourceMappingURL=node.js.map

/***/ }),

/***/ 4294:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(4219);


/***/ }),

/***/ 4219:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


var net = __nccwpck_require__(1808);
var tls = __nccwpck_require__(4404);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var events = __nccwpck_require__(2361);
var assert = __nccwpck_require__(9491);
var util = __nccwpck_require__(3837);


exports.httpOverHttp = httpOverHttp;
exports.httpsOverHttp = httpsOverHttp;
exports.httpOverHttps = httpOverHttps;
exports.httpsOverHttps = httpsOverHttps;


function httpOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  return agent;
}

function httpsOverHttp(options) {
  var agent = new TunnelingAgent(options);
  agent.request = http.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}

function httpOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  return agent;
}

function httpsOverHttps(options) {
  var agent = new TunnelingAgent(options);
  agent.request = https.request;
  agent.createSocket = createSecureSocket;
  agent.defaultPort = 443;
  return agent;
}


function TunnelingAgent(options) {
  var self = this;
  self.options = options || {};
  self.proxyOptions = self.options.proxy || {};
  self.maxSockets = self.options.maxSockets || http.Agent.defaultMaxSockets;
  self.requests = [];
  self.sockets = [];

  self.on('free', function onFree(socket, host, port, localAddress) {
    var options = toOptions(host, port, localAddress);
    for (var i = 0, len = self.requests.length; i < len; ++i) {
      var pending = self.requests[i];
      if (pending.host === options.host && pending.port === options.port) {
        // Detect the request to connect same origin server,
        // reuse the connection.
        self.requests.splice(i, 1);
        pending.request.onSocket(socket);
        return;
      }
    }
    socket.destroy();
    self.removeSocket(socket);
  });
}
util.inherits(TunnelingAgent, events.EventEmitter);

TunnelingAgent.prototype.addRequest = function addRequest(req, host, port, localAddress) {
  var self = this;
  var options = mergeOptions({request: req}, self.options, toOptions(host, port, localAddress));

  if (self.sockets.length >= this.maxSockets) {
    // We are over limit so we'll add it to the queue.
    self.requests.push(options);
    return;
  }

  // If we are under maxSockets create a new one.
  self.createSocket(options, function(socket) {
    socket.on('free', onFree);
    socket.on('close', onCloseOrRemove);
    socket.on('agentRemove', onCloseOrRemove);
    req.onSocket(socket);

    function onFree() {
      self.emit('free', socket, options);
    }

    function onCloseOrRemove(err) {
      self.removeSocket(socket);
      socket.removeListener('free', onFree);
      socket.removeListener('close', onCloseOrRemove);
      socket.removeListener('agentRemove', onCloseOrRemove);
    }
  });
};

TunnelingAgent.prototype.createSocket = function createSocket(options, cb) {
  var self = this;
  var placeholder = {};
  self.sockets.push(placeholder);

  var connectOptions = mergeOptions({}, self.proxyOptions, {
    method: 'CONNECT',
    path: options.host + ':' + options.port,
    agent: false,
    headers: {
      host: options.host + ':' + options.port
    }
  });
  if (options.localAddress) {
    connectOptions.localAddress = options.localAddress;
  }
  if (connectOptions.proxyAuth) {
    connectOptions.headers = connectOptions.headers || {};
    connectOptions.headers['Proxy-Authorization'] = 'Basic ' +
        new Buffer(connectOptions.proxyAuth).toString('base64');
  }

  debug('making CONNECT request');
  var connectReq = self.request(connectOptions);
  connectReq.useChunkedEncodingByDefault = false; // for v0.6
  connectReq.once('response', onResponse); // for v0.6
  connectReq.once('upgrade', onUpgrade);   // for v0.6
  connectReq.once('connect', onConnect);   // for v0.7 or later
  connectReq.once('error', onError);
  connectReq.end();

  function onResponse(res) {
    // Very hacky. This is necessary to avoid http-parser leaks.
    res.upgrade = true;
  }

  function onUpgrade(res, socket, head) {
    // Hacky.
    process.nextTick(function() {
      onConnect(res, socket, head);
    });
  }

  function onConnect(res, socket, head) {
    connectReq.removeAllListeners();
    socket.removeAllListeners();

    if (res.statusCode !== 200) {
      debug('tunneling socket could not be established, statusCode=%d',
        res.statusCode);
      socket.destroy();
      var error = new Error('tunneling socket could not be established, ' +
        'statusCode=' + res.statusCode);
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    if (head.length > 0) {
      debug('got illegal response body from proxy');
      socket.destroy();
      var error = new Error('got illegal response body from proxy');
      error.code = 'ECONNRESET';
      options.request.emit('error', error);
      self.removeSocket(placeholder);
      return;
    }
    debug('tunneling connection has established');
    self.sockets[self.sockets.indexOf(placeholder)] = socket;
    return cb(socket);
  }

  function onError(cause) {
    connectReq.removeAllListeners();

    debug('tunneling socket could not be established, cause=%s\n',
          cause.message, cause.stack);
    var error = new Error('tunneling socket could not be established, ' +
                          'cause=' + cause.message);
    error.code = 'ECONNRESET';
    options.request.emit('error', error);
    self.removeSocket(placeholder);
  }
};

TunnelingAgent.prototype.removeSocket = function removeSocket(socket) {
  var pos = this.sockets.indexOf(socket)
  if (pos === -1) {
    return;
  }
  this.sockets.splice(pos, 1);

  var pending = this.requests.shift();
  if (pending) {
    // If we have pending requests and a socket gets closed a new one
    // needs to be created to take over in the pool for the one that closed.
    this.createSocket(pending, function(socket) {
      pending.request.onSocket(socket);
    });
  }
};

function createSecureSocket(options, cb) {
  var self = this;
  TunnelingAgent.prototype.createSocket.call(self, options, function(socket) {
    var hostHeader = options.request.getHeader('host');
    var tlsOptions = mergeOptions({}, self.options, {
      socket: socket,
      servername: hostHeader ? hostHeader.replace(/:.*$/, '') : options.host
    });

    // 0 is dummy port for v0.6
    var secureSocket = tls.connect(0, tlsOptions);
    self.sockets[self.sockets.indexOf(socket)] = secureSocket;
    cb(secureSocket);
  });
}


function toOptions(host, port, localAddress) {
  if (typeof host === 'string') { // since v0.10
    return {
      host: host,
      port: port,
      localAddress: localAddress
    };
  }
  return host; // for v0.11 or later
}

function mergeOptions(target) {
  for (var i = 1, len = arguments.length; i < len; ++i) {
    var overrides = arguments[i];
    if (typeof overrides === 'object') {
      var keys = Object.keys(overrides);
      for (var j = 0, keyLen = keys.length; j < keyLen; ++j) {
        var k = keys[j];
        if (overrides[k] !== undefined) {
          target[k] = overrides[k];
        }
      }
    }
  }
  return target;
}


var debug;
if (process.env.NODE_DEBUG && /\btunnel\b/.test(process.env.NODE_DEBUG)) {
  debug = function() {
    var args = Array.prototype.slice.call(arguments);
    if (typeof args[0] === 'string') {
      args[0] = 'TUNNEL: ' + args[0];
    } else {
      args.unshift('TUNNEL:');
    }
    console.error.apply(console, args);
  }
} else {
  debug = function() {};
}
exports.debug = debug; // for test


/***/ }),

/***/ 1315:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Convert a typed array to a Buffer without a copy
 *
 * Author:   Feross Aboukhadijeh <https://feross.org>
 * License:  MIT
 *
 * `npm install typedarray-to-buffer`
 */

var isTypedArray = (__nccwpck_require__(657).strict)

module.exports = function typedarrayToBuffer (arr) {
  if (isTypedArray(arr)) {
    // To avoid a copy, use the typed array's underlying ArrayBuffer to back new Buffer
    var buf = Buffer.from(arr.buffer)
    if (arr.byteLength !== arr.buffer.byteLength) {
      // Respect the "view", i.e. byteOffset and byteLength, without doing a copy
      buf = buf.slice(arr.byteOffset, arr.byteOffset + arr.byteLength)
    }
    return buf
  } else {
    // Pass through all other types to `Buffer.from`
    return Buffer.from(arr)
  }
}


/***/ }),

/***/ 2534:
/***/ ((module) => {

"use strict";


/**
 * Checks if a given buffer contains only correct UTF-8.
 * Ported from https://www.cl.cam.ac.uk/%7Emgk25/ucs/utf8_check.c by
 * Markus Kuhn.
 *
 * @param {Buffer} buf The buffer to check
 * @return {Boolean} `true` if `buf` contains only correct UTF-8, else `false`
 * @public
 */
function isValidUTF8(buf) {
  const len = buf.length;
  let i = 0;

  while (i < len) {
    if ((buf[i] & 0x80) === 0x00) {  // 0xxxxxxx
      i++;
    } else if ((buf[i] & 0xe0) === 0xc0) {  // 110xxxxx 10xxxxxx
      if (
        i + 1 === len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i] & 0xfe) === 0xc0  // overlong
      ) {
        return false;
      }

      i += 2;
    } else if ((buf[i] & 0xf0) === 0xe0) {  // 1110xxxx 10xxxxxx 10xxxxxx
      if (
        i + 2 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        buf[i] === 0xe0 && (buf[i + 1] & 0xe0) === 0x80 ||  // overlong
        buf[i] === 0xed && (buf[i + 1] & 0xe0) === 0xa0  // surrogate (U+D800 - U+DFFF)
      ) {
        return false;
      }

      i += 3;
    } else if ((buf[i] & 0xf8) === 0xf0) {  // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
      if (
        i + 3 >= len ||
        (buf[i + 1] & 0xc0) !== 0x80 ||
        (buf[i + 2] & 0xc0) !== 0x80 ||
        (buf[i + 3] & 0xc0) !== 0x80 ||
        buf[i] === 0xf0 && (buf[i + 1] & 0xf0) === 0x80 ||  // overlong
        buf[i] === 0xf4 && buf[i + 1] > 0x8f || buf[i] > 0xf4  // > U+10FFFF
      ) {
        return false;
      }

      i += 4;
    } else {
      return false;
    }
  }

  return true;
}

module.exports = isValidUTF8;


/***/ }),

/***/ 5161:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

"use strict";


try {
  module.exports = require(__nccwpck_require__.ab + "prebuilds/linux-x64/node.napi1.node");
} catch (e) {
  module.exports = __nccwpck_require__(2534);
}


/***/ }),

/***/ 5840:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
Object.defineProperty(exports, "v1", ({
  enumerable: true,
  get: function () {
    return _v.default;
  }
}));
Object.defineProperty(exports, "v3", ({
  enumerable: true,
  get: function () {
    return _v2.default;
  }
}));
Object.defineProperty(exports, "v4", ({
  enumerable: true,
  get: function () {
    return _v3.default;
  }
}));
Object.defineProperty(exports, "v5", ({
  enumerable: true,
  get: function () {
    return _v4.default;
  }
}));
Object.defineProperty(exports, "NIL", ({
  enumerable: true,
  get: function () {
    return _nil.default;
  }
}));
Object.defineProperty(exports, "version", ({
  enumerable: true,
  get: function () {
    return _version.default;
  }
}));
Object.defineProperty(exports, "validate", ({
  enumerable: true,
  get: function () {
    return _validate.default;
  }
}));
Object.defineProperty(exports, "stringify", ({
  enumerable: true,
  get: function () {
    return _stringify.default;
  }
}));
Object.defineProperty(exports, "parse", ({
  enumerable: true,
  get: function () {
    return _parse.default;
  }
}));

var _v = _interopRequireDefault(__nccwpck_require__(8628));

var _v2 = _interopRequireDefault(__nccwpck_require__(6409));

var _v3 = _interopRequireDefault(__nccwpck_require__(5122));

var _v4 = _interopRequireDefault(__nccwpck_require__(9120));

var _nil = _interopRequireDefault(__nccwpck_require__(5332));

var _version = _interopRequireDefault(__nccwpck_require__(1595));

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ }),

/***/ 4569:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function md5(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('md5').update(bytes).digest();
}

var _default = md5;
exports["default"] = _default;

/***/ }),

/***/ 5332:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = '00000000-0000-0000-0000-000000000000';
exports["default"] = _default;

/***/ }),

/***/ 2746:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  let v;
  const arr = new Uint8Array(16); // Parse ########-....-....-....-............

  arr[0] = (v = parseInt(uuid.slice(0, 8), 16)) >>> 24;
  arr[1] = v >>> 16 & 0xff;
  arr[2] = v >>> 8 & 0xff;
  arr[3] = v & 0xff; // Parse ........-####-....-....-............

  arr[4] = (v = parseInt(uuid.slice(9, 13), 16)) >>> 8;
  arr[5] = v & 0xff; // Parse ........-....-####-....-............

  arr[6] = (v = parseInt(uuid.slice(14, 18), 16)) >>> 8;
  arr[7] = v & 0xff; // Parse ........-....-....-####-............

  arr[8] = (v = parseInt(uuid.slice(19, 23), 16)) >>> 8;
  arr[9] = v & 0xff; // Parse ........-....-....-....-############
  // (Use "/" to avoid 32-bit truncation when bit-shifting high-order bytes)

  arr[10] = (v = parseInt(uuid.slice(24, 36), 16)) / 0x10000000000 & 0xff;
  arr[11] = v / 0x100000000 & 0xff;
  arr[12] = v >>> 24 & 0xff;
  arr[13] = v >>> 16 & 0xff;
  arr[14] = v >>> 8 & 0xff;
  arr[15] = v & 0xff;
  return arr;
}

var _default = parse;
exports["default"] = _default;

/***/ }),

/***/ 814:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;
var _default = /^(?:[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}|00000000-0000-0000-0000-000000000000)$/i;
exports["default"] = _default;

/***/ }),

/***/ 807:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = rng;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const rnds8Pool = new Uint8Array(256); // # of random values to pre-allocate

let poolPtr = rnds8Pool.length;

function rng() {
  if (poolPtr > rnds8Pool.length - 16) {
    _crypto.default.randomFillSync(rnds8Pool);

    poolPtr = 0;
  }

  return rnds8Pool.slice(poolPtr, poolPtr += 16);
}

/***/ }),

/***/ 5274:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _crypto = _interopRequireDefault(__nccwpck_require__(6113));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function sha1(bytes) {
  if (Array.isArray(bytes)) {
    bytes = Buffer.from(bytes);
  } else if (typeof bytes === 'string') {
    bytes = Buffer.from(bytes, 'utf8');
  }

  return _crypto.default.createHash('sha1').update(bytes).digest();
}

var _default = sha1;
exports["default"] = _default;

/***/ }),

/***/ 8950:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Convert array of 16 byte values to UUID string format of the form:
 * XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 */
const byteToHex = [];

for (let i = 0; i < 256; ++i) {
  byteToHex.push((i + 0x100).toString(16).substr(1));
}

function stringify(arr, offset = 0) {
  // Note: Be careful editing this code!  It's been tuned for performance
  // and works in ways you may not expect. See https://github.com/uuidjs/uuid/pull/434
  const uuid = (byteToHex[arr[offset + 0]] + byteToHex[arr[offset + 1]] + byteToHex[arr[offset + 2]] + byteToHex[arr[offset + 3]] + '-' + byteToHex[arr[offset + 4]] + byteToHex[arr[offset + 5]] + '-' + byteToHex[arr[offset + 6]] + byteToHex[arr[offset + 7]] + '-' + byteToHex[arr[offset + 8]] + byteToHex[arr[offset + 9]] + '-' + byteToHex[arr[offset + 10]] + byteToHex[arr[offset + 11]] + byteToHex[arr[offset + 12]] + byteToHex[arr[offset + 13]] + byteToHex[arr[offset + 14]] + byteToHex[arr[offset + 15]]).toLowerCase(); // Consistency check for valid UUID.  If this throws, it's likely due to one
  // of the following:
  // - One or more input array values don't map to a hex octet (leading to
  // "undefined" in the uuid)
  // - Invalid input values for the RFC `version` or `variant` fields

  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Stringified UUID is invalid');
  }

  return uuid;
}

var _default = stringify;
exports["default"] = _default;

/***/ }),

/***/ 8628:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// **`v1()` - Generate time-based UUID**
//
// Inspired by https://github.com/LiosK/UUID.js
// and http://docs.python.org/library/uuid.html
let _nodeId;

let _clockseq; // Previous uuid creation time


let _lastMSecs = 0;
let _lastNSecs = 0; // See https://github.com/uuidjs/uuid for API details

function v1(options, buf, offset) {
  let i = buf && offset || 0;
  const b = buf || new Array(16);
  options = options || {};
  let node = options.node || _nodeId;
  let clockseq = options.clockseq !== undefined ? options.clockseq : _clockseq; // node and clockseq need to be initialized to random values if they're not
  // specified.  We do this lazily to minimize issues related to insufficient
  // system entropy.  See #189

  if (node == null || clockseq == null) {
    const seedBytes = options.random || (options.rng || _rng.default)();

    if (node == null) {
      // Per 4.5, create and 48-bit node id, (47 random bits + multicast bit = 1)
      node = _nodeId = [seedBytes[0] | 0x01, seedBytes[1], seedBytes[2], seedBytes[3], seedBytes[4], seedBytes[5]];
    }

    if (clockseq == null) {
      // Per 4.2.2, randomize (14 bit) clockseq
      clockseq = _clockseq = (seedBytes[6] << 8 | seedBytes[7]) & 0x3fff;
    }
  } // UUID timestamps are 100 nano-second units since the Gregorian epoch,
  // (1582-10-15 00:00).  JSNumbers aren't precise enough for this, so
  // time is handled internally as 'msecs' (integer milliseconds) and 'nsecs'
  // (100-nanoseconds offset from msecs) since unix epoch, 1970-01-01 00:00.


  let msecs = options.msecs !== undefined ? options.msecs : Date.now(); // Per 4.2.1.2, use count of uuid's generated during the current clock
  // cycle to simulate higher resolution clock

  let nsecs = options.nsecs !== undefined ? options.nsecs : _lastNSecs + 1; // Time since last uuid creation (in msecs)

  const dt = msecs - _lastMSecs + (nsecs - _lastNSecs) / 10000; // Per 4.2.1.2, Bump clockseq on clock regression

  if (dt < 0 && options.clockseq === undefined) {
    clockseq = clockseq + 1 & 0x3fff;
  } // Reset nsecs if clock regresses (new clockseq) or we've moved onto a new
  // time interval


  if ((dt < 0 || msecs > _lastMSecs) && options.nsecs === undefined) {
    nsecs = 0;
  } // Per 4.2.1.2 Throw error if too many uuids are requested


  if (nsecs >= 10000) {
    throw new Error("uuid.v1(): Can't create more than 10M uuids/sec");
  }

  _lastMSecs = msecs;
  _lastNSecs = nsecs;
  _clockseq = clockseq; // Per 4.1.4 - Convert from unix epoch to Gregorian epoch

  msecs += 12219292800000; // `time_low`

  const tl = ((msecs & 0xfffffff) * 10000 + nsecs) % 0x100000000;
  b[i++] = tl >>> 24 & 0xff;
  b[i++] = tl >>> 16 & 0xff;
  b[i++] = tl >>> 8 & 0xff;
  b[i++] = tl & 0xff; // `time_mid`

  const tmh = msecs / 0x100000000 * 10000 & 0xfffffff;
  b[i++] = tmh >>> 8 & 0xff;
  b[i++] = tmh & 0xff; // `time_high_and_version`

  b[i++] = tmh >>> 24 & 0xf | 0x10; // include version

  b[i++] = tmh >>> 16 & 0xff; // `clock_seq_hi_and_reserved` (Per 4.2.2 - include variant)

  b[i++] = clockseq >>> 8 | 0x80; // `clock_seq_low`

  b[i++] = clockseq & 0xff; // `node`

  for (let n = 0; n < 6; ++n) {
    b[i + n] = node[n];
  }

  return buf || (0, _stringify.default)(b);
}

var _default = v1;
exports["default"] = _default;

/***/ }),

/***/ 6409:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _md = _interopRequireDefault(__nccwpck_require__(4569));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v3 = (0, _v.default)('v3', 0x30, _md.default);
var _default = v3;
exports["default"] = _default;

/***/ }),

/***/ 5998:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = _default;
exports.URL = exports.DNS = void 0;

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

var _parse = _interopRequireDefault(__nccwpck_require__(2746));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function stringToBytes(str) {
  str = unescape(encodeURIComponent(str)); // UTF8 escape

  const bytes = [];

  for (let i = 0; i < str.length; ++i) {
    bytes.push(str.charCodeAt(i));
  }

  return bytes;
}

const DNS = '6ba7b810-9dad-11d1-80b4-00c04fd430c8';
exports.DNS = DNS;
const URL = '6ba7b811-9dad-11d1-80b4-00c04fd430c8';
exports.URL = URL;

function _default(name, version, hashfunc) {
  function generateUUID(value, namespace, buf, offset) {
    if (typeof value === 'string') {
      value = stringToBytes(value);
    }

    if (typeof namespace === 'string') {
      namespace = (0, _parse.default)(namespace);
    }

    if (namespace.length !== 16) {
      throw TypeError('Namespace must be array-like (16 iterable integer values, 0-255)');
    } // Compute hash of namespace and value, Per 4.3
    // Future: Use spread syntax when supported on all platforms, e.g. `bytes =
    // hashfunc([...namespace, ... value])`


    let bytes = new Uint8Array(16 + value.length);
    bytes.set(namespace);
    bytes.set(value, namespace.length);
    bytes = hashfunc(bytes);
    bytes[6] = bytes[6] & 0x0f | version;
    bytes[8] = bytes[8] & 0x3f | 0x80;

    if (buf) {
      offset = offset || 0;

      for (let i = 0; i < 16; ++i) {
        buf[offset + i] = bytes[i];
      }

      return buf;
    }

    return (0, _stringify.default)(bytes);
  } // Function#name is not settable on some platforms (#270)


  try {
    generateUUID.name = name; // eslint-disable-next-line no-empty
  } catch (err) {} // For CommonJS default export support


  generateUUID.DNS = DNS;
  generateUUID.URL = URL;
  return generateUUID;
}

/***/ }),

/***/ 5122:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _rng = _interopRequireDefault(__nccwpck_require__(807));

var _stringify = _interopRequireDefault(__nccwpck_require__(8950));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function v4(options, buf, offset) {
  options = options || {};

  const rnds = options.random || (options.rng || _rng.default)(); // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`


  rnds[6] = rnds[6] & 0x0f | 0x40;
  rnds[8] = rnds[8] & 0x3f | 0x80; // Copy bytes to buffer, if provided

  if (buf) {
    offset = offset || 0;

    for (let i = 0; i < 16; ++i) {
      buf[offset + i] = rnds[i];
    }

    return buf;
  }

  return (0, _stringify.default)(rnds);
}

var _default = v4;
exports["default"] = _default;

/***/ }),

/***/ 9120:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _v = _interopRequireDefault(__nccwpck_require__(5998));

var _sha = _interopRequireDefault(__nccwpck_require__(5274));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const v5 = (0, _v.default)('v5', 0x50, _sha.default);
var _default = v5;
exports["default"] = _default;

/***/ }),

/***/ 6900:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _regex = _interopRequireDefault(__nccwpck_require__(814));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function validate(uuid) {
  return typeof uuid === 'string' && _regex.default.test(uuid);
}

var _default = validate;
exports["default"] = _default;

/***/ }),

/***/ 1595:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports["default"] = void 0;

var _validate = _interopRequireDefault(__nccwpck_require__(6900));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function version(uuid) {
  if (!(0, _validate.default)(uuid)) {
    throw TypeError('Invalid UUID');
  }

  return parseInt(uuid.substr(14, 1), 16);
}

var _default = version;
exports["default"] = _default;

/***/ }),

/***/ 2119:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var websocket_1 = __nccwpck_require__(6546);
var EventTarget_1 = __nccwpck_require__(6962);
var Event_1 = __nccwpck_require__(2928);
var CloseEvent_1 = __nccwpck_require__(941);
var MessageEvent_1 = __nccwpck_require__(3607);
var ErrorEvent_1 = __nccwpck_require__(8503);
var WebSocket = /** @class */ (function (_super) {
    __extends(WebSocket, _super);
    /* ----------------------------------------------------------------
        CONSTRUCTORS
    ---------------------------------------------------------------- */
    function WebSocket(url, protocols) {
        var _this = _super.call(this) || this;
        _this.on_ = {};
        _this.state_ = WebSocket.CONNECTING;
        //----
        // CLIENT
        //----
        // PREPARE SOCKET
        _this.client_ = new websocket_1.client();
        _this.client_.on("connect", _this._Handle_connect.bind(_this));
        _this.client_.on("connectFailed", _this._Handle_error.bind(_this));
        if (typeof protocols === "string")
            protocols = [protocols];
        // DO CONNECT
        _this.client_.connect(url, protocols);
        return _this;
    }
    WebSocket.prototype.close = function (code, reason) {
        this.state_ = WebSocket.CLOSING;
        if (code === undefined)
            this.connection_.sendCloseFrame();
        else
            this.connection_.sendCloseFrame(code, reason, true);
    };
    /* ================================================================
        ACCESSORS
            - SENDER
            - PROPERTIES
            - LISTENERS
    ===================================================================
        SENDER
    ---------------------------------------------------------------- */
    WebSocket.prototype.send = function (data) {
        if (typeof data.valueOf() === "string")
            this.connection_.sendUTF(data);
        else {
            var buffer = void 0;
            if (data instanceof Buffer)
                buffer = data;
            else if (data instanceof Blob)
                buffer = new Buffer(data, "blob");
            else if (data.buffer)
                buffer = new Buffer(data.buffer);
            else
                buffer = new Buffer(data);
            this.connection_.sendBytes(buffer);
        }
    };
    Object.defineProperty(WebSocket.prototype, "url", {
        /* ----------------------------------------------------------------
            PROPERTIES
        ---------------------------------------------------------------- */
        get: function () {
            return this.client_.url.href;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "protocol", {
        get: function () {
            return this.client_.protocols
                ? this.client_.protocols[0]
                : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "extensions", {
        get: function () {
            return this.connection_ && this.connection_.extensions
                ? this.connection_.extensions[0].name
                : "";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "readyState", {
        get: function () {
            return this.state_;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "bufferedAmount", {
        get: function () {
            return this.connection_.bytesWaitingToFlush;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "binaryType", {
        get: function () {
            return "arraybuffer";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onopen", {
        /* ----------------------------------------------------------------
            LISTENERS
        ---------------------------------------------------------------- */
        get: function () {
            return this.on_.open;
        },
        set: function (listener) {
            this._Set_on("open", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onclose", {
        get: function () {
            return this.on_.close;
        },
        set: function (listener) {
            this._Set_on("close", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onmessage", {
        get: function () {
            return this.on_.message;
        },
        set: function (listener) {
            this._Set_on("message", listener);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(WebSocket.prototype, "onerror", {
        get: function () {
            return this.on_.error;
        },
        set: function (listener) {
            this._Set_on("error", listener);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @hidden
     */
    WebSocket.prototype._Set_on = function (type, listener) {
        if (this.on_[type])
            this.removeEventListener(type, this.on_[type]);
        this.addEventListener(type, listener);
        this.on_[type] = listener;
    };
    /* ----------------------------------------------------------------
        SOCKET HANDLERS
    ---------------------------------------------------------------- */
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_connect = function (connection) {
        this.connection_ = connection;
        this.state_ = WebSocket.OPEN;
        this.connection_.on("message", this._Handle_message.bind(this));
        this.connection_.on("error", this._Handle_error.bind(this));
        this.connection_.on("close", this._Handle_close.bind(this));
        var event = new Event_1.Event("open", EVENT_INIT);
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_close = function (code, reason) {
        var event = new CloseEvent_1.CloseEvent("close", __assign({}, EVENT_INIT, { code: code, reason: reason }));
        this.state_ = WebSocket.CLOSED;
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_message = function (message) {
        var event = new MessageEvent_1.MessageEvent("message", __assign({}, EVENT_INIT, { data: message.binaryData
                ? message.binaryData
                : message.utf8Data }));
        this.dispatchEvent(event);
    };
    /**
     * @hidden
     */
    WebSocket.prototype._Handle_error = function (error) {
        var event = new ErrorEvent_1.ErrorEvent("error", __assign({}, EVENT_INIT, { error: error, message: error.message }));
        if (this.state_ === WebSocket.CONNECTING)
            this.state_ = WebSocket.CLOSED;
        this.dispatchEvent(event);
    };
    return WebSocket;
}(EventTarget_1.EventTarget));
exports.WebSocket = WebSocket;
(function (WebSocket) {
    WebSocket.CONNECTING = 0;
    WebSocket.OPEN = 1;
    WebSocket.CLOSING = 2;
    WebSocket.CLOSED = 3;
})(WebSocket = exports.WebSocket || (exports.WebSocket = {}));
exports.WebSocket = WebSocket;
var EVENT_INIT = {
    bubbles: false,
    cancelable: false
};
//# sourceMappingURL=WebSocket.js.map

/***/ }),

/***/ 941:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Event_1 = __nccwpck_require__(2928);
var CloseEvent = /** @class */ (function (_super) {
    __extends(CloseEvent, _super);
    function CloseEvent(type, init) {
        return _super.call(this, type, init) || this;
    }
    return CloseEvent;
}(Event_1.Event));
exports.CloseEvent = CloseEvent;
//# sourceMappingURL=CloseEvent.js.map

/***/ }),

/***/ 8503:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Event_1 = __nccwpck_require__(2928);
var ErrorEvent = /** @class */ (function (_super) {
    __extends(ErrorEvent, _super);
    function ErrorEvent(type, init) {
        return _super.call(this, type, init) || this;
    }
    return ErrorEvent;
}(Event_1.Event));
exports.ErrorEvent = ErrorEvent;
//# sourceMappingURL=ErrorEvent.js.map

/***/ }),

/***/ 2928:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var Event = /** @class */ (function () {
    function Event(type, init) {
        this.type = type;
        if (init)
            Object.assign(this, init);
    }
    return Event;
}());
exports.Event = Event;
//# sourceMappingURL=Event.js.map

/***/ }),

/***/ 6962:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
var HashSet_1 = __nccwpck_require__(6285);
var HashMap_1 = __nccwpck_require__(1693);
var EventTarget = /** @class */ (function () {
    function EventTarget() {
        this.listeners_ = new HashMap_1.HashMap();
        this.created_at_ = new Date();
    }
    EventTarget.prototype.dispatchEvent = function (event) {
        var e_1, _a;
        // FIND LISTENERS
        var it = this.listeners_.find(event.type);
        if (it.equals(this.listeners_.end()))
            return;
        // SET DEFAULT ARGUMENTS
        event.target = this;
        event.timeStamp = new Date().getTime() - this.created_at_.getTime();
        try {
            // CALL THE LISTENERS
            for (var _b = __values(it.second), _c = _b.next(); !_c.done; _c = _b.next()) {
                var listener = _c.value;
                listener(event);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    EventTarget.prototype.addEventListener = function (type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
            it = this.listeners_.emplace(type, new HashSet_1.HashSet()).first;
        it.second.insert(listener);
    };
    EventTarget.prototype.removeEventListener = function (type, listener) {
        var it = this.listeners_.find(type);
        if (it.equals(this.listeners_.end()))
            return;
        it.second.erase(listener);
        if (it.second.empty())
            this.listeners_.erase(it);
    };
    return EventTarget;
}());
exports.EventTarget = EventTarget;
//# sourceMappingURL=EventTarget.js.map

/***/ }),

/***/ 3607:
/***/ (function(__unused_webpack_module, exports, __nccwpck_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", ({ value: true }));
var Event_1 = __nccwpck_require__(2928);
var MessageEvent = /** @class */ (function (_super) {
    __extends(MessageEvent, _super);
    function MessageEvent(type, init) {
        return _super.call(this, type, init) || this;
    }
    return MessageEvent;
}(Event_1.Event));
exports.MessageEvent = MessageEvent;
//# sourceMappingURL=MessageEvent.js.map

/***/ }),

/***/ 3:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
var node_1 = __nccwpck_require__(4602);
if (node_1.is_node())
    global.WebSocket = (__nccwpck_require__(2119).WebSocket);
//# sourceMappingURL=index.js.map

/***/ }),

/***/ 6546:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(3692);

/***/ }),

/***/ 5073:
/***/ ((module) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var Deprecation = {
    disableWarnings: false,

    deprecationWarningMap: {

    },

    warn: function(deprecationName) {
        if (!this.disableWarnings && this.deprecationWarningMap[deprecationName]) {
            console.warn('DEPRECATION WARNING: ' + this.deprecationWarningMap[deprecationName]);
            this.deprecationWarningMap[deprecationName] = false;
        }
    }
};

module.exports = Deprecation;


/***/ }),

/***/ 5878:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var WebSocketClient = __nccwpck_require__(4625);
var toBuffer = __nccwpck_require__(1315);
var yaeti = __nccwpck_require__(5438);


const CONNECTING = 0;
const OPEN = 1;
const CLOSING = 2;
const CLOSED = 3;


module.exports = W3CWebSocket;


function W3CWebSocket(url, protocols, origin, headers, requestOptions, clientConfig) {
    // Make this an EventTarget.
    yaeti.EventTarget.call(this);

    // Sanitize clientConfig.
    clientConfig = clientConfig || {};
    clientConfig.assembleFragments = true;  // Required in the W3C API.

    var self = this;

    this._url = url;
    this._readyState = CONNECTING;
    this._protocol = undefined;
    this._extensions = '';
    this._bufferedAmount = 0;  // Hack, always 0.
    this._binaryType = 'arraybuffer';  // TODO: Should be 'blob' by default, but Node has no Blob.

    // The WebSocketConnection instance.
    this._connection = undefined;

    // WebSocketClient instance.
    this._client = new WebSocketClient(clientConfig);

    this._client.on('connect', function(connection) {
        onConnect.call(self, connection);
    });

    this._client.on('connectFailed', function() {
        onConnectFailed.call(self);
    });

    this._client.connect(url, protocols, origin, headers, requestOptions);
}


// Expose W3C read only attributes.
Object.defineProperties(W3CWebSocket.prototype, {
    url:            { get: function() { return this._url;            } },
    readyState:     { get: function() { return this._readyState;     } },
    protocol:       { get: function() { return this._protocol;       } },
    extensions:     { get: function() { return this._extensions;     } },
    bufferedAmount: { get: function() { return this._bufferedAmount; } }
});


// Expose W3C write/read attributes.
Object.defineProperties(W3CWebSocket.prototype, {
    binaryType: {
        get: function() {
            return this._binaryType;
        },
        set: function(type) {
            // TODO: Just 'arraybuffer' supported.
            if (type !== 'arraybuffer') {
                throw new SyntaxError('just "arraybuffer" type allowed for "binaryType" attribute');
            }
            this._binaryType = type;
        }
    }
});


// Expose W3C readyState constants into the WebSocket instance as W3C states.
[['CONNECTING',CONNECTING], ['OPEN',OPEN], ['CLOSING',CLOSING], ['CLOSED',CLOSED]].forEach(function(property) {
    Object.defineProperty(W3CWebSocket.prototype, property[0], {
        get: function() { return property[1]; }
    });
});

// Also expose W3C readyState constants into the WebSocket class (not defined by the W3C,
// but there are so many libs relying on them).
[['CONNECTING',CONNECTING], ['OPEN',OPEN], ['CLOSING',CLOSING], ['CLOSED',CLOSED]].forEach(function(property) {
    Object.defineProperty(W3CWebSocket, property[0], {
        get: function() { return property[1]; }
    });
});


W3CWebSocket.prototype.send = function(data) {
    if (this._readyState !== OPEN) {
        throw new Error('cannot call send() while not connected');
    }

    // Text.
    if (typeof data === 'string' || data instanceof String) {
        this._connection.sendUTF(data);
    }
    // Binary.
    else {
        // Node Buffer.
        if (data instanceof Buffer) {
            this._connection.sendBytes(data);
        }
        // If ArrayBuffer or ArrayBufferView convert it to Node Buffer.
        else if (data.byteLength || data.byteLength === 0) {
            data = toBuffer(data);
            this._connection.sendBytes(data);
        }
        else {
            throw new Error('unknown binary data:', data);
        }
    }
};


W3CWebSocket.prototype.close = function(code, reason) {
    switch(this._readyState) {
        case CONNECTING:
            // NOTE: We don't have the WebSocketConnection instance yet so no
            // way to close the TCP connection.
            // Artificially invoke the onConnectFailed event.
            onConnectFailed.call(this);
            // And close if it connects after a while.
            this._client.on('connect', function(connection) {
                if (code) {
                    connection.close(code, reason);
                } else {
                    connection.close();
                }
            });
            break;
        case OPEN:
            this._readyState = CLOSING;
            if (code) {
                this._connection.close(code, reason);
            } else {
                this._connection.close();
            }
            break;
        case CLOSING:
        case CLOSED:
            break;
    }
};


/**
 * Private API.
 */


function createCloseEvent(code, reason) {
    var event = new yaeti.Event('close');

    event.code = code;
    event.reason = reason;
    event.wasClean = (typeof code === 'undefined' || code === 1000);

    return event;
}


function createMessageEvent(data) {
    var event = new yaeti.Event('message');

    event.data = data;

    return event;
}


function onConnect(connection) {
    var self = this;

    this._readyState = OPEN;
    this._connection = connection;
    this._protocol = connection.protocol;
    this._extensions = connection.extensions;

    this._connection.on('close', function(code, reason) {
        onClose.call(self, code, reason);
    });

    this._connection.on('message', function(msg) {
        onMessage.call(self, msg);
    });

    this.dispatchEvent(new yaeti.Event('open'));
}


function onConnectFailed() {
    destroy.call(this);
    this._readyState = CLOSED;

    try {
        this.dispatchEvent(new yaeti.Event('error'));
    } finally {
        this.dispatchEvent(createCloseEvent(1006, 'connection failed'));
    }
}


function onClose(code, reason) {
    destroy.call(this);
    this._readyState = CLOSED;

    this.dispatchEvent(createCloseEvent(code, reason || ''));
}


function onMessage(message) {
    if (message.utf8Data) {
        this.dispatchEvent(createMessageEvent(message.utf8Data));
    }
    else if (message.binaryData) {
        // Must convert from Node Buffer to ArrayBuffer.
        // TODO: or to a Blob (which does not exist in Node!).
        if (this.binaryType === 'arraybuffer') {
            var buffer = message.binaryData;
            var arraybuffer = new ArrayBuffer(buffer.length);
            var view = new Uint8Array(arraybuffer);
            for (var i=0, len=buffer.length; i<len; ++i) {
                view[i] = buffer[i];
            }
            this.dispatchEvent(createMessageEvent(arraybuffer));
        }
    }
}


function destroy() {
    this._client.removeAllListeners();
    if (this._connection) {
        this._connection.removeAllListeners();
    }
}


/***/ }),

/***/ 4625:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var utils = __nccwpck_require__(4407);
var extend = utils.extend;
var util = __nccwpck_require__(3837);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var http = __nccwpck_require__(3685);
var https = __nccwpck_require__(5687);
var url = __nccwpck_require__(7310);
var crypto = __nccwpck_require__(6113);
var WebSocketConnection = __nccwpck_require__(7745);
var bufferAllocUnsafe = utils.bufferAllocUnsafe;

var protocolSeparators = [
    '(', ')', '<', '>', '@',
    ',', ';', ':', '\\', '\"',
    '/', '[', ']', '?', '=',
    '{', '}', ' ', String.fromCharCode(9)
];

var excludedTlsOptions = ['hostname','port','method','path','headers'];

function WebSocketClient(config) {
    // Superclass Constructor
    EventEmitter.call(this);

    // TODO: Implement extensions

    this.config = {
        // 1MiB max frame size.
        maxReceivedFrameSize: 0x100000,

        // 8MiB max message size, only applicable if
        // assembleFragments is true
        maxReceivedMessageSize: 0x800000,

        // Outgoing messages larger than fragmentationThreshold will be
        // split into multiple fragments.
        fragmentOutgoingMessages: true,

        // Outgoing frames are fragmented if they exceed this threshold.
        // Default is 16KiB
        fragmentationThreshold: 0x4000,

        // Which version of the protocol to use for this session.  This
        // option will be removed once the protocol is finalized by the IETF
        // It is only available to ease the transition through the
        // intermediate draft protocol versions.
        // At present, it only affects the name of the Origin header.
        webSocketVersion: 13,

        // If true, fragmented messages will be automatically assembled
        // and the full message will be emitted via a 'message' event.
        // If false, each frame will be emitted via a 'frame' event and
        // the application will be responsible for aggregating multiple
        // fragmented frames.  Single-frame messages will emit a 'message'
        // event in addition to the 'frame' event.
        // Most users will want to leave this set to 'true'
        assembleFragments: true,

        // The Nagle Algorithm makes more efficient use of network resources
        // by introducing a small delay before sending small packets so that
        // multiple messages can be batched together before going onto the
        // wire.  This however comes at the cost of latency, so the default
        // is to disable it.  If you don't need low latency and are streaming
        // lots of small messages, you can change this to 'false'
        disableNagleAlgorithm: true,

        // The number of milliseconds to wait after sending a close frame
        // for an acknowledgement to come back before giving up and just
        // closing the socket.
        closeTimeout: 5000,

        // Options to pass to https.connect if connecting via TLS
        tlsOptions: {}
    };

    if (config) {
        var tlsOptions;
        if (config.tlsOptions) {
          tlsOptions = config.tlsOptions;
          delete config.tlsOptions;
        }
        else {
          tlsOptions = {};
        }
        extend(this.config, config);
        extend(this.config.tlsOptions, tlsOptions);
    }

    this._req = null;
    
    switch (this.config.webSocketVersion) {
        case 8:
        case 13:
            break;
        default:
            throw new Error('Requested webSocketVersion is not supported. Allowed values are 8 and 13.');
    }
}

util.inherits(WebSocketClient, EventEmitter);

WebSocketClient.prototype.connect = function(requestUrl, protocols, origin, headers, extraRequestOptions) {
    var self = this;
    
    if (typeof(protocols) === 'string') {
        if (protocols.length > 0) {
            protocols = [protocols];
        }
        else {
            protocols = [];
        }
    }
    if (!(protocols instanceof Array)) {
        protocols = [];
    }
    this.protocols = protocols;
    this.origin = origin;

    if (typeof(requestUrl) === 'string') {
        this.url = url.parse(requestUrl);
    }
    else {
        this.url = requestUrl; // in case an already parsed url is passed in.
    }
    if (!this.url.protocol) {
        throw new Error('You must specify a full WebSocket URL, including protocol.');
    }
    if (!this.url.host) {
        throw new Error('You must specify a full WebSocket URL, including hostname. Relative URLs are not supported.');
    }

    this.secure = (this.url.protocol === 'wss:');

    // validate protocol characters:
    this.protocols.forEach(function(protocol) {
        for (var i=0; i < protocol.length; i ++) {
            var charCode = protocol.charCodeAt(i);
            var character = protocol.charAt(i);
            if (charCode < 0x0021 || charCode > 0x007E || protocolSeparators.indexOf(character) !== -1) {
                throw new Error('Protocol list contains invalid character "' + String.fromCharCode(charCode) + '"');
            }
        }
    });

    var defaultPorts = {
        'ws:': '80',
        'wss:': '443'
    };

    if (!this.url.port) {
        this.url.port = defaultPorts[this.url.protocol];
    }

    var nonce = bufferAllocUnsafe(16);
    for (var i=0; i < 16; i++) {
        nonce[i] = Math.round(Math.random()*0xFF);
    }
    this.base64nonce = nonce.toString('base64');

    var hostHeaderValue = this.url.hostname;
    if ((this.url.protocol === 'ws:' && this.url.port !== '80') ||
        (this.url.protocol === 'wss:' && this.url.port !== '443'))  {
        hostHeaderValue += (':' + this.url.port);
    }

    var reqHeaders = {};
    if (this.secure && this.config.tlsOptions.hasOwnProperty('headers')) {
      // Allow for additional headers to be provided when connecting via HTTPS
      extend(reqHeaders, this.config.tlsOptions.headers);
    }
    if (headers) {
      // Explicitly provided headers take priority over any from tlsOptions
      extend(reqHeaders, headers);
    }
    extend(reqHeaders, {
        'Upgrade': 'websocket',
        'Connection': 'Upgrade',
        'Sec-WebSocket-Version': this.config.webSocketVersion.toString(10),
        'Sec-WebSocket-Key': this.base64nonce,
        'Host': reqHeaders.Host || hostHeaderValue
    });

    if (this.protocols.length > 0) {
        reqHeaders['Sec-WebSocket-Protocol'] = this.protocols.join(', ');
    }
    if (this.origin) {
        if (this.config.webSocketVersion === 13) {
            reqHeaders['Origin'] = this.origin;
        }
        else if (this.config.webSocketVersion === 8) {
            reqHeaders['Sec-WebSocket-Origin'] = this.origin;
        }
    }

    // TODO: Implement extensions

    var pathAndQuery;
    // Ensure it begins with '/'.
    if (this.url.pathname) {
        pathAndQuery = this.url.path;
    }
    else if (this.url.path) {
        pathAndQuery = '/' + this.url.path;
    }
    else {
        pathAndQuery = '/';
    }

    function handleRequestError(error) {
        self._req = null;
        self.emit('connectFailed', error);
    }

    var requestOptions = {
        agent: false
    };
    if (extraRequestOptions) {
        extend(requestOptions, extraRequestOptions);
    }
    // These options are always overridden by the library.  The user is not
    // allowed to specify these directly.
    extend(requestOptions, {
        hostname: this.url.hostname,
        port: this.url.port,
        method: 'GET',
        path: pathAndQuery,
        headers: reqHeaders
    });
    if (this.secure) {
        var tlsOptions = this.config.tlsOptions;
        for (var key in tlsOptions) {
            if (tlsOptions.hasOwnProperty(key) && excludedTlsOptions.indexOf(key) === -1) {
                requestOptions[key] = tlsOptions[key];
            }
        }
    }

    var req = this._req = (this.secure ? https : http).request(requestOptions);
    req.on('upgrade', function handleRequestUpgrade(response, socket, head) {
        self._req = null;
        req.removeListener('error', handleRequestError);
        self.socket = socket;
        self.response = response;
        self.firstDataChunk = head;
        self.validateHandshake();
    });
    req.on('error', handleRequestError);

    req.on('response', function(response) {
        self._req = null;
        if (utils.eventEmitterListenerCount(self, 'httpResponse') > 0) {
            self.emit('httpResponse', response, self);
            if (response.socket) {
                response.socket.end();
            }
        }
        else {
            var headerDumpParts = [];
            for (var headerName in response.headers) {
                headerDumpParts.push(headerName + ': ' + response.headers[headerName]);
            }
            self.failHandshake(
                'Server responded with a non-101 status: ' +
                response.statusCode + ' ' + response.statusMessage +
                '\nResponse Headers Follow:\n' +
                headerDumpParts.join('\n') + '\n'
            );
        }
    });
    req.end();
};

WebSocketClient.prototype.validateHandshake = function() {
    var headers = this.response.headers;

    if (this.protocols.length > 0) {
        this.protocol = headers['sec-websocket-protocol'];
        if (this.protocol) {
            if (this.protocols.indexOf(this.protocol) === -1) {
                this.failHandshake('Server did not respond with a requested protocol.');
                return;
            }
        }
        else {
            this.failHandshake('Expected a Sec-WebSocket-Protocol header.');
            return;
        }
    }

    if (!(headers['connection'] && headers['connection'].toLocaleLowerCase() === 'upgrade')) {
        this.failHandshake('Expected a Connection: Upgrade header from the server');
        return;
    }

    if (!(headers['upgrade'] && headers['upgrade'].toLocaleLowerCase() === 'websocket')) {
        this.failHandshake('Expected an Upgrade: websocket header from the server');
        return;
    }

    var sha1 = crypto.createHash('sha1');
    sha1.update(this.base64nonce + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    var expectedKey = sha1.digest('base64');

    if (!headers['sec-websocket-accept']) {
        this.failHandshake('Expected Sec-WebSocket-Accept header from server');
        return;
    }

    if (headers['sec-websocket-accept'] !== expectedKey) {
        this.failHandshake('Sec-WebSocket-Accept header from server didn\'t match expected value of ' + expectedKey);
        return;
    }

    // TODO: Support extensions

    this.succeedHandshake();
};

WebSocketClient.prototype.failHandshake = function(errorDescription) {
    if (this.socket && this.socket.writable) {
        this.socket.end();
    }
    this.emit('connectFailed', new Error(errorDescription));
};

WebSocketClient.prototype.succeedHandshake = function() {
    var connection = new WebSocketConnection(this.socket, [], this.protocol, true, this.config);

    connection.webSocketVersion = this.config.webSocketVersion;
    connection._addSocketEventListeners();

    this.emit('connect', connection);
    if (this.firstDataChunk.length > 0) {
        connection.handleSocketData(this.firstDataChunk);
    }
    this.firstDataChunk = null;
};

WebSocketClient.prototype.abort = function() {
    if (this._req) {
        this._req.abort();
    }
};

module.exports = WebSocketClient;


/***/ }),

/***/ 7745:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var util = __nccwpck_require__(3837);
var utils = __nccwpck_require__(4407);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var WebSocketFrame = __nccwpck_require__(2535);
var BufferList = __nccwpck_require__(1091);
var isValidUTF8 = __nccwpck_require__(5161);
var bufferAllocUnsafe = utils.bufferAllocUnsafe;
var bufferFromString = utils.bufferFromString;

// Connected, fully-open, ready to send and receive frames
const STATE_OPEN = 'open';
// Received a close frame from the remote peer
const STATE_PEER_REQUESTED_CLOSE = 'peer_requested_close';
// Sent close frame to remote peer.  No further data can be sent.
const STATE_ENDING = 'ending';
// Connection is fully closed.  No further data can be sent or received.
const STATE_CLOSED = 'closed';

var setImmediateImpl = ('setImmediate' in global) ?
                            global.setImmediate.bind(global) :
                            process.nextTick.bind(process);

var idCounter = 0;

function WebSocketConnection(socket, extensions, protocol, maskOutgoingPackets, config) {
    this._debug = utils.BufferingLogger('websocket:connection', ++idCounter);
    this._debug('constructor');
    
    if (this._debug.enabled) {
        instrumentSocketForDebugging(this, socket);
    }
    
    // Superclass Constructor
    EventEmitter.call(this);

    this._pingListenerCount = 0;
    this.on('newListener', function(ev) {
        if (ev === 'ping'){
            this._pingListenerCount++;
        }
      }).on('removeListener', function(ev) {
        if (ev === 'ping') {
            this._pingListenerCount--;
        }
    });

    this.config = config;
    this.socket = socket;
    this.protocol = protocol;
    this.extensions = extensions;
    this.remoteAddress = socket.remoteAddress;
    this.closeReasonCode = -1;
    this.closeDescription = null;
    this.closeEventEmitted = false;

    // We have to mask outgoing packets if we're acting as a WebSocket client.
    this.maskOutgoingPackets = maskOutgoingPackets;

    // We re-use the same buffers for the mask and frame header for all frames
    // received on each connection to avoid a small memory allocation for each
    // frame.
    this.maskBytes = bufferAllocUnsafe(4);
    this.frameHeader = bufferAllocUnsafe(10);

    // the BufferList will handle the data streaming in
    this.bufferList = new BufferList();

    // Prepare for receiving first frame
    this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    this.fragmentationSize = 0; // data received so far...
    this.frameQueue = [];
    
    // Various bits of connection state
    this.connected = true;
    this.state = STATE_OPEN;
    this.waitingForCloseResponse = false;
    // Received TCP FIN, socket's readable stream is finished.
    this.receivedEnd = false;

    this.closeTimeout = this.config.closeTimeout;
    this.assembleFragments = this.config.assembleFragments;
    this.maxReceivedMessageSize = this.config.maxReceivedMessageSize;

    this.outputBufferFull = false;
    this.inputPaused = false;
    this.receivedDataHandler = this.processReceivedData.bind(this);
    this._closeTimerHandler = this.handleCloseTimer.bind(this);

    // Disable nagle algorithm?
    this.socket.setNoDelay(this.config.disableNagleAlgorithm);

    // Make sure there is no socket inactivity timeout
    this.socket.setTimeout(0);

    if (this.config.keepalive && !this.config.useNativeKeepalive) {
        if (typeof(this.config.keepaliveInterval) !== 'number') {
            throw new Error('keepaliveInterval must be specified and numeric ' +
                            'if keepalive is true.');
        }
        this._keepaliveTimerHandler = this.handleKeepaliveTimer.bind(this);
        this.setKeepaliveTimer();

        if (this.config.dropConnectionOnKeepaliveTimeout) {
            if (typeof(this.config.keepaliveGracePeriod) !== 'number') {
                throw new Error('keepaliveGracePeriod  must be specified and ' +
                                'numeric if dropConnectionOnKeepaliveTimeout ' +
                                'is true.');
            }
            this._gracePeriodTimerHandler = this.handleGracePeriodTimer.bind(this);
        }
    }
    else if (this.config.keepalive && this.config.useNativeKeepalive) {
        if (!('setKeepAlive' in this.socket)) {
            throw new Error('Unable to use native keepalive: unsupported by ' +
                            'this version of Node.');
        }
        this.socket.setKeepAlive(true, this.config.keepaliveInterval);
    }
    
    // The HTTP Client seems to subscribe to socket error events
    // and re-dispatch them in such a way that doesn't make sense
    // for users of our client, so we want to make sure nobody
    // else is listening for error events on the socket besides us.
    this.socket.removeAllListeners('error');
}

WebSocketConnection.CLOSE_REASON_NORMAL = 1000;
WebSocketConnection.CLOSE_REASON_GOING_AWAY = 1001;
WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR = 1002;
WebSocketConnection.CLOSE_REASON_UNPROCESSABLE_INPUT = 1003;
WebSocketConnection.CLOSE_REASON_RESERVED = 1004; // Reserved value.  Undefined meaning.
WebSocketConnection.CLOSE_REASON_NOT_PROVIDED = 1005; // Not to be used on the wire
WebSocketConnection.CLOSE_REASON_ABNORMAL = 1006; // Not to be used on the wire
WebSocketConnection.CLOSE_REASON_INVALID_DATA = 1007;
WebSocketConnection.CLOSE_REASON_POLICY_VIOLATION = 1008;
WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG = 1009;
WebSocketConnection.CLOSE_REASON_EXTENSION_REQUIRED = 1010;
WebSocketConnection.CLOSE_REASON_INTERNAL_SERVER_ERROR = 1011;
WebSocketConnection.CLOSE_REASON_TLS_HANDSHAKE_FAILED = 1015; // Not to be used on the wire

WebSocketConnection.CLOSE_DESCRIPTIONS = {
    1000: 'Normal connection closure',
    1001: 'Remote peer is going away',
    1002: 'Protocol error',
    1003: 'Unprocessable input',
    1004: 'Reserved',
    1005: 'Reason not provided',
    1006: 'Abnormal closure, no further detail available',
    1007: 'Invalid data received',
    1008: 'Policy violation',
    1009: 'Message too big',
    1010: 'Extension requested by client is required',
    1011: 'Internal Server Error',
    1015: 'TLS Handshake Failed'
};

function validateCloseReason(code) {
    if (code < 1000) {
        // Status codes in the range 0-999 are not used
        return false;
    }
    if (code >= 1000 && code <= 2999) {
        // Codes from 1000 - 2999 are reserved for use by the protocol.  Only
        // a few codes are defined, all others are currently illegal.
        return [1000, 1001, 1002, 1003, 1007, 1008, 1009, 1010, 1011, 1012, 1013, 1014, 1015].indexOf(code) !== -1;
    }
    if (code >= 3000 && code <= 3999) {
        // Reserved for use by libraries, frameworks, and applications.
        // Should be registered with IANA.  Interpretation of these codes is
        // undefined by the WebSocket protocol.
        return true;
    }
    if (code >= 4000 && code <= 4999) {
        // Reserved for private use.  Interpretation of these codes is
        // undefined by the WebSocket protocol.
        return true;
    }
    if (code >= 5000) {
        return false;
    }
}

util.inherits(WebSocketConnection, EventEmitter);

WebSocketConnection.prototype._addSocketEventListeners = function() {
    this.socket.on('error', this.handleSocketError.bind(this));
    this.socket.on('end', this.handleSocketEnd.bind(this));
    this.socket.on('close', this.handleSocketClose.bind(this));
    this.socket.on('drain', this.handleSocketDrain.bind(this));
    this.socket.on('pause', this.handleSocketPause.bind(this));
    this.socket.on('resume', this.handleSocketResume.bind(this));
    this.socket.on('data', this.handleSocketData.bind(this));
};

// set or reset the keepalive timer when data is received.
WebSocketConnection.prototype.setKeepaliveTimer = function() {
    this._debug('setKeepaliveTimer');
    if (!this.config.keepalive  || this.config.useNativeKeepalive) { return; }
    this.clearKeepaliveTimer();
    this.clearGracePeriodTimer();
    this._keepaliveTimeoutID = setTimeout(this._keepaliveTimerHandler, this.config.keepaliveInterval);
};

WebSocketConnection.prototype.clearKeepaliveTimer = function() {
    if (this._keepaliveTimeoutID) {
        clearTimeout(this._keepaliveTimeoutID);
    }
};

// No data has been received within config.keepaliveTimeout ms.
WebSocketConnection.prototype.handleKeepaliveTimer = function() {
    this._debug('handleKeepaliveTimer');
    this._keepaliveTimeoutID = null;
    this.ping();

    // If we are configured to drop connections if the client doesn't respond
    // then set the grace period timer.
    if (this.config.dropConnectionOnKeepaliveTimeout) {
        this.setGracePeriodTimer();
    }
    else {
        // Otherwise reset the keepalive timer to send the next ping.
        this.setKeepaliveTimer();
    }
};

WebSocketConnection.prototype.setGracePeriodTimer = function() {
    this._debug('setGracePeriodTimer');
    this.clearGracePeriodTimer();
    this._gracePeriodTimeoutID = setTimeout(this._gracePeriodTimerHandler, this.config.keepaliveGracePeriod);
};

WebSocketConnection.prototype.clearGracePeriodTimer = function() {
    if (this._gracePeriodTimeoutID) {
        clearTimeout(this._gracePeriodTimeoutID);
    }
};

WebSocketConnection.prototype.handleGracePeriodTimer = function() {
    this._debug('handleGracePeriodTimer');
    // If this is called, the client has not responded and is assumed dead.
    this._gracePeriodTimeoutID = null;
    this.drop(WebSocketConnection.CLOSE_REASON_ABNORMAL, 'Peer not responding.', true);
};

WebSocketConnection.prototype.handleSocketData = function(data) {
    this._debug('handleSocketData');
    // Reset the keepalive timer when receiving data of any kind.
    this.setKeepaliveTimer();

    // Add received data to our bufferList, which efficiently holds received
    // data chunks in a linked list of Buffer objects.
    this.bufferList.write(data);

    this.processReceivedData();
};

WebSocketConnection.prototype.processReceivedData = function() {
    this._debug('processReceivedData');
    // If we're not connected, we should ignore any data remaining on the buffer.
    if (!this.connected) { return; }

    // Receiving/parsing is expected to be halted when paused.
    if (this.inputPaused) { return; }

    var frame = this.currentFrame;

    // WebSocketFrame.prototype.addData returns true if all data necessary to
    // parse the frame was available.  It returns false if we are waiting for
    // more data to come in on the wire.
    if (!frame.addData(this.bufferList)) { this._debug('-- insufficient data for frame'); return; }

    var self = this;

    // Handle possible parsing errors
    if (frame.protocolError) {
        // Something bad happened.. get rid of this client.
        this._debug('-- protocol error');
        process.nextTick(function() {
            self.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR, frame.dropReason);
        });
        return;
    }
    else if (frame.frameTooLarge) {
        this._debug('-- frame too large');
        process.nextTick(function() {
            self.drop(WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG, frame.dropReason);
        });
        return;
    }

    // For now since we don't support extensions, all RSV bits are illegal
    if (frame.rsv1 || frame.rsv2 || frame.rsv3) {
        this._debug('-- illegal rsv flag');
        process.nextTick(function() {
            self.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
              'Unsupported usage of rsv bits without negotiated extension.');
        });
        return;
    }

    if (!this.assembleFragments) {
        this._debug('-- emitting frame');
        process.nextTick(function() { self.emit('frame', frame); });
    }

    process.nextTick(function() { self.processFrame(frame); });
    
    this.currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);

    // If there's data remaining, schedule additional processing, but yield
    // for now so that other connections have a chance to have their data
    // processed.  We use setImmediate here instead of process.nextTick to
    // explicitly indicate that we wish for other I/O to be handled first.
    if (this.bufferList.length > 0) {
        setImmediateImpl(this.receivedDataHandler);
    }
};

WebSocketConnection.prototype.handleSocketError = function(error) {
    this._debug('handleSocketError: %j', error);
    if (this.state === STATE_CLOSED) {
		// See https://github.com/theturtle32/WebSocket-Node/issues/288
        this._debug('  --- Socket \'error\' after \'close\'');
        return;
    }
    this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
    this.closeDescription = 'Socket Error: ' + error.syscall + ' ' + error.code;
    this.connected = false;
    this.state = STATE_CLOSED;
    this.fragmentationSize = 0;
    if (utils.eventEmitterListenerCount(this, 'error') > 0) {
        this.emit('error', error);
    }
    this.socket.destroy();
    this._debug.printOutput();
};

WebSocketConnection.prototype.handleSocketEnd = function() {
    this._debug('handleSocketEnd: received socket end.  state = %s', this.state);
    this.receivedEnd = true;
    if (this.state === STATE_CLOSED) {
        // When using the TLS module, sometimes the socket will emit 'end'
        // after it emits 'close'.  I don't think that's correct behavior,
        // but we should deal with it gracefully by ignoring it.
        this._debug('  --- Socket \'end\' after \'close\'');
        return;
    }
    if (this.state !== STATE_PEER_REQUESTED_CLOSE &&
        this.state !== STATE_ENDING) {
      this._debug('  --- UNEXPECTED socket end.');
      this.socket.end();
    }
};

WebSocketConnection.prototype.handleSocketClose = function(hadError) {
    this._debug('handleSocketClose: received socket close');
    this.socketHadError = hadError;
    this.connected = false;
    this.state = STATE_CLOSED;
    // If closeReasonCode is still set to -1 at this point then we must
    // not have received a close frame!!
    if (this.closeReasonCode === -1) {
        this.closeReasonCode = WebSocketConnection.CLOSE_REASON_ABNORMAL;
        this.closeDescription = 'Connection dropped by remote peer.';
    }
    this.clearCloseTimer();
    this.clearKeepaliveTimer();
    this.clearGracePeriodTimer();
    if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug('-- Emitting WebSocketConnection close event');
        this.emit('close', this.closeReasonCode, this.closeDescription);
    }
};

WebSocketConnection.prototype.handleSocketDrain = function() {
    this._debug('handleSocketDrain: socket drain event');
    this.outputBufferFull = false;
    this.emit('drain');
};

WebSocketConnection.prototype.handleSocketPause = function() {
    this._debug('handleSocketPause: socket pause event');
    this.inputPaused = true;
    this.emit('pause');
};

WebSocketConnection.prototype.handleSocketResume = function() {
    this._debug('handleSocketResume: socket resume event');
    this.inputPaused = false;
    this.emit('resume');
    this.processReceivedData();
};

WebSocketConnection.prototype.pause = function() {
    this._debug('pause: pause requested');
    this.socket.pause();
};

WebSocketConnection.prototype.resume = function() {
    this._debug('resume: resume requested');
    this.socket.resume();
};

WebSocketConnection.prototype.close = function(reasonCode, description) {
    if (this.connected) {
        this._debug('close: Initating clean WebSocket close sequence.');
        if ('number' !== typeof reasonCode) {
            reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
        }
        if (!validateCloseReason(reasonCode)) {
            throw new Error('Close code ' + reasonCode + ' is not valid.');
        }
        if ('string' !== typeof description) {
            description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
        }
        this.closeReasonCode = reasonCode;
        this.closeDescription = description;
        this.setCloseTimer();
        this.sendCloseFrame(this.closeReasonCode, this.closeDescription);
        this.state = STATE_ENDING;
        this.connected = false;
    }
};

WebSocketConnection.prototype.drop = function(reasonCode, description, skipCloseFrame) {
    this._debug('drop');
    if (typeof(reasonCode) !== 'number') {
        reasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
    }

    if (typeof(description) !== 'string') {
        // If no description is provided, try to look one up based on the
        // specified reasonCode.
        description = WebSocketConnection.CLOSE_DESCRIPTIONS[reasonCode];
    }

    this._debug('Forcefully dropping connection. skipCloseFrame: %s, code: %d, description: %s',
        skipCloseFrame, reasonCode, description
    );

    this.closeReasonCode = reasonCode;
    this.closeDescription = description;
    this.frameQueue = [];
    this.fragmentationSize = 0;
    if (!skipCloseFrame) {
        this.sendCloseFrame(reasonCode, description);
    }
    this.connected = false;
    this.state = STATE_CLOSED;
    this.clearCloseTimer();
    this.clearKeepaliveTimer();
    this.clearGracePeriodTimer();

    if (!this.closeEventEmitted) {
        this.closeEventEmitted = true;
        this._debug('Emitting WebSocketConnection close event');
        this.emit('close', this.closeReasonCode, this.closeDescription);
    }
    
    this._debug('Drop: destroying socket');
    this.socket.destroy();
};

WebSocketConnection.prototype.setCloseTimer = function() {
    this._debug('setCloseTimer');
    this.clearCloseTimer();
    this._debug('Setting close timer');
    this.waitingForCloseResponse = true;
    this.closeTimer = setTimeout(this._closeTimerHandler, this.closeTimeout);
};

WebSocketConnection.prototype.clearCloseTimer = function() {
    this._debug('clearCloseTimer');
    if (this.closeTimer) {
        this._debug('Clearing close timer');
        clearTimeout(this.closeTimer);
        this.waitingForCloseResponse = false;
        this.closeTimer = null;
    }
};

WebSocketConnection.prototype.handleCloseTimer = function() {
    this._debug('handleCloseTimer');
    this.closeTimer = null;
    if (this.waitingForCloseResponse) {
        this._debug('Close response not received from client.  Forcing socket end.');
        this.waitingForCloseResponse = false;
        this.state = STATE_CLOSED;
        this.socket.end();
    }
};

WebSocketConnection.prototype.processFrame = function(frame) {
    this._debug('processFrame');
    this._debug(' -- frame: %s', frame);
    
    // Any non-control opcode besides 0x00 (continuation) received in the
    // middle of a fragmented message is illegal.
    if (this.frameQueue.length !== 0 && (frame.opcode > 0x00 && frame.opcode < 0x08)) {
        this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
          'Illegal frame opcode 0x' + frame.opcode.toString(16) + ' ' +
          'received in middle of fragmented message.');
        return;
    }

    switch(frame.opcode) {
        case 0x02: // WebSocketFrame.BINARY_FRAME
            this._debug('-- Binary Frame');
            if (this.assembleFragments) {
                if (frame.fin) {
                    // Complete single-frame message received
                    this._debug('---- Emitting \'message\' event');
                    this.emit('message', {
                        type: 'binary',
                        binaryData: frame.binaryPayload
                    });
                }
                else {
                    // beginning of a fragmented message
                    this.frameQueue.push(frame);
                    this.fragmentationSize = frame.length;
                }
            }
            break;
        case 0x01: // WebSocketFrame.TEXT_FRAME
            this._debug('-- Text Frame');
            if (this.assembleFragments) {
                if (frame.fin) {
                    if (!isValidUTF8(frame.binaryPayload)) {
                        this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                          'Invalid UTF-8 Data Received');
                        return;
                    }
                    // Complete single-frame message received
                    this._debug('---- Emitting \'message\' event');
                    this.emit('message', {
                        type: 'utf8',
                        utf8Data: frame.binaryPayload.toString('utf8')
                    });
                }
                else {
                    // beginning of a fragmented message
                    this.frameQueue.push(frame);
                    this.fragmentationSize = frame.length;
                }
            }
            break;
        case 0x00: // WebSocketFrame.CONTINUATION
            this._debug('-- Continuation Frame');
            if (this.assembleFragments) {
                if (this.frameQueue.length === 0) {
                    this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
                      'Unexpected Continuation Frame');
                    return;
                }

                this.fragmentationSize += frame.length;

                if (this.fragmentationSize > this.maxReceivedMessageSize) {
                    this.drop(WebSocketConnection.CLOSE_REASON_MESSAGE_TOO_BIG,
                      'Maximum message size exceeded.');
                    return;
                }

                this.frameQueue.push(frame);

                if (frame.fin) {
                    // end of fragmented message, so we process the whole
                    // message now.  We also have to decode the utf-8 data
                    // for text frames after combining all the fragments.
                    var bytesCopied = 0;
                    var binaryPayload = bufferAllocUnsafe(this.fragmentationSize);
                    var opcode = this.frameQueue[0].opcode;
                    this.frameQueue.forEach(function (currentFrame) {
                        currentFrame.binaryPayload.copy(binaryPayload, bytesCopied);
                        bytesCopied += currentFrame.binaryPayload.length;
                    });
                    this.frameQueue = [];
                    this.fragmentationSize = 0;

                    switch (opcode) {
                        case 0x02: // WebSocketOpcode.BINARY_FRAME
                            this.emit('message', {
                                type: 'binary',
                                binaryData: binaryPayload
                            });
                            break;
                        case 0x01: // WebSocketOpcode.TEXT_FRAME
                            if (!isValidUTF8(binaryPayload)) {
                                this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                                  'Invalid UTF-8 Data Received');
                                return;
                            }
                            this.emit('message', {
                                type: 'utf8',
                                utf8Data: binaryPayload.toString('utf8')
                            });
                            break;
                        default:
                            this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
                              'Unexpected first opcode in fragmentation sequence: 0x' + opcode.toString(16));
                            return;
                    }
                }
            }
            break;
        case 0x09: // WebSocketFrame.PING
            this._debug('-- Ping Frame');

            if (this._pingListenerCount > 0) {
                // logic to emit the ping frame: this is only done when a listener is known to exist
                // Expose a function allowing the user to override the default ping() behavior
                var cancelled = false;
                var cancel = function() { 
                  cancelled = true; 
                };
                this.emit('ping', cancel, frame.binaryPayload);

                // Only send a pong if the client did not indicate that he would like to cancel
                if (!cancelled) {
                    this.pong(frame.binaryPayload);
                }
            }
            else {
                this.pong(frame.binaryPayload);
            }

            break;
        case 0x0A: // WebSocketFrame.PONG
            this._debug('-- Pong Frame');
            this.emit('pong', frame.binaryPayload);
            break;
        case 0x08: // WebSocketFrame.CONNECTION_CLOSE
            this._debug('-- Close Frame');
            if (this.waitingForCloseResponse) {
                // Got response to our request to close the connection.
                // Close is complete, so we just hang up.
                this._debug('---- Got close response from peer.  Completing closing handshake.');
                this.clearCloseTimer();
                this.waitingForCloseResponse = false;
                this.state = STATE_CLOSED;
                this.socket.end();
                return;
            }
            
            this._debug('---- Closing handshake initiated by peer.');
            // Got request from other party to close connection.
            // Send back acknowledgement and then hang up.
            this.state = STATE_PEER_REQUESTED_CLOSE;
            var respondCloseReasonCode;

            // Make sure the close reason provided is legal according to
            // the protocol spec.  Providing no close status is legal.
            // WebSocketFrame sets closeStatus to -1 by default, so if it
            // is still -1, then no status was provided.
            if (frame.invalidCloseFrameLength) {
                this.closeReasonCode = 1005; // 1005 = No reason provided.
                respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
            }
            else if (frame.closeStatus === -1 || validateCloseReason(frame.closeStatus)) {
                this.closeReasonCode = frame.closeStatus;
                respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
            }
            else {
                this.closeReasonCode = frame.closeStatus;
                respondCloseReasonCode = WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR;
            }
            
            // If there is a textual description in the close frame, extract it.
            if (frame.binaryPayload.length > 1) {
                if (!isValidUTF8(frame.binaryPayload)) {
                    this.drop(WebSocketConnection.CLOSE_REASON_INVALID_DATA,
                      'Invalid UTF-8 Data Received');
                    return;
                }
                this.closeDescription = frame.binaryPayload.toString('utf8');
            }
            else {
                this.closeDescription = WebSocketConnection.CLOSE_DESCRIPTIONS[this.closeReasonCode];
            }
            this._debug(
                '------ Remote peer %s - code: %d - %s - close frame payload length: %d',
                this.remoteAddress, this.closeReasonCode,
                this.closeDescription, frame.length
            );
            this._debug('------ responding to remote peer\'s close request.');
            this.sendCloseFrame(respondCloseReasonCode, null);
            this.connected = false;
            break;
        default:
            this._debug('-- Unrecognized Opcode %d', frame.opcode);
            this.drop(WebSocketConnection.CLOSE_REASON_PROTOCOL_ERROR,
              'Unrecognized Opcode: 0x' + frame.opcode.toString(16));
            break;
    }
};

WebSocketConnection.prototype.send = function(data, cb) {
    this._debug('send');
    if (Buffer.isBuffer(data)) {
        this.sendBytes(data, cb);
    }
    else if (typeof(data['toString']) === 'function') {
        this.sendUTF(data, cb);
    }
    else {
        throw new Error('Data provided must either be a Node Buffer or implement toString()');
    }
};

WebSocketConnection.prototype.sendUTF = function(data, cb) {
    data = bufferFromString(data.toString(), 'utf8');
    this._debug('sendUTF: %d bytes', data.length);
    var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    frame.opcode = 0x01; // WebSocketOpcode.TEXT_FRAME
    frame.binaryPayload = data;
    this.fragmentAndSend(frame, cb);
};

WebSocketConnection.prototype.sendBytes = function(data, cb) {
    this._debug('sendBytes');
    if (!Buffer.isBuffer(data)) {
        throw new Error('You must pass a Node Buffer object to WebSocketConnection.prototype.sendBytes()');
    }
    var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    frame.opcode = 0x02; // WebSocketOpcode.BINARY_FRAME
    frame.binaryPayload = data;
    this.fragmentAndSend(frame, cb);
};

WebSocketConnection.prototype.ping = function(data) {
    this._debug('ping');
    var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    frame.opcode = 0x09; // WebSocketOpcode.PING
    frame.fin = true;
    if (data) {
        if (!Buffer.isBuffer(data)) {
            data = bufferFromString(data.toString(), 'utf8');
        }
        if (data.length > 125) {
            this._debug('WebSocket: Data for ping is longer than 125 bytes.  Truncating.');
            data = data.slice(0,124);
        }
        frame.binaryPayload = data;
    }
    this.sendFrame(frame);
};

// Pong frames have to echo back the contents of the data portion of the
// ping frame exactly, byte for byte.
WebSocketConnection.prototype.pong = function(binaryPayload) {
    this._debug('pong');
    var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    frame.opcode = 0x0A; // WebSocketOpcode.PONG
    if (Buffer.isBuffer(binaryPayload) && binaryPayload.length > 125) {
        this._debug('WebSocket: Data for pong is longer than 125 bytes.  Truncating.');
        binaryPayload = binaryPayload.slice(0,124);
    }
    frame.binaryPayload = binaryPayload;
    frame.fin = true;
    this.sendFrame(frame);
};

WebSocketConnection.prototype.fragmentAndSend = function(frame, cb) {
    this._debug('fragmentAndSend');
    if (frame.opcode > 0x07) {
        throw new Error('You cannot fragment control frames.');
    }

    var threshold = this.config.fragmentationThreshold;
    var length = frame.binaryPayload.length;

    // Send immediately if fragmentation is disabled or the message is not
    // larger than the fragmentation threshold.
    if (!this.config.fragmentOutgoingMessages || (frame.binaryPayload && length <= threshold)) {
        frame.fin = true;
        this.sendFrame(frame, cb);
        return;
    }
    
    var numFragments = Math.ceil(length / threshold);
    var sentFragments = 0;
    var sentCallback = function fragmentSentCallback(err) {
        if (err) {
            if (typeof cb === 'function') {
                // pass only the first error
                cb(err);
                cb = null;
            }
            return;
        }
        ++sentFragments;
        if ((sentFragments === numFragments) && (typeof cb === 'function')) {
            cb();
        }
    };
    for (var i=1; i <= numFragments; i++) {
        var currentFrame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
        
        // continuation opcode except for first frame.
        currentFrame.opcode = (i === 1) ? frame.opcode : 0x00;
        
        // fin set on last frame only
        currentFrame.fin = (i === numFragments);
        
        // length is likely to be shorter on the last fragment
        var currentLength = (i === numFragments) ? length - (threshold * (i-1)) : threshold;
        var sliceStart = threshold * (i-1);
        
        // Slice the right portion of the original payload
        currentFrame.binaryPayload = frame.binaryPayload.slice(sliceStart, sliceStart + currentLength);
        
        this.sendFrame(currentFrame, sentCallback);
    }
};

WebSocketConnection.prototype.sendCloseFrame = function(reasonCode, description, cb) {
    if (typeof(reasonCode) !== 'number') {
        reasonCode = WebSocketConnection.CLOSE_REASON_NORMAL;
    }
    
    this._debug('sendCloseFrame state: %s, reasonCode: %d, description: %s', this.state, reasonCode, description);
    
    if (this.state !== STATE_OPEN && this.state !== STATE_PEER_REQUESTED_CLOSE) { return; }
    
    var frame = new WebSocketFrame(this.maskBytes, this.frameHeader, this.config);
    frame.fin = true;
    frame.opcode = 0x08; // WebSocketOpcode.CONNECTION_CLOSE
    frame.closeStatus = reasonCode;
    if (typeof(description) === 'string') {
        frame.binaryPayload = bufferFromString(description, 'utf8');
    }
    
    this.sendFrame(frame, cb);
    this.socket.end();
};

WebSocketConnection.prototype.sendFrame = function(frame, cb) {
    this._debug('sendFrame');
    frame.mask = this.maskOutgoingPackets;
    var flushed = this.socket.write(frame.toBuffer(), cb);
    this.outputBufferFull = !flushed;
    return flushed;
};

module.exports = WebSocketConnection;



function instrumentSocketForDebugging(connection, socket) {
    /* jshint loopfunc: true */
    if (!connection._debug.enabled) { return; }
    
    var originalSocketEmit = socket.emit;
    socket.emit = function(event) {
        connection._debug('||| Socket Event  \'%s\'', event);
        originalSocketEmit.apply(this, arguments);
    };
    
    for (var key in socket) {
        if ('function' !== typeof(socket[key])) { continue; }
        if (['emit'].indexOf(key) !== -1) { continue; }
        (function(key) {
            var original = socket[key];
            if (key === 'on') {
                socket[key] = function proxyMethod__EventEmitter__On() {
                    connection._debug('||| Socket method called:  %s (%s)', key, arguments[0]);
                    return original.apply(this, arguments);
                };
                return;
            }
            socket[key] = function proxyMethod() {
                connection._debug('||| Socket method called:  %s', key);
                return original.apply(this, arguments);
            };
        })(key);
    }
}


/***/ }),

/***/ 2535:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var bufferUtil = __nccwpck_require__(3352);
var bufferAllocUnsafe = (__nccwpck_require__(4407).bufferAllocUnsafe);

const DECODE_HEADER = 1;
const WAITING_FOR_16_BIT_LENGTH = 2;
const WAITING_FOR_64_BIT_LENGTH = 3;
const WAITING_FOR_MASK_KEY = 4;
const WAITING_FOR_PAYLOAD = 5;
const COMPLETE = 6;

// WebSocketConnection will pass shared buffer objects for maskBytes and
// frameHeader into the constructor to avoid tons of small memory allocations
// for each frame we have to parse.  This is only used for parsing frames
// we receive off the wire.
function WebSocketFrame(maskBytes, frameHeader, config) {
    this.maskBytes = maskBytes;
    this.frameHeader = frameHeader;
    this.config = config;
    this.maxReceivedFrameSize = config.maxReceivedFrameSize;
    this.protocolError = false;
    this.frameTooLarge = false;
    this.invalidCloseFrameLength = false;
    this.parseState = DECODE_HEADER;
    this.closeStatus = -1;
}

WebSocketFrame.prototype.addData = function(bufferList) {
    if (this.parseState === DECODE_HEADER) {
        if (bufferList.length >= 2) {
            bufferList.joinInto(this.frameHeader, 0, 0, 2);
            bufferList.advance(2);
            var firstByte = this.frameHeader[0];
            var secondByte = this.frameHeader[1];

            this.fin     = Boolean(firstByte  & 0x80);
            this.rsv1    = Boolean(firstByte  & 0x40);
            this.rsv2    = Boolean(firstByte  & 0x20);
            this.rsv3    = Boolean(firstByte  & 0x10);
            this.mask    = Boolean(secondByte & 0x80);

            this.opcode  = firstByte  & 0x0F;
            this.length = secondByte & 0x7F;

            // Control frame sanity check
            if (this.opcode >= 0x08) {
                if (this.length > 125) {
                    this.protocolError = true;
                    this.dropReason = 'Illegal control frame longer than 125 bytes.';
                    return true;
                }
                if (!this.fin) {
                    this.protocolError = true;
                    this.dropReason = 'Control frames must not be fragmented.';
                    return true;
                }
            }

            if (this.length === 126) {
                this.parseState = WAITING_FOR_16_BIT_LENGTH;
            }
            else if (this.length === 127) {
                this.parseState = WAITING_FOR_64_BIT_LENGTH;
            }
            else {
                this.parseState = WAITING_FOR_MASK_KEY;
            }
        }
    }
    if (this.parseState === WAITING_FOR_16_BIT_LENGTH) {
        if (bufferList.length >= 2) {
            bufferList.joinInto(this.frameHeader, 2, 0, 2);
            bufferList.advance(2);
            this.length = this.frameHeader.readUInt16BE(2);
            this.parseState = WAITING_FOR_MASK_KEY;
        }
    }
    else if (this.parseState === WAITING_FOR_64_BIT_LENGTH) {
        if (bufferList.length >= 8) {
            bufferList.joinInto(this.frameHeader, 2, 0, 8);
            bufferList.advance(8);
            var lengthPair = [
              this.frameHeader.readUInt32BE(2),
              this.frameHeader.readUInt32BE(2+4)
            ];

            if (lengthPair[0] !== 0) {
                this.protocolError = true;
                this.dropReason = 'Unsupported 64-bit length frame received';
                return true;
            }
            this.length = lengthPair[1];
            this.parseState = WAITING_FOR_MASK_KEY;
        }
    }

    if (this.parseState === WAITING_FOR_MASK_KEY) {
        if (this.mask) {
            if (bufferList.length >= 4) {
                bufferList.joinInto(this.maskBytes, 0, 0, 4);
                bufferList.advance(4);
                this.parseState = WAITING_FOR_PAYLOAD;
            }
        }
        else {
            this.parseState = WAITING_FOR_PAYLOAD;
        }
    }

    if (this.parseState === WAITING_FOR_PAYLOAD) {
        if (this.length > this.maxReceivedFrameSize) {
            this.frameTooLarge = true;
            this.dropReason = 'Frame size of ' + this.length.toString(10) +
                              ' bytes exceeds maximum accepted frame size';
            return true;
        }

        if (this.length === 0) {
            this.binaryPayload = bufferAllocUnsafe(0);
            this.parseState = COMPLETE;
            return true;
        }
        if (bufferList.length >= this.length) {
            this.binaryPayload = bufferList.take(this.length);
            bufferList.advance(this.length);
            if (this.mask) {
                bufferUtil.unmask(this.binaryPayload, this.maskBytes);
                // xor(this.binaryPayload, this.maskBytes, 0);
            }

            if (this.opcode === 0x08) { // WebSocketOpcode.CONNECTION_CLOSE
                if (this.length === 1) {
                    // Invalid length for a close frame.  Must be zero or at least two.
                    this.binaryPayload = bufferAllocUnsafe(0);
                    this.invalidCloseFrameLength = true;
                }
                if (this.length >= 2) {
                    this.closeStatus = this.binaryPayload.readUInt16BE(0);
                    this.binaryPayload = this.binaryPayload.slice(2);
                }
            }

            this.parseState = COMPLETE;
            return true;
        }
    }
    return false;
};

WebSocketFrame.prototype.throwAwayPayload = function(bufferList) {
    if (bufferList.length >= this.length) {
        bufferList.advance(this.length);
        this.parseState = COMPLETE;
        return true;
    }
    return false;
};

WebSocketFrame.prototype.toBuffer = function(nullMask) {
    var maskKey;
    var headerLength = 2;
    var data;
    var outputPos;
    var firstByte = 0x00;
    var secondByte = 0x00;

    if (this.fin) {
        firstByte |= 0x80;
    }
    if (this.rsv1) {
        firstByte |= 0x40;
    }
    if (this.rsv2) {
        firstByte |= 0x20;
    }
    if (this.rsv3) {
        firstByte |= 0x10;
    }
    if (this.mask) {
        secondByte |= 0x80;
    }

    firstByte |= (this.opcode & 0x0F);

    // the close frame is a special case because the close reason is
    // prepended to the payload data.
    if (this.opcode === 0x08) {
        this.length = 2;
        if (this.binaryPayload) {
            this.length += this.binaryPayload.length;
        }
        data = bufferAllocUnsafe(this.length);
        data.writeUInt16BE(this.closeStatus, 0);
        if (this.length > 2) {
            this.binaryPayload.copy(data, 2);
        }
    }
    else if (this.binaryPayload) {
        data = this.binaryPayload;
        this.length = data.length;
    }
    else {
        this.length = 0;
    }

    if (this.length <= 125) {
        // encode the length directly into the two-byte frame header
        secondByte |= (this.length & 0x7F);
    }
    else if (this.length > 125 && this.length <= 0xFFFF) {
        // Use 16-bit length
        secondByte |= 126;
        headerLength += 2;
    }
    else if (this.length > 0xFFFF) {
        // Use 64-bit length
        secondByte |= 127;
        headerLength += 8;
    }

    var output = bufferAllocUnsafe(this.length + headerLength + (this.mask ? 4 : 0));

    // write the frame header
    output[0] = firstByte;
    output[1] = secondByte;

    outputPos = 2;

    if (this.length > 125 && this.length <= 0xFFFF) {
        // write 16-bit length
        output.writeUInt16BE(this.length, outputPos);
        outputPos += 2;
    }
    else if (this.length > 0xFFFF) {
        // write 64-bit length
        output.writeUInt32BE(0x00000000, outputPos);
        output.writeUInt32BE(this.length, outputPos + 4);
        outputPos += 8;
    }

    if (this.mask) {
        maskKey = nullMask ? 0 : ((Math.random() * 0xFFFFFFFF) >>> 0);
        this.maskBytes.writeUInt32BE(maskKey, 0);

        // write the mask key
        this.maskBytes.copy(output, outputPos);
        outputPos += 4;

        if (data) {
          bufferUtil.mask(data, this.maskBytes, output, outputPos, this.length);
        }
    }
    else if (data) {
        data.copy(output, outputPos);
    }

    return output;
};

WebSocketFrame.prototype.toString = function() {
    return 'Opcode: ' + this.opcode + ', fin: ' + this.fin + ', length: ' + this.length + ', hasPayload: ' + Boolean(this.binaryPayload) + ', masked: ' + this.mask;
};


module.exports = WebSocketFrame;


/***/ }),

/***/ 1264:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var crypto = __nccwpck_require__(6113);
var util = __nccwpck_require__(3837);
var url = __nccwpck_require__(7310);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var WebSocketConnection = __nccwpck_require__(7745);

var headerValueSplitRegExp = /,\s*/;
var headerParamSplitRegExp = /;\s*/;
var headerSanitizeRegExp = /[\r\n]/g;
var xForwardedForSeparatorRegExp = /,\s*/;
var separators = [
    '(', ')', '<', '>', '@',
    ',', ';', ':', '\\', '\"',
    '/', '[', ']', '?', '=',
    '{', '}', ' ', String.fromCharCode(9)
];
var controlChars = [String.fromCharCode(127) /* DEL */];
for (var i=0; i < 31; i ++) {
    /* US-ASCII Control Characters */
    controlChars.push(String.fromCharCode(i));
}

var cookieNameValidateRegEx = /([\x00-\x20\x22\x28\x29\x2c\x2f\x3a-\x3f\x40\x5b-\x5e\x7b\x7d\x7f])/;
var cookieValueValidateRegEx = /[^\x21\x23-\x2b\x2d-\x3a\x3c-\x5b\x5d-\x7e]/;
var cookieValueDQuoteValidateRegEx = /^"[^"]*"$/;
var controlCharsAndSemicolonRegEx = /[\x00-\x20\x3b]/g;

var cookieSeparatorRegEx = /[;,] */;

var httpStatusDescriptions = {
    100: 'Continue',
    101: 'Switching Protocols',
    200: 'OK',
    201: 'Created',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    406: 'Not Acceptable',
    407: 'Proxy Authorization Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Long',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    426: 'Upgrade Required',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported'
};

function WebSocketRequest(socket, httpRequest, serverConfig) {
    // Superclass Constructor
    EventEmitter.call(this);

    this.socket = socket;
    this.httpRequest = httpRequest;
    this.resource = httpRequest.url;
    this.remoteAddress = socket.remoteAddress;
    this.remoteAddresses = [this.remoteAddress];
    this.serverConfig = serverConfig;

    // Watch for the underlying TCP socket closing before we call accept
    this._socketIsClosing = false;
    this._socketCloseHandler = this._handleSocketCloseBeforeAccept.bind(this);
    this.socket.on('end', this._socketCloseHandler);
    this.socket.on('close', this._socketCloseHandler);

    this._resolved = false;
}

util.inherits(WebSocketRequest, EventEmitter);

WebSocketRequest.prototype.readHandshake = function() {
    var self = this;
    var request = this.httpRequest;

    // Decode URL
    this.resourceURL = url.parse(this.resource, true);

    this.host = request.headers['host'];
    if (!this.host) {
        throw new Error('Client must provide a Host header.');
    }

    this.key = request.headers['sec-websocket-key'];
    if (!this.key) {
        throw new Error('Client must provide a value for Sec-WebSocket-Key.');
    }

    this.webSocketVersion = parseInt(request.headers['sec-websocket-version'], 10);

    if (!this.webSocketVersion || isNaN(this.webSocketVersion)) {
        throw new Error('Client must provide a value for Sec-WebSocket-Version.');
    }

    switch (this.webSocketVersion) {
        case 8:
        case 13:
            break;
        default:
            var e = new Error('Unsupported websocket client version: ' + this.webSocketVersion +
                              'Only versions 8 and 13 are supported.');
            e.httpCode = 426;
            e.headers = {
                'Sec-WebSocket-Version': '13'
            };
            throw e;
    }

    if (this.webSocketVersion === 13) {
        this.origin = request.headers['origin'];
    }
    else if (this.webSocketVersion === 8) {
        this.origin = request.headers['sec-websocket-origin'];
    }

    // Protocol is optional.
    var protocolString = request.headers['sec-websocket-protocol'];
    this.protocolFullCaseMap = {};
    this.requestedProtocols = [];
    if (protocolString) {
        var requestedProtocolsFullCase = protocolString.split(headerValueSplitRegExp);
        requestedProtocolsFullCase.forEach(function(protocol) {
            var lcProtocol = protocol.toLocaleLowerCase();
            self.requestedProtocols.push(lcProtocol);
            self.protocolFullCaseMap[lcProtocol] = protocol;
        });
    }

    if (!this.serverConfig.ignoreXForwardedFor &&
        request.headers['x-forwarded-for']) {
        var immediatePeerIP = this.remoteAddress;
        this.remoteAddresses = request.headers['x-forwarded-for']
            .split(xForwardedForSeparatorRegExp);
        this.remoteAddresses.push(immediatePeerIP);
        this.remoteAddress = this.remoteAddresses[0];
    }

    // Extensions are optional.
    if (this.serverConfig.parseExtensions) {
        var extensionsString = request.headers['sec-websocket-extensions'];
        this.requestedExtensions = this.parseExtensions(extensionsString);
    } else {
        this.requestedExtensions = [];
    }

    // Cookies are optional
    if (this.serverConfig.parseCookies) {
        var cookieString = request.headers['cookie'];
        this.cookies = this.parseCookies(cookieString);
    } else {
        this.cookies = [];
    }
};

WebSocketRequest.prototype.parseExtensions = function(extensionsString) {
    if (!extensionsString || extensionsString.length === 0) {
        return [];
    }
    var extensions = extensionsString.toLocaleLowerCase().split(headerValueSplitRegExp);
    extensions.forEach(function(extension, index, array) {
        var params = extension.split(headerParamSplitRegExp);
        var extensionName = params[0];
        var extensionParams = params.slice(1);
        extensionParams.forEach(function(rawParam, index, array) {
            var arr = rawParam.split('=');
            var obj = {
                name: arr[0],
                value: arr[1]
            };
            array.splice(index, 1, obj);
        });
        var obj = {
            name: extensionName,
            params: extensionParams
        };
        array.splice(index, 1, obj);
    });
    return extensions;
};

// This function adapted from node-cookie
// https://github.com/shtylman/node-cookie
WebSocketRequest.prototype.parseCookies = function(str) {
    // Sanity Check
    if (!str || typeof(str) !== 'string') {
        return [];
    }

    var cookies = [];
    var pairs = str.split(cookieSeparatorRegEx);

    pairs.forEach(function(pair) {
        var eq_idx = pair.indexOf('=');
        if (eq_idx === -1) {
            cookies.push({
                name: pair,
                value: null
            });
            return;
        }

        var key = pair.substr(0, eq_idx).trim();
        var val = pair.substr(++eq_idx, pair.length).trim();

        // quoted values
        if ('"' === val[0]) {
            val = val.slice(1, -1);
        }

        cookies.push({
            name: key,
            value: decodeURIComponent(val)
        });
    });

    return cookies;
};

WebSocketRequest.prototype.accept = function(acceptedProtocol, allowedOrigin, cookies) {
    this._verifyResolution();

    // TODO: Handle extensions

    var protocolFullCase;

    if (acceptedProtocol) {
        protocolFullCase = this.protocolFullCaseMap[acceptedProtocol.toLocaleLowerCase()];
        if (typeof(protocolFullCase) === 'undefined') {
            protocolFullCase = acceptedProtocol;
        }
    }
    else {
        protocolFullCase = acceptedProtocol;
    }
    this.protocolFullCaseMap = null;

    // Create key validation hash
    var sha1 = crypto.createHash('sha1');
    sha1.update(this.key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11');
    var acceptKey = sha1.digest('base64');

    var response = 'HTTP/1.1 101 Switching Protocols\r\n' +
                   'Upgrade: websocket\r\n' +
                   'Connection: Upgrade\r\n' +
                   'Sec-WebSocket-Accept: ' + acceptKey + '\r\n';

    if (protocolFullCase) {
        // validate protocol
        for (var i=0; i < protocolFullCase.length; i++) {
            var charCode = protocolFullCase.charCodeAt(i);
            var character = protocolFullCase.charAt(i);
            if (charCode < 0x21 || charCode > 0x7E || separators.indexOf(character) !== -1) {
                this.reject(500);
                throw new Error('Illegal character "' + String.fromCharCode(character) + '" in subprotocol.');
            }
        }
        if (this.requestedProtocols.indexOf(acceptedProtocol) === -1) {
            this.reject(500);
            throw new Error('Specified protocol was not requested by the client.');
        }

        protocolFullCase = protocolFullCase.replace(headerSanitizeRegExp, '');
        response += 'Sec-WebSocket-Protocol: ' + protocolFullCase + '\r\n';
    }
    this.requestedProtocols = null;

    if (allowedOrigin) {
        allowedOrigin = allowedOrigin.replace(headerSanitizeRegExp, '');
        if (this.webSocketVersion === 13) {
            response += 'Origin: ' + allowedOrigin + '\r\n';
        }
        else if (this.webSocketVersion === 8) {
            response += 'Sec-WebSocket-Origin: ' + allowedOrigin + '\r\n';
        }
    }

    if (cookies) {
        if (!Array.isArray(cookies)) {
            this.reject(500);
            throw new Error('Value supplied for "cookies" argument must be an array.');
        }
        var seenCookies = {};
        cookies.forEach(function(cookie) {
            if (!cookie.name || !cookie.value) {
                this.reject(500);
                throw new Error('Each cookie to set must at least provide a "name" and "value"');
            }

            // Make sure there are no \r\n sequences inserted
            cookie.name = cookie.name.replace(controlCharsAndSemicolonRegEx, '');
            cookie.value = cookie.value.replace(controlCharsAndSemicolonRegEx, '');

            if (seenCookies[cookie.name]) {
                this.reject(500);
                throw new Error('You may not specify the same cookie name twice.');
            }
            seenCookies[cookie.name] = true;

            // token (RFC 2616, Section 2.2)
            var invalidChar = cookie.name.match(cookieNameValidateRegEx);
            if (invalidChar) {
                this.reject(500);
                throw new Error('Illegal character ' + invalidChar[0] + ' in cookie name');
            }

            // RFC 6265, Section 4.1.1
            // *cookie-octet / ( DQUOTE *cookie-octet DQUOTE ) | %x21 / %x23-2B / %x2D-3A / %x3C-5B / %x5D-7E
            if (cookie.value.match(cookieValueDQuoteValidateRegEx)) {
                invalidChar = cookie.value.slice(1, -1).match(cookieValueValidateRegEx);
            } else {
                invalidChar = cookie.value.match(cookieValueValidateRegEx);
            }
            if (invalidChar) {
                this.reject(500);
                throw new Error('Illegal character ' + invalidChar[0] + ' in cookie value');
            }

            var cookieParts = [cookie.name + '=' + cookie.value];

            // RFC 6265, Section 4.1.1
            // 'Path=' path-value | <any CHAR except CTLs or ';'>
            if(cookie.path){
                invalidChar = cookie.path.match(controlCharsAndSemicolonRegEx);
                if (invalidChar) {
                    this.reject(500);
                    throw new Error('Illegal character ' + invalidChar[0] + ' in cookie path');
                }
                cookieParts.push('Path=' + cookie.path);
            }

            // RFC 6265, Section 4.1.2.3
            // 'Domain=' subdomain
            if (cookie.domain) {
                if (typeof(cookie.domain) !== 'string') {
                    this.reject(500);
                    throw new Error('Domain must be specified and must be a string.');
                }
                invalidChar = cookie.domain.match(controlCharsAndSemicolonRegEx);
                if (invalidChar) {
                    this.reject(500);
                    throw new Error('Illegal character ' + invalidChar[0] + ' in cookie domain');
                }
                cookieParts.push('Domain=' + cookie.domain.toLowerCase());
            }

            // RFC 6265, Section 4.1.1
            //'Expires=' sane-cookie-date | Force Date object requirement by using only epoch
            if (cookie.expires) {
                if (!(cookie.expires instanceof Date)){
                    this.reject(500);
                    throw new Error('Value supplied for cookie "expires" must be a vaild date object');
                }
                cookieParts.push('Expires=' + cookie.expires.toGMTString());
            }

            // RFC 6265, Section 4.1.1
            //'Max-Age=' non-zero-digit *DIGIT
            if (cookie.maxage) {
                var maxage = cookie.maxage;
                if (typeof(maxage) === 'string') {
                    maxage = parseInt(maxage, 10);
                }
                if (isNaN(maxage) || maxage <= 0 ) {
                    this.reject(500);
                    throw new Error('Value supplied for cookie "maxage" must be a non-zero number');
                }
                maxage = Math.round(maxage);
                cookieParts.push('Max-Age=' + maxage.toString(10));
            }

            // RFC 6265, Section 4.1.1
            //'Secure;'
            if (cookie.secure) {
                if (typeof(cookie.secure) !== 'boolean') {
                    this.reject(500);
                    throw new Error('Value supplied for cookie "secure" must be of type boolean');
                }
                cookieParts.push('Secure');
            }

            // RFC 6265, Section 4.1.1
            //'HttpOnly;'
            if (cookie.httponly) {
                if (typeof(cookie.httponly) !== 'boolean') {
                    this.reject(500);
                    throw new Error('Value supplied for cookie "httponly" must be of type boolean');
                }
                cookieParts.push('HttpOnly');
            }

            response += ('Set-Cookie: ' + cookieParts.join(';') + '\r\n');
        }.bind(this));
    }

    // TODO: handle negotiated extensions
    // if (negotiatedExtensions) {
    //     response += 'Sec-WebSocket-Extensions: ' + negotiatedExtensions.join(', ') + '\r\n';
    // }

    // Mark the request resolved now so that the user can't call accept or
    // reject a second time.
    this._resolved = true;
    this.emit('requestResolved', this);

    response += '\r\n';

    var connection = new WebSocketConnection(this.socket, [], acceptedProtocol, false, this.serverConfig);
    connection.webSocketVersion = this.webSocketVersion;
    connection.remoteAddress = this.remoteAddress;
    connection.remoteAddresses = this.remoteAddresses;

    var self = this;

    if (this._socketIsClosing) {
        // Handle case when the client hangs up before we get a chance to
        // accept the connection and send our side of the opening handshake.
        cleanupFailedConnection(connection);
    }
    else {
        this.socket.write(response, 'ascii', function(error) {
            if (error) {
                cleanupFailedConnection(connection);
                return;
            }

            self._removeSocketCloseListeners();
            connection._addSocketEventListeners();
        });
    }

    this.emit('requestAccepted', connection);
    return connection;
};

WebSocketRequest.prototype.reject = function(status, reason, extraHeaders) {
    this._verifyResolution();

    // Mark the request resolved now so that the user can't call accept or
    // reject a second time.
    this._resolved = true;
    this.emit('requestResolved', this);

    if (typeof(status) !== 'number') {
        status = 403;
    }
    var response = 'HTTP/1.1 ' + status + ' ' + httpStatusDescriptions[status] + '\r\n' +
                   'Connection: close\r\n';
    if (reason) {
        reason = reason.replace(headerSanitizeRegExp, '');
        response += 'X-WebSocket-Reject-Reason: ' + reason + '\r\n';
    }

    if (extraHeaders) {
        for (var key in extraHeaders) {
            var sanitizedValue = extraHeaders[key].toString().replace(headerSanitizeRegExp, '');
            var sanitizedKey = key.replace(headerSanitizeRegExp, '');
            response += (sanitizedKey + ': ' + sanitizedValue + '\r\n');
        }
    }

    response += '\r\n';
    this.socket.end(response, 'ascii');

    this.emit('requestRejected', this);
};

WebSocketRequest.prototype._handleSocketCloseBeforeAccept = function() {
    this._socketIsClosing = true;
    this._removeSocketCloseListeners();
};

WebSocketRequest.prototype._removeSocketCloseListeners = function() {
    this.socket.removeListener('end', this._socketCloseHandler);
    this.socket.removeListener('close', this._socketCloseHandler);
};

WebSocketRequest.prototype._verifyResolution = function() {
    if (this._resolved) {
        throw new Error('WebSocketRequest may only be accepted or rejected one time.');
    }
};

function cleanupFailedConnection(connection) {
    // Since we have to return a connection object even if the socket is
    // already dead in order not to break the API, we schedule a 'close'
    // event on the connection object to occur immediately.
    process.nextTick(function() {
        // WebSocketConnection.CLOSE_REASON_ABNORMAL = 1006
        // Third param: Skip sending the close frame to a dead socket
        connection.drop(1006, 'TCP connection lost before handshake completed.', true);
    });
}

module.exports = WebSocketRequest;


/***/ }),

/***/ 8235:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var extend = (__nccwpck_require__(4407).extend);
var util = __nccwpck_require__(3837);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var WebSocketRouterRequest = __nccwpck_require__(950);

function WebSocketRouter(config) {
    // Superclass Constructor
    EventEmitter.call(this);

    this.config = {
        // The WebSocketServer instance to attach to.
        server: null
    };
    if (config) {
        extend(this.config, config);
    }
    this.handlers = [];

    this._requestHandler = this.handleRequest.bind(this);
    if (this.config.server) {
        this.attachServer(this.config.server);
    }
}

util.inherits(WebSocketRouter, EventEmitter);

WebSocketRouter.prototype.attachServer = function(server) {
    if (server) {
        this.server = server;
        this.server.on('request', this._requestHandler);
    }
    else {
        throw new Error('You must specify a WebSocketServer instance to attach to.');
    }
};

WebSocketRouter.prototype.detachServer = function() {
    if (this.server) {
        this.server.removeListener('request', this._requestHandler);
        this.server = null;
    }
    else {
        throw new Error('Cannot detach from server: not attached.');
    }
};

WebSocketRouter.prototype.mount = function(path, protocol, callback) {
    if (!path) {
        throw new Error('You must specify a path for this handler.');
    }
    if (!protocol) {
        protocol = '____no_protocol____';
    }
    if (!callback) {
        throw new Error('You must specify a callback for this handler.');
    }

    path = this.pathToRegExp(path);
    if (!(path instanceof RegExp)) {
        throw new Error('Path must be specified as either a string or a RegExp.');
    }
    var pathString = path.toString();

    // normalize protocol to lower-case
    protocol = protocol.toLocaleLowerCase();

    if (this.findHandlerIndex(pathString, protocol) !== -1) {
        throw new Error('You may only mount one handler per path/protocol combination.');
    }

    this.handlers.push({
        'path': path,
        'pathString': pathString,
        'protocol': protocol,
        'callback': callback
    });
};
WebSocketRouter.prototype.unmount = function(path, protocol) {
    var index = this.findHandlerIndex(this.pathToRegExp(path).toString(), protocol);
    if (index !== -1) {
        this.handlers.splice(index, 1);
    }
    else {
        throw new Error('Unable to find a route matching the specified path and protocol.');
    }
};

WebSocketRouter.prototype.findHandlerIndex = function(pathString, protocol) {
    protocol = protocol.toLocaleLowerCase();
    for (var i=0, len=this.handlers.length; i < len; i++) {
        var handler = this.handlers[i];
        if (handler.pathString === pathString && handler.protocol === protocol) {
            return i;
        }
    }
    return -1;
};

WebSocketRouter.prototype.pathToRegExp = function(path) {
    if (typeof(path) === 'string') {
        if (path === '*') {
            path = /^.*$/;
        }
        else {
            path = path.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
            path = new RegExp('^' + path + '$');
        }
    }
    return path;
};

WebSocketRouter.prototype.handleRequest = function(request) {
    var requestedProtocols = request.requestedProtocols;
    if (requestedProtocols.length === 0) {
        requestedProtocols = ['____no_protocol____'];
    }

    // Find a handler with the first requested protocol first
    for (var i=0; i < requestedProtocols.length; i++) {
        var requestedProtocol = requestedProtocols[i].toLocaleLowerCase();

        // find the first handler that can process this request
        for (var j=0, len=this.handlers.length; j < len; j++) {
            var handler = this.handlers[j];
            if (handler.path.test(request.resourceURL.pathname)) {
                if (requestedProtocol === handler.protocol ||
                    handler.protocol === '*')
                {
                    var routerRequest = new WebSocketRouterRequest(request, requestedProtocol);
                    handler.callback(routerRequest);
                    return;
                }
            }
        }
    }

    // If we get here we were unable to find a suitable handler.
    request.reject(404, 'No handler is available for the given request.');
};

module.exports = WebSocketRouter;


/***/ }),

/***/ 950:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var util = __nccwpck_require__(3837);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);

function WebSocketRouterRequest(webSocketRequest, resolvedProtocol) {
    // Superclass Constructor
    EventEmitter.call(this);

    this.webSocketRequest = webSocketRequest;
    if (resolvedProtocol === '____no_protocol____') {
        this.protocol = null;
    }
    else {
        this.protocol = resolvedProtocol;
    }
    this.origin = webSocketRequest.origin;
    this.resource = webSocketRequest.resource;
    this.resourceURL = webSocketRequest.resourceURL;
    this.httpRequest = webSocketRequest.httpRequest;
    this.remoteAddress = webSocketRequest.remoteAddress;
    this.webSocketVersion = webSocketRequest.webSocketVersion;
    this.requestedExtensions = webSocketRequest.requestedExtensions;
    this.cookies = webSocketRequest.cookies;
}

util.inherits(WebSocketRouterRequest, EventEmitter);

WebSocketRouterRequest.prototype.accept = function(origin, cookies) {
    var connection = this.webSocketRequest.accept(this.protocol, origin, cookies);
    this.emit('requestAccepted', connection);
    return connection;
};

WebSocketRouterRequest.prototype.reject = function(status, reason, extraHeaders) {
    this.webSocketRequest.reject(status, reason, extraHeaders);
    this.emit('requestRejected', this);
};

module.exports = WebSocketRouterRequest;


/***/ }),

/***/ 579:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/************************************************************************
 *  Copyright 2010-2015 Brian McKelvey.
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 ***********************************************************************/

var extend = (__nccwpck_require__(4407).extend);
var utils = __nccwpck_require__(4407);
var util = __nccwpck_require__(3837);
var debug = __nccwpck_require__(1831)('websocket:server');
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var WebSocketRequest = __nccwpck_require__(1264);

var WebSocketServer = function WebSocketServer(config) {
    // Superclass Constructor
    EventEmitter.call(this);

    this._handlers = {
        upgrade: this.handleUpgrade.bind(this),
        requestAccepted: this.handleRequestAccepted.bind(this),
        requestResolved: this.handleRequestResolved.bind(this)
    };
    this.connections = [];
    this.pendingRequests = [];
    if (config) {
        this.mount(config);
    }
};

util.inherits(WebSocketServer, EventEmitter);

WebSocketServer.prototype.mount = function(config) {
    this.config = {
        // The http server instance to attach to.  Required.
        httpServer: null,

        // 64KiB max frame size.
        maxReceivedFrameSize: 0x10000,

        // 1MiB max message size, only applicable if
        // assembleFragments is true
        maxReceivedMessageSize: 0x100000,

        // Outgoing messages larger than fragmentationThreshold will be
        // split into multiple fragments.
        fragmentOutgoingMessages: true,

        // Outgoing frames are fragmented if they exceed this threshold.
        // Default is 16KiB
        fragmentationThreshold: 0x4000,

        // If true, the server will automatically send a ping to all
        // clients every 'keepaliveInterval' milliseconds.  The timer is
        // reset on any received data from the client.
        keepalive: true,

        // The interval to send keepalive pings to connected clients if the
        // connection is idle.  Any received data will reset the counter.
        keepaliveInterval: 20000,

        // If true, the server will consider any connection that has not
        // received any data within the amount of time specified by
        // 'keepaliveGracePeriod' after a keepalive ping has been sent to
        // be dead, and will drop the connection.
        // Ignored if keepalive is false.
        dropConnectionOnKeepaliveTimeout: true,

        // The amount of time to wait after sending a keepalive ping before
        // closing the connection if the connected peer does not respond.
        // Ignored if keepalive is false.
        keepaliveGracePeriod: 10000,

        // Whether to use native TCP keep-alive instead of WebSockets ping
        // and pong packets.  Native TCP keep-alive sends smaller packets
        // on the wire and so uses bandwidth more efficiently.  This may
        // be more important when talking to mobile devices.
        // If this value is set to true, then these values will be ignored:
        //   keepaliveGracePeriod
        //   dropConnectionOnKeepaliveTimeout
        useNativeKeepalive: false,

        // If true, fragmented messages will be automatically assembled
        // and the full message will be emitted via a 'message' event.
        // If false, each frame will be emitted via a 'frame' event and
        // the application will be responsible for aggregating multiple
        // fragmented frames.  Single-frame messages will emit a 'message'
        // event in addition to the 'frame' event.
        // Most users will want to leave this set to 'true'
        assembleFragments: true,

        // If this is true, websocket connections will be accepted
        // regardless of the path and protocol specified by the client.
        // The protocol accepted will be the first that was requested
        // by the client.  Clients from any origin will be accepted.
        // This should only be used in the simplest of cases.  You should
        // probably leave this set to 'false' and inspect the request
        // object to make sure it's acceptable before accepting it.
        autoAcceptConnections: false,

        // Whether or not the X-Forwarded-For header should be respected.
        // It's important to set this to 'true' when accepting connections
        // from untrusted clients, as a malicious client could spoof its
        // IP address by simply setting this header.  It's meant to be added
        // by a trusted proxy or other intermediary within your own
        // infrastructure.
        // See:  http://en.wikipedia.org/wiki/X-Forwarded-For
        ignoreXForwardedFor: false,

        // If this is true, 'cookie' headers are parsed and exposed as WebSocketRequest.cookies
        parseCookies: true,

        // If this is true, 'sec-websocket-extensions' headers are parsed and exposed as WebSocketRequest.requestedExtensions
        parseExtensions: true,

        // The Nagle Algorithm makes more efficient use of network resources
        // by introducing a small delay before sending small packets so that
        // multiple messages can be batched together before going onto the
        // wire.  This however comes at the cost of latency, so the default
        // is to disable it.  If you don't need low latency and are streaming
        // lots of small messages, you can change this to 'false'
        disableNagleAlgorithm: true,

        // The number of milliseconds to wait after sending a close frame
        // for an acknowledgement to come back before giving up and just
        // closing the socket.
        closeTimeout: 5000
    };
    extend(this.config, config);

    if (this.config.httpServer) {
        if (!Array.isArray(this.config.httpServer)) {
            this.config.httpServer = [this.config.httpServer];
        }
        var upgradeHandler = this._handlers.upgrade;
        this.config.httpServer.forEach(function(httpServer) {
            httpServer.on('upgrade', upgradeHandler);
        });
    }
    else {
        throw new Error('You must specify an httpServer on which to mount the WebSocket server.');
    }
};

WebSocketServer.prototype.unmount = function() {
    var upgradeHandler = this._handlers.upgrade;
    this.config.httpServer.forEach(function(httpServer) {
        httpServer.removeListener('upgrade', upgradeHandler);
    });
};

WebSocketServer.prototype.closeAllConnections = function() {
    this.connections.forEach(function(connection) {
        connection.close();
    });
    this.pendingRequests.forEach(function(request) {
        process.nextTick(function() {
          request.reject(503); // HTTP 503 Service Unavailable
        });
    });
};

WebSocketServer.prototype.broadcast = function(data) {
    if (Buffer.isBuffer(data)) {
        this.broadcastBytes(data);
    }
    else if (typeof(data.toString) === 'function') {
        this.broadcastUTF(data);
    }
};

WebSocketServer.prototype.broadcastUTF = function(utfData) {
    this.connections.forEach(function(connection) {
        connection.sendUTF(utfData);
    });
};

WebSocketServer.prototype.broadcastBytes = function(binaryData) {
    this.connections.forEach(function(connection) {
        connection.sendBytes(binaryData);
    });
};

WebSocketServer.prototype.shutDown = function() {
    this.unmount();
    this.closeAllConnections();
};

WebSocketServer.prototype.handleUpgrade = function(request, socket) {
    var self = this;
    var wsRequest = new WebSocketRequest(socket, request, this.config);
    try {
        wsRequest.readHandshake();
    }
    catch(e) {
        wsRequest.reject(
            e.httpCode ? e.httpCode : 400,
            e.message,
            e.headers
        );
        debug('Invalid handshake: %s', e.message);
        this.emit('upgradeError', e);
        return;
    }

    this.pendingRequests.push(wsRequest);

    wsRequest.once('requestAccepted', this._handlers.requestAccepted);
    wsRequest.once('requestResolved', this._handlers.requestResolved);
    socket.once('close', function () {
        self._handlers.requestResolved(wsRequest);
    });

    if (!this.config.autoAcceptConnections && utils.eventEmitterListenerCount(this, 'request') > 0) {
        this.emit('request', wsRequest);
    }
    else if (this.config.autoAcceptConnections) {
        wsRequest.accept(wsRequest.requestedProtocols[0], wsRequest.origin);
    }
    else {
        wsRequest.reject(404, 'No handler is configured to accept the connection.');
    }
};

WebSocketServer.prototype.handleRequestAccepted = function(connection) {
    var self = this;
    connection.once('close', function(closeReason, description) {
        self.handleConnectionClose(connection, closeReason, description);
    });
    this.connections.push(connection);
    this.emit('connect', connection);
};

WebSocketServer.prototype.handleConnectionClose = function(connection, closeReason, description) {
    var index = this.connections.indexOf(connection);
    if (index !== -1) {
        this.connections.splice(index, 1);
    }
    this.emit('close', connection, closeReason, description);
};

WebSocketServer.prototype.handleRequestResolved = function(request) {
    var index = this.pendingRequests.indexOf(request);
    if (index !== -1) { this.pendingRequests.splice(index, 1); }
};

module.exports = WebSocketServer;


/***/ }),

/***/ 4407:
/***/ ((__unused_webpack_module, exports, __nccwpck_require__) => {

var noop = exports.noop = function(){};

exports.extend = function extend(dest, source) {
    for (var prop in source) {
        dest[prop] = source[prop];
    }
};

exports.eventEmitterListenerCount =
    (__nccwpck_require__(2361).EventEmitter.listenerCount) ||
    function(emitter, type) { return emitter.listeners(type).length; };

exports.bufferAllocUnsafe = Buffer.allocUnsafe ?
    Buffer.allocUnsafe :
    function oldBufferAllocUnsafe(size) { return new Buffer(size); };

exports.bufferFromString = Buffer.from ?
    Buffer.from :
    function oldBufferFromString(string, encoding) {
      return new Buffer(string, encoding);
    };

exports.BufferingLogger = function createBufferingLogger(identifier, uniqueID) {
    var logFunction = __nccwpck_require__(1831)(identifier);
    if (logFunction.enabled) {
        var logger = new BufferingLogger(identifier, uniqueID, logFunction);
        var debug = logger.log.bind(logger);
        debug.printOutput = logger.printOutput.bind(logger);
        debug.enabled = logFunction.enabled;
        return debug;
    }
    logFunction.printOutput = noop;
    return logFunction;
};

function BufferingLogger(identifier, uniqueID, logFunction) {
    this.logFunction = logFunction;
    this.identifier = identifier;
    this.uniqueID = uniqueID;
    this.buffer = [];
}

BufferingLogger.prototype.log = function() {
  this.buffer.push([ new Date(), Array.prototype.slice.call(arguments) ]);
  return this;
};

BufferingLogger.prototype.clear = function() {
  this.buffer = [];
  return this;
};

BufferingLogger.prototype.printOutput = function(logFunction) {
    if (!logFunction) { logFunction = this.logFunction; }
    var uniqueID = this.uniqueID;
    this.buffer.forEach(function(entry) {
        var date = entry[0].toLocaleString();
        var args = entry[1].slice();
        var formatString = args[0];
        if (formatString !== (void 0) && formatString !== null) {
            formatString = '%s - %s - ' + formatString.toString();
            args.splice(0, 1, formatString, date, uniqueID);
            logFunction.apply(global, args);
        }
    });
};


/***/ }),

/***/ 8756:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = __nccwpck_require__(9794).version;


/***/ }),

/***/ 3692:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = {
    'server'       : __nccwpck_require__(579),
    'client'       : __nccwpck_require__(4625),
    'router'       : __nccwpck_require__(8235),
    'frame'        : __nccwpck_require__(2535),
    'request'      : __nccwpck_require__(1264),
    'connection'   : __nccwpck_require__(7745),
    'w3cwebsocket' : __nccwpck_require__(5878),
    'deprecation'  : __nccwpck_require__(5073),
    'version'      : __nccwpck_require__(8756)
};


/***/ }),

/***/ 1930:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * This is the web browser implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __nccwpck_require__(9546);
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;
exports.storage = 'undefined' != typeof chrome
               && 'undefined' != typeof chrome.storage
                  ? chrome.storage.local
                  : localstorage();

/**
 * Colors.
 */

exports.colors = [
  'lightseagreen',
  'forestgreen',
  'goldenrod',
  'dodgerblue',
  'darkorchid',
  'crimson'
];

/**
 * Currently only WebKit-based Web Inspectors, Firefox >= v31,
 * and the Firebug extension (any Firefox version) are known
 * to support "%c" CSS customizations.
 *
 * TODO: add a `localStorage` variable to explicitly enable/disable colors
 */

function useColors() {
  // NB: In an Electron preload script, document will be defined but not fully
  // initialized. Since we know we're in Chrome, we'll just detect this case
  // explicitly
  if (typeof window !== 'undefined' && window.process && window.process.type === 'renderer') {
    return true;
  }

  // is webkit? http://stackoverflow.com/a/16459606/376773
  // document is undefined in react-native: https://github.com/facebook/react-native/pull/1632
  return (typeof document !== 'undefined' && document.documentElement && document.documentElement.style && document.documentElement.style.WebkitAppearance) ||
    // is firebug? http://stackoverflow.com/a/398120/376773
    (typeof window !== 'undefined' && window.console && (window.console.firebug || (window.console.exception && window.console.table))) ||
    // is firefox >= v31?
    // https://developer.mozilla.org/en-US/docs/Tools/Web_Console#Styling_messages
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) && parseInt(RegExp.$1, 10) >= 31) ||
    // double check webkit in userAgent just in case we are in a worker
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
}

/**
 * Map %j to `JSON.stringify()`, since no Web Inspectors do that by default.
 */

exports.formatters.j = function(v) {
  try {
    return JSON.stringify(v);
  } catch (err) {
    return '[UnexpectedJSONParseError]: ' + err.message;
  }
};


/**
 * Colorize log arguments if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var useColors = this.useColors;

  args[0] = (useColors ? '%c' : '')
    + this.namespace
    + (useColors ? ' %c' : ' ')
    + args[0]
    + (useColors ? '%c ' : ' ')
    + '+' + exports.humanize(this.diff);

  if (!useColors) return;

  var c = 'color: ' + this.color;
  args.splice(1, 0, c, 'color: inherit')

  // the final "%c" is somewhat tricky, because there could be other
  // arguments passed either before or after the %c, so we need to
  // figure out the correct index to insert the CSS into
  var index = 0;
  var lastC = 0;
  args[0].replace(/%[a-zA-Z%]/g, function(match) {
    if ('%%' === match) return;
    index++;
    if ('%c' === match) {
      // we only are interested in the *last* %c
      // (the user may have provided their own)
      lastC = index;
    }
  });

  args.splice(lastC, 0, c);
}

/**
 * Invokes `console.log()` when available.
 * No-op when `console.log` is not a "function".
 *
 * @api public
 */

function log() {
  // this hackery is required for IE8/9, where
  // the `console.log` function doesn't have 'apply'
  return 'object' === typeof console
    && console.log
    && Function.prototype.apply.call(console.log, console, arguments);
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  try {
    if (null == namespaces) {
      exports.storage.removeItem('debug');
    } else {
      exports.storage.debug = namespaces;
    }
  } catch(e) {}
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  var r;
  try {
    r = exports.storage.debug;
  } catch(e) {}

  // If debug isn't set in LS, and we're in Electron, try to load $DEBUG
  if (!r && typeof process !== 'undefined' && 'env' in process) {
    r = process.env.DEBUG;
  }

  return r;
}

/**
 * Enable namespaces listed in `localStorage.debug` initially.
 */

exports.enable(load());

/**
 * Localstorage attempts to return the localstorage.
 *
 * This is necessary because safari throws
 * when a user disables cookies/localstorage
 * and you attempt to access it.
 *
 * @return {LocalStorage}
 * @api private
 */

function localstorage() {
  try {
    return window.localStorage;
  } catch (e) {}
}


/***/ }),

/***/ 9546:
/***/ ((module, exports, __nccwpck_require__) => {


/**
 * This is the common logic for both the Node.js and web browser
 * implementations of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = createDebug.debug = createDebug['default'] = createDebug;
exports.coerce = coerce;
exports.disable = disable;
exports.enable = enable;
exports.enabled = enabled;
exports.humanize = __nccwpck_require__(4035);

/**
 * The currently active debug mode names, and names to skip.
 */

exports.names = [];
exports.skips = [];

/**
 * Map of special "%n" handling functions, for the debug "format" argument.
 *
 * Valid key names are a single, lower or upper-case letter, i.e. "n" and "N".
 */

exports.formatters = {};

/**
 * Previous log timestamp.
 */

var prevTime;

/**
 * Select a color.
 * @param {String} namespace
 * @return {Number}
 * @api private
 */

function selectColor(namespace) {
  var hash = 0, i;

  for (i in namespace) {
    hash  = ((hash << 5) - hash) + namespace.charCodeAt(i);
    hash |= 0; // Convert to 32bit integer
  }

  return exports.colors[Math.abs(hash) % exports.colors.length];
}

/**
 * Create a debugger with the given `namespace`.
 *
 * @param {String} namespace
 * @return {Function}
 * @api public
 */

function createDebug(namespace) {

  function debug() {
    // disabled?
    if (!debug.enabled) return;

    var self = debug;

    // set `diff` timestamp
    var curr = +new Date();
    var ms = curr - (prevTime || curr);
    self.diff = ms;
    self.prev = prevTime;
    self.curr = curr;
    prevTime = curr;

    // turn the `arguments` into a proper Array
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }

    args[0] = exports.coerce(args[0]);

    if ('string' !== typeof args[0]) {
      // anything else let's inspect with %O
      args.unshift('%O');
    }

    // apply any `formatters` transformations
    var index = 0;
    args[0] = args[0].replace(/%([a-zA-Z%])/g, function(match, format) {
      // if we encounter an escaped % then don't increase the array index
      if (match === '%%') return match;
      index++;
      var formatter = exports.formatters[format];
      if ('function' === typeof formatter) {
        var val = args[index];
        match = formatter.call(self, val);

        // now we need to remove `args[index]` since it's inlined in the `format`
        args.splice(index, 1);
        index--;
      }
      return match;
    });

    // apply env-specific formatting (colors, etc.)
    exports.formatArgs.call(self, args);

    var logFn = debug.log || exports.log || console.log.bind(console);
    logFn.apply(self, args);
  }

  debug.namespace = namespace;
  debug.enabled = exports.enabled(namespace);
  debug.useColors = exports.useColors();
  debug.color = selectColor(namespace);

  // env-specific initialization logic for debug instances
  if ('function' === typeof exports.init) {
    exports.init(debug);
  }

  return debug;
}

/**
 * Enables a debug mode by namespaces. This can include modes
 * separated by a colon and wildcards.
 *
 * @param {String} namespaces
 * @api public
 */

function enable(namespaces) {
  exports.save(namespaces);

  exports.names = [];
  exports.skips = [];

  var split = (typeof namespaces === 'string' ? namespaces : '').split(/[\s,]+/);
  var len = split.length;

  for (var i = 0; i < len; i++) {
    if (!split[i]) continue; // ignore empty strings
    namespaces = split[i].replace(/\*/g, '.*?');
    if (namespaces[0] === '-') {
      exports.skips.push(new RegExp('^' + namespaces.substr(1) + '$'));
    } else {
      exports.names.push(new RegExp('^' + namespaces + '$'));
    }
  }
}

/**
 * Disable debug output.
 *
 * @api public
 */

function disable() {
  exports.enable('');
}

/**
 * Returns true if the given mode name is enabled, false otherwise.
 *
 * @param {String} name
 * @return {Boolean}
 * @api public
 */

function enabled(name) {
  var i, len;
  for (i = 0, len = exports.skips.length; i < len; i++) {
    if (exports.skips[i].test(name)) {
      return false;
    }
  }
  for (i = 0, len = exports.names.length; i < len; i++) {
    if (exports.names[i].test(name)) {
      return true;
    }
  }
  return false;
}

/**
 * Coerce `val`.
 *
 * @param {Mixed} val
 * @return {Mixed}
 * @api private
 */

function coerce(val) {
  if (val instanceof Error) return val.stack || val.message;
  return val;
}


/***/ }),

/***/ 1831:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

/**
 * Detect Electron renderer process, which is node, but we should
 * treat as a browser.
 */

if (typeof process !== 'undefined' && process.type === 'renderer') {
  module.exports = __nccwpck_require__(1930);
} else {
  module.exports = __nccwpck_require__(7692);
}


/***/ }),

/***/ 7692:
/***/ ((module, exports, __nccwpck_require__) => {

/**
 * Module dependencies.
 */

var tty = __nccwpck_require__(6224);
var util = __nccwpck_require__(3837);

/**
 * This is the Node.js implementation of `debug()`.
 *
 * Expose `debug()` as the module.
 */

exports = module.exports = __nccwpck_require__(9546);
exports.init = init;
exports.log = log;
exports.formatArgs = formatArgs;
exports.save = save;
exports.load = load;
exports.useColors = useColors;

/**
 * Colors.
 */

exports.colors = [6, 2, 3, 4, 5, 1];

/**
 * Build up the default `inspectOpts` object from the environment variables.
 *
 *   $ DEBUG_COLORS=no DEBUG_DEPTH=10 DEBUG_SHOW_HIDDEN=enabled node script.js
 */

exports.inspectOpts = Object.keys(process.env).filter(function (key) {
  return /^debug_/i.test(key);
}).reduce(function (obj, key) {
  // camel-case
  var prop = key
    .substring(6)
    .toLowerCase()
    .replace(/_([a-z])/g, function (_, k) { return k.toUpperCase() });

  // coerce string value into JS value
  var val = process.env[key];
  if (/^(yes|on|true|enabled)$/i.test(val)) val = true;
  else if (/^(no|off|false|disabled)$/i.test(val)) val = false;
  else if (val === 'null') val = null;
  else val = Number(val);

  obj[prop] = val;
  return obj;
}, {});

/**
 * The file descriptor to write the `debug()` calls to.
 * Set the `DEBUG_FD` env variable to override with another value. i.e.:
 *
 *   $ DEBUG_FD=3 node script.js 3>debug.log
 */

var fd = parseInt(process.env.DEBUG_FD, 10) || 2;

if (1 !== fd && 2 !== fd) {
  util.deprecate(function(){}, 'except for stderr(2) and stdout(1), any other usage of DEBUG_FD is deprecated. Override debug.log if you want to use a different log function (https://git.io/debug_fd)')()
}

var stream = 1 === fd ? process.stdout :
             2 === fd ? process.stderr :
             createWritableStdioStream(fd);

/**
 * Is stdout a TTY? Colored output is enabled when `true`.
 */

function useColors() {
  return 'colors' in exports.inspectOpts
    ? Boolean(exports.inspectOpts.colors)
    : tty.isatty(fd);
}

/**
 * Map %o to `util.inspect()`, all on a single line.
 */

exports.formatters.o = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts)
    .split('\n').map(function(str) {
      return str.trim()
    }).join(' ');
};

/**
 * Map %o to `util.inspect()`, allowing multiple lines if needed.
 */

exports.formatters.O = function(v) {
  this.inspectOpts.colors = this.useColors;
  return util.inspect(v, this.inspectOpts);
};

/**
 * Adds ANSI color escape codes if enabled.
 *
 * @api public
 */

function formatArgs(args) {
  var name = this.namespace;
  var useColors = this.useColors;

  if (useColors) {
    var c = this.color;
    var prefix = '  \u001b[3' + c + ';1m' + name + ' ' + '\u001b[0m';

    args[0] = prefix + args[0].split('\n').join('\n' + prefix);
    args.push('\u001b[3' + c + 'm+' + exports.humanize(this.diff) + '\u001b[0m');
  } else {
    args[0] = new Date().toUTCString()
      + ' ' + name + ' ' + args[0];
  }
}

/**
 * Invokes `util.format()` with the specified arguments and writes to `stream`.
 */

function log() {
  return stream.write(util.format.apply(util, arguments) + '\n');
}

/**
 * Save `namespaces`.
 *
 * @param {String} namespaces
 * @api private
 */

function save(namespaces) {
  if (null == namespaces) {
    // If you set a process.env field to null or undefined, it gets cast to the
    // string 'null' or 'undefined'. Just delete instead.
    delete process.env.DEBUG;
  } else {
    process.env.DEBUG = namespaces;
  }
}

/**
 * Load `namespaces`.
 *
 * @return {String} returns the previously persisted debug modes
 * @api private
 */

function load() {
  return process.env.DEBUG;
}

/**
 * Copied from `node/src/node.js`.
 *
 * XXX: It's lame that node doesn't expose this API out-of-the-box. It also
 * relies on the undocumented `tty_wrap.guessHandleType()` which is also lame.
 */

function createWritableStdioStream (fd) {
  var stream;
  var tty_wrap = process.binding('tty_wrap');

  // Note stream._type is used for test-module-load-list.js

  switch (tty_wrap.guessHandleType(fd)) {
    case 'TTY':
      stream = new tty.WriteStream(fd);
      stream._type = 'tty';

      // Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    case 'FILE':
      var fs = __nccwpck_require__(7147);
      stream = new fs.SyncWriteStream(fd, { autoClose: false });
      stream._type = 'fs';
      break;

    case 'PIPE':
    case 'TCP':
      var net = __nccwpck_require__(1808);
      stream = new net.Socket({
        fd: fd,
        readable: false,
        writable: true
      });

      // FIXME Should probably have an option in net.Socket to create a
      // stream from an existing fd which is writable only. But for now
      // we'll just add this hack and set the `readable` member to false.
      // Test: ./node test/fixtures/echo.js < /etc/passwd
      stream.readable = false;
      stream.read = null;
      stream._type = 'pipe';

      // FIXME Hack to have stream not keep the event loop alive.
      // See https://github.com/joyent/node/issues/1726
      if (stream._handle && stream._handle.unref) {
        stream._handle.unref();
      }
      break;

    default:
      // Probably an error on in uv_guess_handle()
      throw new Error('Implement me. Unknown stream file type!');
  }

  // For supporting legacy API we put the FD here.
  stream.fd = fd;

  stream._isStdio = true;

  return stream;
}

/**
 * Init logic for `debug` instances.
 *
 * Create a new `inspectOpts` object in case `useColors` is set
 * differently for a particular `debug` instance.
 */

function init (debug) {
  debug.inspectOpts = {};

  var keys = Object.keys(exports.inspectOpts);
  for (var i = 0; i < keys.length; i++) {
    debug.inspectOpts[keys[i]] = exports.inspectOpts[keys[i]];
  }
}

/**
 * Enable namespaces listed in `process.env.DEBUG` initially.
 */

exports.enable(load());


/***/ }),

/***/ 4035:
/***/ ((module) => {

/**
 * Helpers.
 */

var s = 1000;
var m = s * 60;
var h = m * 60;
var d = h * 24;
var y = d * 365.25;

/**
 * Parse or format the given `val`.
 *
 * Options:
 *
 *  - `long` verbose formatting [false]
 *
 * @param {String|Number} val
 * @param {Object} [options]
 * @throws {Error} throw an error if val is not a non-empty string or a number
 * @return {String|Number}
 * @api public
 */

module.exports = function(val, options) {
  options = options || {};
  var type = typeof val;
  if (type === 'string' && val.length > 0) {
    return parse(val);
  } else if (type === 'number' && isNaN(val) === false) {
    return options.long ? fmtLong(val) : fmtShort(val);
  }
  throw new Error(
    'val is not a non-empty string or a valid number. val=' +
      JSON.stringify(val)
  );
};

/**
 * Parse the given `str` and return milliseconds.
 *
 * @param {String} str
 * @return {Number}
 * @api private
 */

function parse(str) {
  str = String(str);
  if (str.length > 100) {
    return;
  }
  var match = /^((?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|years?|yrs?|y)?$/i.exec(
    str
  );
  if (!match) {
    return;
  }
  var n = parseFloat(match[1]);
  var type = (match[2] || 'ms').toLowerCase();
  switch (type) {
    case 'years':
    case 'year':
    case 'yrs':
    case 'yr':
    case 'y':
      return n * y;
    case 'days':
    case 'day':
    case 'd':
      return n * d;
    case 'hours':
    case 'hour':
    case 'hrs':
    case 'hr':
    case 'h':
      return n * h;
    case 'minutes':
    case 'minute':
    case 'mins':
    case 'min':
    case 'm':
      return n * m;
    case 'seconds':
    case 'second':
    case 'secs':
    case 'sec':
    case 's':
      return n * s;
    case 'milliseconds':
    case 'millisecond':
    case 'msecs':
    case 'msec':
    case 'ms':
      return n;
    default:
      return undefined;
  }
}

/**
 * Short format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtShort(ms) {
  if (ms >= d) {
    return Math.round(ms / d) + 'd';
  }
  if (ms >= h) {
    return Math.round(ms / h) + 'h';
  }
  if (ms >= m) {
    return Math.round(ms / m) + 'm';
  }
  if (ms >= s) {
    return Math.round(ms / s) + 's';
  }
  return ms + 'ms';
}

/**
 * Long format for `ms`.
 *
 * @param {Number} ms
 * @return {String}
 * @api private
 */

function fmtLong(ms) {
  return plural(ms, d, 'day') ||
    plural(ms, h, 'hour') ||
    plural(ms, m, 'minute') ||
    plural(ms, s, 'second') ||
    ms + ' ms';
}

/**
 * Pluralization helper.
 */

function plural(ms, n, name) {
  if (ms < n) {
    return;
  }
  if (ms < n * 1.5) {
    return Math.floor(ms / n) + ' ' + name;
  }
  return Math.ceil(ms / n) + ' ' + name + 's';
}


/***/ }),

/***/ 1091:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

// This file was copied from https://github.com/substack/node-bufferlist
// and modified to be able to copy bytes from the bufferlist directly into
// a pre-existing fixed-size buffer without an additional memory allocation.

// bufferlist.js
// Treat a linked list of buffers as a single variable-size buffer.
var Buffer = (__nccwpck_require__(4300).Buffer);
var EventEmitter = (__nccwpck_require__(2361).EventEmitter);
var bufferAllocUnsafe = (__nccwpck_require__(4407).bufferAllocUnsafe);

module.exports = BufferList;
module.exports.BufferList = BufferList; // backwards compatibility

function BufferList(opts) {
    if (!(this instanceof BufferList)) return new BufferList(opts);
    EventEmitter.call(this);
    var self = this;
    
    if (typeof(opts) == 'undefined') opts = {};
    
    // default encoding to use for take(). Leaving as 'undefined'
    // makes take() return a Buffer instead.
    self.encoding = opts.encoding;
    
    var head = { next : null, buffer : null };
    var last = { next : null, buffer : null };
    
    // length can get negative when advanced past the end
    // and this is the desired behavior
    var length = 0;
    self.__defineGetter__('length', function () {
        return length;
    });
    
    // keep an offset of the head to decide when to head = head.next
    var offset = 0;
    
    // Write to the bufferlist. Emits 'write'. Always returns true.
    self.write = function (buf) {
        if (!head.buffer) {
            head.buffer = buf;
            last = head;
        }
        else {
            last.next = { next : null, buffer : buf };
            last = last.next;
        }
        length += buf.length;
        self.emit('write', buf);
        return true;
    };
    
    self.end = function (buf) {
        if (Buffer.isBuffer(buf)) self.write(buf);
    };
    
    // Push buffers to the end of the linked list. (deprecated)
    // Return this (self).
    self.push = function () {
        var args = [].concat.apply([], arguments);
        args.forEach(self.write);
        return self;
    };
    
    // For each buffer, perform some action.
    // If fn's result is a true value, cut out early.
    // Returns this (self).
    self.forEach = function (fn) {
        if (!head.buffer) return bufferAllocUnsafe(0);
        
        if (head.buffer.length - offset <= 0) return self;
        var firstBuf = head.buffer.slice(offset);
        
        var b = { buffer : firstBuf, next : head.next };
        
        while (b && b.buffer) {
            var r = fn(b.buffer);
            if (r) break;
            b = b.next;
        }
        
        return self;
    };
    
    // Create a single Buffer out of all the chunks or some subset specified by
    // start and one-past the end (like slice) in bytes.
    self.join = function (start, end) {
        if (!head.buffer) return bufferAllocUnsafe(0);
        if (start == undefined) start = 0;
        if (end == undefined) end = self.length;
        
        var big = bufferAllocUnsafe(end - start);
        var ix = 0;
        self.forEach(function (buffer) {
            if (start < (ix + buffer.length) && ix < end) {
                // at least partially contained in the range
                buffer.copy(
                    big,
                    Math.max(0, ix - start),
                    Math.max(0, start - ix),
                    Math.min(buffer.length, end - ix)
                );
            }
            ix += buffer.length;
            if (ix > end) return true; // stop processing past end
        });
        
        return big;
    };
    
    self.joinInto = function (targetBuffer, targetStart, sourceStart, sourceEnd) {
        if (!head.buffer) return new bufferAllocUnsafe(0);
        if (sourceStart == undefined) sourceStart = 0;
        if (sourceEnd == undefined) sourceEnd = self.length;
        
        var big = targetBuffer;
        if (big.length - targetStart < sourceEnd - sourceStart) {
            throw new Error("Insufficient space available in target Buffer.");
        }
        var ix = 0;
        self.forEach(function (buffer) {
            if (sourceStart < (ix + buffer.length) && ix < sourceEnd) {
                // at least partially contained in the range
                buffer.copy(
                    big,
                    Math.max(targetStart, targetStart + ix - sourceStart),
                    Math.max(0, sourceStart - ix),
                    Math.min(buffer.length, sourceEnd - ix)
                );
            }
            ix += buffer.length;
            if (ix > sourceEnd) return true; // stop processing past end
        });
        
        return big;
    };
    
    // Advance the buffer stream by n bytes.
    // If n the aggregate advance offset passes the end of the buffer list,
    // operations such as .take() will return empty strings until enough data is
    // pushed.
    // Returns this (self).
    self.advance = function (n) {
        offset += n;
        length -= n;
        while (head.buffer && offset >= head.buffer.length) {
            offset -= head.buffer.length;
            head = head.next
                ? head.next
                : { buffer : null, next : null }
            ;
        }
        if (head.buffer === null) last = { next : null, buffer : null };
        self.emit('advance', n);
        return self;
    };
    
    // Take n bytes from the start of the buffers.
    // Returns a string.
    // If there are less than n bytes in all the buffers or n is undefined,
    // returns the entire concatenated buffer string.
    self.take = function (n, encoding) {
        if (n == undefined) n = self.length;
        else if (typeof n !== 'number') {
            encoding = n;
            n = self.length;
        }
        var b = head;
        if (!encoding) encoding = self.encoding;
        if (encoding) {
            var acc = '';
            self.forEach(function (buffer) {
                if (n <= 0) return true;
                acc += buffer.toString(
                    encoding, 0, Math.min(n,buffer.length)
                );
                n -= buffer.length;
            });
            return acc;
        } else {
            // If no 'encoding' is specified, then return a Buffer.
            return self.join(0, n);
        }
    };
    
    // The entire concatenated buffer as a string.
    self.toString = function () {
        return self.take('binary');
    };
}
(__nccwpck_require__(3837).inherits)(BufferList, EventEmitter);


/***/ }),

/***/ 5438:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

module.exports = {
	EventTarget : __nccwpck_require__(8133),
	Event       : __nccwpck_require__(6614)
};


/***/ }),

/***/ 6614:
/***/ ((module) => {

/**
 * Expose the Event class.
 */
module.exports = _Event;


function _Event(type) {
	this.type = type;
	this.isTrusted = false;

	// Set a flag indicating this is not a DOM Event object
	this._yaeti = true;
}


/***/ }),

/***/ 8133:
/***/ ((module) => {

/**
 * Expose the _EventTarget class.
 */
module.exports = _EventTarget;

function _EventTarget() {
	// Do nothing if called for a native EventTarget object..
	if (typeof this.addEventListener === 'function') {
		return;
	}

	this._listeners = {};

	this.addEventListener = _addEventListener;
	this.removeEventListener = _removeEventListener;
	this.dispatchEvent = _dispatchEvent;
}

Object.defineProperties(_EventTarget.prototype, {
	listeners: {
		get: function () {
			return this._listeners;
		}
	}
});

function _addEventListener(type, newListener) {
	var
		listenersType,
		i, listener;

	if (!type || !newListener) {
		return;
	}

	listenersType = this._listeners[type];
	if (listenersType === undefined) {
		this._listeners[type] = listenersType = [];
	}

	for (i = 0; !!(listener = listenersType[i]); i++) {
		if (listener === newListener) {
			return;
		}
	}

	listenersType.push(newListener);
}

function _removeEventListener(type, oldListener) {
	var
		listenersType,
		i, listener;

	if (!type || !oldListener) {
		return;
	}

	listenersType = this._listeners[type];
	if (listenersType === undefined) {
		return;
	}

	for (i = 0; !!(listener = listenersType[i]); i++) {
		if (listener === oldListener) {
			listenersType.splice(i, 1);
			break;
		}
	}

	if (listenersType.length === 0) {
		delete this._listeners[type];
	}
}

function _dispatchEvent(event) {
	var
		type,
		listenersType,
		dummyListener,
		stopImmediatePropagation = false,
		i, listener;

	if (!event || typeof event.type !== 'string') {
		throw new Error('`event` must have a valid `type` property');
	}

	// Do some stuff to emulate DOM Event behavior (just if this is not a
	// DOM Event object)
	if (event._yaeti) {
		event.target = this;
		event.cancelable = true;
	}

	// Attempt to override the stopImmediatePropagation() method
	try {
		event.stopImmediatePropagation = function () {
			stopImmediatePropagation = true;
		};
	} catch (error) {}

	type = event.type;
	listenersType = (this._listeners[type] || []);

	dummyListener = this['on' + type];
	if (typeof dummyListener === 'function') {
		dummyListener.call(this, event);
	}

	for (i = 0; !!(listener = listenersType[i]); i++) {
		if (stopImmediatePropagation) {
			break;
		}

		listener.call(this, event);
	}

	return !event.defaultPrevented;
}


/***/ }),

/***/ 458:
/***/ ((module, __unused_webpack_exports, __nccwpck_require__) => {

__nccwpck_require__(3);
const { nip19, getPublicKey, getEventHash, signEvent, SimplePool } = __nccwpck_require__(259);
const { setTimeout } = __nccwpck_require__(9397);

/**
 * @param {string} privateKey
 * @param {string} content
 */
module.exports.createEvent = (privateKey, content) => {
  if (privateKey.startsWith('nsec')) {
    privateKey = nip19.decode(privateKey).data;
  }

  const kind = 1;
  const tags = [];
  const createdAt = Math.round(Date.now() / 1000);
  let event = {
    created_at: createdAt,
    kind,
    tags,
    content,
    pubkey: getPublicKey(privateKey),
  };
  event.id = getEventHash(event);
  event.sig = signEvent(event, privateKey);

  console.log('[event]', event);

  return event;
};

/**
 * @param {string[]} relays
 * @param {Event} event
 */
module.exports.publishEvent = (relays, event) => {
  console.log('[publish]', relays, event);

  return new Promise((resolve, reject) => {
    const pool = new SimplePool();
    const publishedRelays = [];
    const failedRelays = [];
    const close = () => {
      console.log('[close]');
      pool.close(relays);
      if (publishedRelays.length > 0) {
        resolve();
      } else {
        reject();
      }
    }
    const closeIfCompleted = () => {
      console.log('[ok | failed]', relays.length, publishedRelays.length, failedRelays.length);
      if (relays.length === publishedRelays.length + failedRelays.length) {
        close()
      }
    };
    setTimeout(() => {
      console.warn('[timeout]', relays, publishedRelays, failedRelays);
      close();
    }, 5000);

    const start = Date.now();
    const pub = pool.publish(relays, event);
    pub.on('ok', relay => {
      console.info('[ok]', relay, `${Date.now() - start}ms`);
      publishedRelays.push(relay);
      closeIfCompleted();
    });
    pub.on('failed', relay => {
      console.warn('[failed]', relay, `${Date.now() - start}ms`);
      failedRelays.push(relay);
      closeIfCompleted();
    });
  });
};


/***/ }),

/***/ 9491:
/***/ ((module) => {

"use strict";
module.exports = require("assert");

/***/ }),

/***/ 4300:
/***/ ((module) => {

"use strict";
module.exports = require("buffer");

/***/ }),

/***/ 6113:
/***/ ((module) => {

"use strict";
module.exports = require("crypto");

/***/ }),

/***/ 2361:
/***/ ((module) => {

"use strict";
module.exports = require("events");

/***/ }),

/***/ 7147:
/***/ ((module) => {

"use strict";
module.exports = require("fs");

/***/ }),

/***/ 3685:
/***/ ((module) => {

"use strict";
module.exports = require("http");

/***/ }),

/***/ 5687:
/***/ ((module) => {

"use strict";
module.exports = require("https");

/***/ }),

/***/ 1808:
/***/ ((module) => {

"use strict";
module.exports = require("net");

/***/ }),

/***/ 9397:
/***/ ((module) => {

"use strict";
module.exports = require("node:timers/promises");

/***/ }),

/***/ 2037:
/***/ ((module) => {

"use strict";
module.exports = require("os");

/***/ }),

/***/ 1017:
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ }),

/***/ 4404:
/***/ ((module) => {

"use strict";
module.exports = require("tls");

/***/ }),

/***/ 6224:
/***/ ((module) => {

"use strict";
module.exports = require("tty");

/***/ }),

/***/ 7310:
/***/ ((module) => {

"use strict";
module.exports = require("url");

/***/ }),

/***/ 3837:
/***/ ((module) => {

"use strict";
module.exports = require("util");

/***/ }),

/***/ 9794:
/***/ ((module) => {

"use strict";
module.exports = {"version":"1.0.34"};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nccwpck_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		var threw = true;
/******/ 		try {
/******/ 			__webpack_modules__[moduleId].call(module.exports, module, module.exports, __nccwpck_require__);
/******/ 			threw = false;
/******/ 		} finally {
/******/ 			if(threw) delete __webpack_module_cache__[moduleId];
/******/ 		}
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat */
/******/ 	
/******/ 	if (typeof __nccwpck_require__ !== 'undefined') __nccwpck_require__.ab = __dirname + "/";
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
const core = __nccwpck_require__(2186);
const { createEvent, publishEvent } = __nccwpck_require__(458);

async function run() {
  try {
    const relaysInput = core.getInput('relays');
    const relays = relaysInput.split("\n").map(x => x.trim()).filter(x => x.startsWith('wss://'));
    const privateKey = core.getInput('private-key');
    const content = core.getInput('content');
    core.setSecret(privateKey);
    const event = createEvent(privateKey, content);
    await publishEvent(relays, event);
    core.setOutput('event', JSON.stringify(event));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();

})();

module.exports = __webpack_exports__;
/******/ })()
;
//# sourceMappingURL=index.js.map