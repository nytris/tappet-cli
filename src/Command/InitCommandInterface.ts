/*
 * Tappet - Enjoyable GUI testing.
 * Copyright (c) Dan Phillimore (asmblah)
 * https://github.com/nytris/tappet-cli/
 *
 * Released under the MIT license
 * https://github.com/nytris/tappet-cli/raw/main/MIT-LICENSE.txt
 */

/**
 * Interface for the init command.
 */
export interface InitCommandInterface {
    /**
     * Runs the init command, prompting the user for an adapter and setting up the project.
     */
    run(): Promise<void>;
}
