/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for installing NPM packages.
 */
export interface NpmInstallerInterface {
    /**
     * Installs the given NPM package.
     *
     * @param packageName The NPM package name (e.g. '@tappet/cypress').
     */
    install(packageName: string): void;
}
