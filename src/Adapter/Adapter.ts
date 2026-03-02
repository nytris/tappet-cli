/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Represents a supported testing adapter.
 */
export interface Adapter {
    /**
     * The human-readable label for the adapter.
     */
    label: string;

    /**
     * The NPM package to install for this adapter.
     */
    npmPackage: string;

    /**
     * The value used to identify the adapter in the config file.
     */
    value: string;
}
