/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Options for running an external process.
 */
export interface ProcessRunOptions {
    /**
     * How to handle stdio. Use 'pipe' to suppress output, 'inherit' to forward it.
     * Defaults to 'inherit'.
     */
    stdio?: 'inherit' | 'pipe';
}
