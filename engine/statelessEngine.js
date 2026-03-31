// Custom Engine for stateless rendering
module.exports.renderStateless = renderStateless = (filePath, options, handler) => {
    // validate user arguments
    if (filePath === undefined || filePath === null || typeof(filePath) !== "string") {
        return handler('invalid argument: filePath');
    } else if (options === undefined || options === null || typeof(options) !== "object") {
        return handler('invalid argument: options');
    } else if (handler === undefined || handler === null || typeof(handler) !== "function") {
        return handler('invalid argument: handler');
    }
    // import file system module
    const fs = require('fs');
    fs.readFile(filePath, (error, content) => {
        // send file system errors to handler
        if (error) {
            handler(error);
        }

        // rendering logic
        const stringed = content.toString();
        const demarcator = Object.hasOwn(options, "demarcator") ? options.demarcator : '#'; // use custom demarcator or falla back to default
        const demarcated = stringed.split(`${options.demarcator}`);
        const demarcatedLength = demarcated.length;
        if (demarcatedLength > 1) {
            // is key

            if (demarcatedLength - 1 < 10000) {
                // under 10,000 maximum demarcators

                // get first key that is an option
                let keyStructure = [];
                let index = 1;
                for (let i = index; i < demarcatedLength; i += 2) {
                    const key = demarcated[i];
                    let cont = true;
                    for (const option in options) {
                        if (key === option) {
                            keyStructure.push([key, 1]);
                            cont = false;
                            index = i;
                            break;
                        }
                    }
                    if (!cont) {break};
                }
    
                if (keyStructure.length > 0 && index + 2 < demarcatedLength) {
                    // is options
    
                    for (let i = index + 2; i < demarcatedLength; i += 2) {
                        const key = demarcated[i];
                        let uniqueKey = true;
                        for (let j = 0; j < keyStructure.length; j++) {
                            // each iteration of j represents a comparison of key at i with key at j in keyStructure
                            if (key === keyStructure[j][0]) {
                                keyStructure[j][1] += 1;
                                uniqueKey = false;
                                break;
                            }
                        }
                        if (uniqueKey) {
                            // prevent adding new keys that aren't options
                            for (const option in options) {
                                if (key === option) {
                                    keyStructure.push([key, 1]);
                                    break;
                                }
                            }
                        }
                    }
                    
                    let render = stringed;
                    for (let i = 0; i < keyStructure.length; i++) {
                        const key = keyStructure[i][0];
                        for (let j = 0; j < keyStructure[i][1]; j++) {
                            render = render.replace(`${options.demarcator}${key}${options.demarcator}`, `${options[key]}`);
                        }
                    }
    
                    // send rendered content to handler
                    console.log('rendered');
                    return handler(null, render);
                    
                } else {
                    // isn't options
    
                    // send rendered content to handler
                    console.log('rendered');
                    return handler(null, stringed);
                }

            } else {
                // over maximum 10,000 demarcators

                // send rendered content to handler
                console.log('rendered');
                return handler(null, stringed);
            }

        } else {
            // isn't keys

            // send rendered content to handler
            console.log('rendered');
            return handler(null, stringed);
        }
    });
};