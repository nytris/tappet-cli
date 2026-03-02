/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for detecting Tappet config files.
 */
export interface ConfigFileDetectorInterface {
    /**
     * Checks whether a Tappet config file exists in the current working directory.
     */
    exists(): boolean;
}
