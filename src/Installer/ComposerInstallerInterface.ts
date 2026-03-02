/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for installing Composer packages.
 */
export interface ComposerInstallerInterface {
    /**
     * Ensures the given Composer package is installed, installing it if not.
     * Gracefully skips if Composer is not available on the system.
     *
     * @param packageName The Composer package name (e.g. 'nytris/tappet').
     */
    ensureInstalled(packageName: string): Promise<void>;

    /**
     * Checks whether the given Composer package is already installed.
     *
     * @param packageName The Composer package name.
     */
    isInstalled(packageName: string): boolean;
}
