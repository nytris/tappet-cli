/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for writing the Tappet config file.
 */
export interface ConfigFileWriterInterface {
    /**
     * Writes a tappet.config.js file to the current working directory.
     *
     * @param adapter The adapter value to configure (e.g. 'cypress').
     */
    write(adapter: string): void;
}
