/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * The result of running an external process.
 */
export interface ProcessResult {
    /**
     * The exit status code, or null if the process was killed by a signal.
     */
    status: number | null;
}
