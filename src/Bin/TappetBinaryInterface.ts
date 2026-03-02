/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for the Tappet binary.
 */
export interface TappetBinaryInterface {
    /**
     * Runs the binary with the given arguments.
     *
     * @param args Command line arguments.
     * @returns Exit code.
     */
    run(args: string[]): Promise<number>;
}
