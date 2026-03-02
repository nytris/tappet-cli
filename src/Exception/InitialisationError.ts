/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Thrown when Tappet initialisation fails.
 */
export class InitialisationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'InitialisationError';
    }
}
