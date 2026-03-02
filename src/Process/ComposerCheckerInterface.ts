/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for checking Composer availability.
 */
export interface ComposerCheckerInterface {
    /**
     * Checks whether Composer is available on the system.
     */
    isAvailable(): boolean;
}
